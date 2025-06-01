const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();

// Almacenamiento en memoria
let users = [];
let quejas = [];
let nextUserId = 1;
let nextQuejaId = 1;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static('.'));

// API Routes

// Registro de usuario
app.post('/api/register', async (req, res) => {
  try {
    const { nombre, apellido, cedula, celular, correo, tipoUsuario, clave, aceptoPolitica } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.cedula === cedula);
    if (existingUser) {
      return res.status(400).json({ error: 'Usuario ya existe con esta cédula' });
    }
    
    // Verificar que acepta la política
    if (!aceptoPolitica) {
      return res.status(400).json({ error: 'Debe aceptar la política de tratamiento de datos' });
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
    
    res.json({ success: true, userId: newUser.id });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login de usuario
app.post('/api/login', async (req, res) => {
  try {
    const { cedula, clave } = req.body;
    
    const user = users.find(u => u.cedula === cedula);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const validPassword = await bcrypt.compare(clave, user.clave);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    res.json({ 
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
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Registrar queja
app.post('/api/quejas', (req, res) => {
  try {
    const { usuarioId, problema, detalle, ciudad, departamento, correo, clasificacion, paraBeneficiario } = req.body;
    
    // Filtro básico de contenido
    const contenidoInapropiado = ['malo', 'horrible', 'pésimo'];
    const textoCompleto = `${problema} ${detalle}`.toLowerCase();
    
    for (let palabra of contenidoInapropiado) {
      if (textoCompleto.includes(palabra)) {
        return res.status(400).json({ 
          error: 'El contenido de la queja contiene lenguaje inapropiado. Por favor, reformule su mensaje de manera respetuosa.' 
        });
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
    
    console.log(`Nueva queja registrada: ${problema} - ${departamento}`);
    
    res.json({ success: true, quejaId: nuevaQueja.id });
  } catch (error) {
    console.error('Error en queja:', error);
    res.status(500).json({ error: 'Error al registrar queja' });
  }
});

// Obtener quejas de un usuario
app.get('/api/quejas/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userQuejas = quejas.filter(q => q.usuarioId === userId);
    
    res.json(userQuejas);
  } catch (error) {
    console.error('Error obteniendo quejas:', error);
    res.status(500).json({ error: 'Error al obtener quejas' });
  }
});

// Ruta para todas las demás solicitudes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Aplicación disponible en http://localhost:${PORT}`);
  console.log('📊 Sistema de Veeduría de Salud iniciado correctamente');
  console.log('💾 Usando almacenamiento en memoria (sin base de datos)');
});