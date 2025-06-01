const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const bcrypt = require('bcryptjs');
const { enviarNotificacionQueja } = require('./email-service');
const { revisarQueja, sugerirModificacion } = require('./filtro-quejas');

// Almacenamiento en memoria
let users = [];
let quejas = [];
let nextUserId = 1;
let nextQuejaId = 1;

// Datos de configuración
const DEPARTAMENTOS = {
    "Amazonas": ["Leticia", "Puerto Nariño"],
    "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Apartadó"],
    "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Puerto Colombia"],
    "Bogotá D.C.": ["Bogotá"],
    "Bolívar": ["Cartagena", "Turbaco", "Magangué", "El Carmen de Bolívar"],
    "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá"],
    "Caldas": ["Manizales", "La Dorada", "Villamaría", "Riosucio"],
    "Caquetá": ["Florencia", "San Vicente del Caguán"],
    "Casanare": ["Yopal", "Aguazul", "Villanueva"],
    "Cauca": ["Popayán", "Santander de Quilichao", "Puerto Tejada"],
    "Cesar": ["Valledupar", "Aguachica", "La Paz"],
    "Chocó": ["Quibdó", "Istmina", "Condoto"],
    "Córdoba": ["Montería", "Lorica", "Cereté"],
    "Cundinamarca": ["Soacha", "Zipaquirá", "Facatativá", "Girardot"],
    "Guainía": ["Inírida"],
    "Guaviare": ["San José del Guaviare"],
    "Huila": ["Neiva", "Pitalito", "Garzón"],
    "La Guajira": ["Riohacha", "Maicao", "Fonseca"],
    "Magdalena": ["Santa Marta", "Ciénaga", "Fundación"],
    "Meta": ["Villavicencio", "Acacías", "Granada"],
    "Nariño": ["Pasto", "Ipiales", "Tumaco"],
    "Norte de Santander": ["Cúcuta", "Ocaña", "Pamplona"],
    "Putumayo": ["Mocoa", "Puerto Asís"],
    "Quindío": ["Armenia", "Calarcá", "Montenegro"],
    "Risaralda": ["Pereira", "Dosquebradas", "La Virginia"],
    "San Andrés y Providencia": ["San Andrés"],
    "Santander": ["Bucaramanga", "Floridablanca", "Giron", "Barrancabermeja"],
    "Sucre": ["Sincelejo", "Corozal"],
    "Tolima": ["Ibagué", "Espinal", "Honda"],
    "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá", "Cartago"],
    "Vaupés": ["Mitú"],
    "Vichada": ["Puerto Carreño"]
};

const TIPOS_PRIMARIA = [
    "Consulta médica general",
    "Odontología básica",
    "Vacunación"
];

