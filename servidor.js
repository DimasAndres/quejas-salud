const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const bcrypt = require('bcryptjs');

// Almacenamiento en memoria
let users = [];
let quejas = [];
let nextUserId = 1;
let nextQuejaId = 1;

// Función para parsear JSON del cuerpo de la petición
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        resolve({});
      }
    });
  });
}

// Función para enviar respuesta JSON
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Función para servir archivos estáticos
function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Archivo no encontrado');
      return;
    }
    
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.js') contentType = 'application/javascript';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Manejar CORS
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // API Routes
  if (pathname === '/api/register' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const { nombre, apellido, cedula, celular, correo, tipoUsuario, clave, aceptoPolitica } = body;
      
      // Verificar si el usuario ya existe
      const existingUser = users.find(u => u.cedula === cedula);
      if (existingUser) {
        sendJSON(res, 400, { error: 'Usuario ya existe con esta cédula' });
        return;
      }
      
      // Verificar que acepta la política
      if (!aceptoPolitica) {
        sendJSON(res, 400, { error: 'Debe aceptar la política de tratamiento de datos' });
        return;
      }
      
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(clave, 10);
      
      // Crear usuario
      const newUser = {
        id: nextUserId++,
        nombre,
        apellido,
        cedula,
        celular,
        correo,
        tipoUsuario,
        clave: hashedPassword,
        aceptoPolitica,
        fechaCreacion: new Date()
      };
      
      users.push(newUser);
      console.log(`✅ Usuario registrado: ${nombre} ${apellido} (${tipoUsuario})`);
      
      sendJSON(res, 200, { success: true, userId: newUser.id });
    } catch (error) {
      console.error('Error en registro:', error);
      sendJSON(res, 500, { error: 'Error al registrar usuario' });
    }
    return;
  }

  if (pathname === '/api/login' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const { cedula, clave } = body;
      
      const user = users.find(u => u.cedula === cedula);
      if (!user) {
        sendJSON(res, 401, { error: 'Credenciales inválidas' });
        return;
      }
      
      const validPassword = await bcrypt.compare(clave, user.clave);
      if (!validPassword) {
        sendJSON(res, 401, { error: 'Credenciales inválidas' });
        return;
      }
      
      console.log(`✅ Login exitoso: ${user.nombre} ${user.apellido}`);
      
      sendJSON(res, 200, { 
        success: true, 
        user: { 
          id: user.id, 
          nombre: user.nombre, 
          apellido: user.apellido,
          correo: user.correo,
          tipoUsuario: user.tipoUsuario 
        } 
      });
    } catch (error) {
      console.error('Error en login:', error);
      sendJSON(res, 500, { error: 'Error del servidor' });
    }
    return;
  }

  if (pathname === '/api/quejas' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const { usuarioId, problema, detalle, ciudad, departamento, correo, clasificacion, paraBeneficiario } = body;
      
      // Filtro básico de contenido
      const contenidoInapropiado = ['malo', 'horrible', 'pésimo', 'terrible', 'basura'];
      const textoCompleto = `${problema} ${detalle}`.toLowerCase();
      
      for (let palabra of contenidoInapropiado) {
        if (textoCompleto.includes(palabra)) {
          sendJSON(res, 400, { 
            error: 'El contenido de la queja contiene lenguaje inapropiado. Por favor, reformule su mensaje de manera respetuosa.' 
          });
          return;
        }
      }
      
      const nuevaQueja = {
        id: nextQuejaId++,
        usuarioId,
        problema,
        detalle,
        ciudad,
        departamento,
        correo,
        clasificacion,
        paraBeneficiario: paraBeneficiario || false,
        estado: 'pendiente',
        fechaCreacion: new Date()
      };
      
      quejas.push(nuevaQueja);
      
      console.log(`📋 Nueva queja registrada: ${problema} - ${departamento} (${clasificacion})`);
      
      sendJSON(res, 200, { success: true, quejaId: nuevaQueja.id });
    } catch (error) {
      console.error('Error en queja:', error);
      sendJSON(res, 500, { error: 'Error al registrar queja' });
    }
    return;
  }

  if (pathname.startsWith('/api/quejas/') && method === 'GET') {
    try {
      const userId = parseInt(pathname.split('/')[3]);
      const userQuejas = quejas.filter(q => q.usuarioId === userId);
      
      sendJSON(res, 200, userQuejas);
    } catch (error) {
      console.error('Error obteniendo quejas:', error);
      sendJSON(res, 500, { error: 'Error al obtener quejas' });
    }
    return;
  }

  // Servir archivos estáticos
  if (pathname === '/' || pathname === '/index.html') {
    serveFile(res, 'index.html');
    return;
  }

  // Para cualquier otra ruta, servir index.html (SPA)
  serveFile(res, 'index.html');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ================================');
  console.log('   VEEDURÍA NACIONAL DE SALUD');
  console.log('   Sistema de Recepción de Quejas');
  console.log('🚀 ================================');
  console.log(`✅ Servidor iniciado en puerto ${PORT}`);
  console.log(`🌐 Aplicación disponible en http://localhost:${PORT}`);
  console.log('💾 Usando almacenamiento en memoria');
  console.log('📊 Listo para recibir usuarios y quejas');
  console.log('================================');
});