const TIPOS_COMPLEMENTARIA = [
    "Consulta con especialistas",
    "Cirugías programadas",
    "Terapias (Fisioterapia, psicología)"
];

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
      const { nombre, cedula, correo, celular, problema, detalle, ciudad, departamento, clasificacion, soporte, tipoUsuario, aceptoPolitica } = body;
      
      // Validar datos requeridos
      if (!nombre || !cedula || !correo || !problema || !detalle || !ciudad || !departamento || !clasificacion || !tipoUsuario || !aceptoPolitica) {
        sendJSON(res, 400, { error: 'Faltan campos requeridos' });
        return;
      }
      
      // Crear objeto usuario temporal para el envío de correos
      const usuario = {
        nombre: nombre,
        cedula: cedula,
        correo: correo,
        celular: celular || 'No proporcionado',
        tipoUsuario: tipoUsuario
      };
      
      // Validación avanzada de contenido con filtro de lenguaje inapropiado
      const textoCompleto = `${problema} ${detalle}`;
      const resultadoFiltro = revisarQueja(textoCompleto);
      
      if (!resultadoFiltro.esApropiada) {
        const sugerencia = sugerirModificacion(textoCompleto);
        const razones = resultadoFiltro.palabrasEncontradas.join(', ');
        
        console.log(`🚫 Queja rechazada por contenido inapropiado. Razones: ${razones}`);
        
        sendJSON(res, 400, { 
          error: 'El contenido de la queja contiene lenguaje inapropiado para comunicaciones oficiales.',
          detalles: `Problemas detectados: ${razones}`,
          sugerencia: sugerencia,
          mensaje: 'Por favor, reformule su mensaje de manera respetuosa y constructiva. Una comunicación adecuada nos ayuda a brindar mejor atención a su caso.'
        });
        return;
      }
      
      console.log(`✅ Contenido validado exitosamente`);
      
      const nuevaQueja = {
        id: nextQuejaId++,
        usuarioId: null,
        nombre,
        cedula,
        correo,
        celular,
        problema,
        detalle,
        ciudad,
        departamento,
        clasificacion,
        tipoUsuario,
        aceptoPolitica,
        fechaAceptacionPolitica: new Date().toISOString(),
        soporte: soporte || [],
        estado: 'pendiente',
        fechaCreacion: new Date()
      };
      
      quejas.push(nuevaQueja);
      
      console.log(`📋 Nueva queja registrada: ${problema} - ${departamento} (${clasificacion})`);
      
      // Enviar correos automáticamente
      try {
        const resultadosCorreo = await enviarNotificacionQueja(nuevaQueja, usuario);
        
        let mensajeCorreo = '';
        if (resultadosCorreo.destinatariosEnviado) {
          mensajeCorreo += 'Notificación enviada a autoridades de salud. ';
        }
        if (resultadosCorreo.usuarioEnviado) {
          mensajeCorreo += 'Comprobante enviado a su correo. ';
        }
        if (resultadosCorreo.errores.length > 0) {
          console.log('Advertencias en envío de correos:', resultadosCorreo.errores);
        }
        
        sendJSON(res, 200, { 
          success: true, 
          quejaId: nuevaQueja.id,
          mensaje: `Queja registrada exitosamente. ${mensajeCorreo}`.trim()
        });
      } catch (emailError) {
        console.error('Error al enviar correos:', emailError);
        sendJSON(res, 200, { 
          success: true, 
          quejaId: nuevaQueja.id,
          mensaje: 'Queja registrada exitosamente. Error en envío de notificaciones por correo.'
        });
      }
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
      
      sendJSON(res, 200, { quejas: userQuejas });
    } catch (error) {
      console.error('Error obteniendo quejas:', error);
      sendJSON(res, 500, { error: 'Error al obtener quejas' });
    }
    return;
  }

  // Obtener departamentos
  if (pathname === '/api/departamentos' && method === 'GET') {
    sendJSON(res, 200, Object.keys(DEPARTAMENTOS));
    return;
  }

  // Obtener municipios por departamento
  if (pathname.startsWith('/api/municipios/') && method === 'GET') {
    const departamento = decodeURIComponent(pathname.split('/')[3]);
    const municipios = DEPARTAMENTOS[departamento] || [];
    sendJSON(res, 200, municipios);
    return;
  }

  // Obtener tipos de queja por clasificación
  if (pathname.startsWith('/api/tipos-queja/') && method === 'GET') {
    const clasificacion = pathname.split('/')[3];
    let tipos = [];
    if (clasificacion === 'primaria') {
      tipos = TIPOS_PRIMARIA;
    } else if (clasificacion === 'complementaria') {
      tipos = TIPOS_COMPLEMENTARIA;
    }
    sendJSON(res, 200, tipos);
    return;
  }

  // Obtener información de veedores
  if (pathname === '/api/veedores' && method === 'GET') {
    const veedores = [
      {
        nombre: "Dr. Juan Carlos Pérez",
        cargo: "Veedor Nacional de Salud",
        departamento: "Nacional",
        telefono: "+57 1 234 5678",
        email: "juan.perez@veeduria.gov.co"
      },
      {
        nombre: "Dra. María Elena Rodríguez",
        cargo: "Veedora Regional Caribe",
        departamento: "Atlántico, Bolívar, Cesar, Córdoba, La Guajira, Magdalena, Sucre",
        telefono: "+57 5 987 6543",
        email: "maria.rodriguez@veeduria.gov.co"
      },
      {
        nombre: "Dr. Carlos Andrés Gómez",
        cargo: "Veedor Regional Pacífico",
        departamento: "Chocó, Nariño, Valle del Cauca, Cauca",
        telefono: "+57 2 456 7890",
        email: "carlos.gomez@veeduria.gov.co"
      },
      {
        nombre: "Dra. Ana Sofía Martínez",
        cargo: "Veedora Regional Andina",
        departamento: "Antioquia, Boyacá, Caldas, Cundinamarca, Huila, Quindío, Risaralda, Santander, Tolima",
        telefono: "+57 4 321 0987",
        email: "ana.martinez@veeduria.gov.co"
      },
      {
        nombre: "Dr. Luis Fernando Torres",
        cargo: "Veedor Regional Oriental",
        departamento: "Arauca, Casanare, Meta, Norte de Santander, Vichada",
        telefono: "+57 7 654 3210",
        email: "luis.torres@veeduria.gov.co"
      },
      {
        nombre: "Dra. Patricia Ramírez",
        cargo: "Veedora Regional Amazónica",
        departamento: "Amazonas, Caquetá, Guainía, Guaviare, Putumayo, Vaupés",
        telefono: "+57 8 789 0123",
        email: "patricia.ramirez@veeduria.gov.co"
      }
    ];
    sendJSON(res, 200, veedores);
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