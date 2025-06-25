const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { enviarNotificacionQueja } = require("./email-service");
const { revisarQueja, sugerirModificacion } = require("./filtro-quejas");

// Configuración de multer para archivos adjuntos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Usar el nombre original del archivo
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});

// Configuración del formulario de Google
const FORMULARIO_URL =
  "https://script.google.com/macros/s/AKfycbz2zC5NiFfqhGck4yVgvcEuCY-zv64AB7OJSKd-PyMyH3NQMr1L0sakPyyNtxaiFkya/exec";
const FORMULARIO_ACTIVO = true;

// Almacenamiento en memoria
let users = [];
let quejas = [];
let nextUserId = 1;
let nextQuejaId = 1;

// Control de peticiones duplicadas
let peticionesRecientes = new Set();

// Almacenamiento para administración
let destinatariosConfig = {};
let tiposQuejasData = {
  primaria: [
    "Consultas y valoraciones",
    "Odontología",
    "Vacunación y prevención",
    "Exámenes clínicos y urgencias menores",
  ],
  complementaria: [
    "Falta de especialista",
    "Negacion o mal manejo de remisión",
    "Demoras en exámenes diagnósticos",
    "Cancelaciónde citas",
  ],
  medicamentos: [
    "No me entregaron los medicamentos ",
    "Demoras o trabas para autorización de medicamentos",
    "Cobros adicionales por medicamentos",
    "Largos tiempos de espera en el dispensario",
  ],
};
let veedoresData = [
  {
    nombre: "Dimas Andrés Arias Núñez",
    departamento: "Quindío",
    telefono: "314 6761550",
    correo: "docenteandres@gmail.com",
  },
  {
    nombre: "Federman Enrique Moreno De La Cruz",
    departamento: "Guajira",
    telefono: "313 5872132",
    correo: "fmoreno@uniguajira.edu.co",
  },
  {
    nombre: "Luisa Pinzón Varilla",
    departamento: "Bogotá",
    telefono: "301 2738694",
  },
  {
    nombre: "Jorge Eliecer Acosta",
    departamento: "Tolima",
    telefono: "302 4191546",
  },
  {
    nombre: "Yolanda Castro Quintero",
    departamento: "Valle del Cauca",
    telefono: "315 5494644",
    correo: "d.ine.yolanda.castro@cali.edu.co",
  },
  {
    nombre: "Diana Carolina Coy Castiblanco",
    departamento: "Boyacá",
    telefono: "320 2961717",
    correo: "coy.diana@gmail.com",
  },
  {
    nombre: "Dexy Jackeline Benavides Nieto",
    departamento: "Nariño",
    telefono: "320 3840032",
    correo: "jackelinebenavides344@gmail.com",
  },
  {
    nombre: "José Gregorio Cárdenas Peña",
    departamento: "Risaralda",
    telefono: "321 2452325",
    correo: "josegcardenasp@gmail.com",
  },
  {
    nombre: "Manuel Andrés Viloria Rivera",
    departamento: "Cordoba",
    telefono: "310 5388419",
    correo: "mviloria2816@gmail.com",
  },
];

// Datos de configuración
const DEPARTAMENTOS = {
  Amazonas: ["Leticia", "Puerto Nariño"],
  Antioquia: ["Medellín", "Bello", "Itagüí", "Envigado", "Apartadó"],
  Atlántico: ["Barranquilla", "Soledad", "Malambo", "Puerto Colombia"],
  "Bogotá D.C.": ["Bogotá"],
  Bolívar: ["Cartagena", "Turbaco", "Magangué", "El Carmen de Bolívar"],
  Boyacá: ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá"],
  Caldas: ["Manizales", "La Dorada", "Villamaría", "Riosucio"],
  Caquetá: ["Florencia", "San Vicente del Caguán"],
  Casanare: ["Yopal", "Aguazul", "Villanueva"],
  Cauca: ["Popayán", "Santander de Quilichao", "Puerto Tejada"],
  Cesar: ["Valledupar", "Aguachica", "La Paz"],
  Chocó: ["Quibdó", "Istmina", "Condoto"],
  Córdoba: ["Montería", "Lorica", "Cereté"],
  Cundinamarca: ["Soacha", "Zipaquirá", "Facatativá", "Girardot"],
  Guainía: ["Inírida"],
  Guaviare: ["San José del Guaviare"],
  Huila: ["Neiva", "Pitalito", "Garzón"],
  "La Guajira": ["Riohacha", "Maicao", "Fonseca"],
  Magdalena: ["Santa Marta", "Ciénaga", "Fundación"],
  Meta: ["Villavicencio", "Acacías", "Granada"],
  Nariño: ["Pasto", "Ipiales", "Tumaco"],
  "Norte de Santander": ["Cúcuta", "Ocaña", "Pamplona"],
  Putumayo: ["Mocoa", "Puerto Asís"],
  Quindío: ["Armenia", "Calarcá", "Montenegro"],
  Risaralda: ["Pereira", "Dosquebradas", "La Virginia"],
  "San Andrés y Providencia": ["San Andrés"],
  Santander: ["Bucaramanga", "Floridablanca", "Giron", "Barrancabermeja"],
  Sucre: ["Sincelejo", "Corozal"],
  Tolima: ["Ibagué", "Espinal", "Honda"],
  "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá", "Cartago"],
  Vaupés: ["Mitú"],
  Vichada: ["Puerto Carreño"],
};

const TIPOS_PRIMARIA = [
  "Consulta médica general",
  "Odontología básica",
  "Vacunación",
];

const TIPOS_COMPLEMENTARIA = [
  "Consulta con especialistas",
  "Cirugías programadas",
  "Terapias (Fisioterapia, psicología)",
];

const TIPOS_MEDICAMENTOS = [
  "Falta de medicamentos en farmacia",
  "Demora en entrega de medicamentos",
  "Medicamentos vencidos o en mal estado",
  "Negación de medicamentos autorizados",
  "Calidad deficiente de medicamentos",
  "Problemas con medicamentos especializados",
];

// Función para enviar datos al formulario de Google
async function enviarAFormularioGoogle(datosQueja) {
  if (!FORMULARIO_ACTIVO) {
    console.log("📝 Formulario de Google desactivado");
    return { exito: false, mensaje: "Formulario desactivado" };
  }

  try {
    const https = require("https");
    const querystring = require("querystring");

    // Preparar datos para Google Forms
    const formData = querystring.stringify({
      nombre: datosQueja.nombre || "",
      cedula: datosQueja.cedula || "",
      correo: datosQueja.correo || "",
      celular: datosQueja.celular || "",
      telefono: datosQueja.celular || "", // Alternativa común
      phone: datosQueja.celular || "", // Alternativa en inglés
      problema: datosQueja.problema || "",
      detalle: datosQueja.detalle || "",
      ciudad: datosQueja.ciudad || "",
      departamento: datosQueja.departamento || "",
      clasificacion: datosQueja.clasificacion || "",
      tipoUsuario: datosQueja.tipoUsuario || "",
      fecha: new Date().toISOString(),
    });

    return new Promise((resolve) => {
      const url = new URL(FORMULARIO_URL);
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(formData),
        },
      };

      const req = https.request(options, (res) => {
        if (res.statusCode === 200 || res.statusCode === 302) {
          console.log("📝 Datos enviados exitosamente al formulario de Google");
          resolve({ exito: true, mensaje: "Enviado a Google Forms" });
        } else {
          console.error("❌ Error enviando a Google Forms:", res.statusCode);
          resolve({ exito: false, mensaje: `Error ${res.statusCode}` });
        }
      });

      req.on("error", (error) => {
        console.error("❌ Error enviando al formulario de Google:", error);
        resolve({ exito: false, mensaje: error.message });
      });

      req.write(formData);
      req.end();
    });
  } catch (error) {
    console.error("❌ Error enviando al formulario de Google:", error);
    return { exito: false, mensaje: error.message };
  }
}

// Función para parsear JSON del cuerpo de la petición
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
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
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

// Función para servir archivos estáticos
function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Archivo no encontrado");
      return;
    }

    const ext = path.extname(filePath);
    let contentType = "text/html";
    if (ext === ".css") contentType = "text/css";
    if (ext === ".js") contentType = "application/javascript";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Manejar CORS
  if (method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  // API Routes
  if (pathname === "/api/register" && method === "POST") {
    try {
      const body = await parseBody(req);
      const {
        nombre,
        apellido,
        cedula,
        celular,
        correo,
        tipoUsuario,
        clave,
        aceptoPolitica,
      } = body;

      // Verificar si el usuario ya existe
      const existingUser = users.find((u) => u.cedula === cedula);
      if (existingUser) {
        sendJSON(res, 400, { error: "Usuario ya existe con esta cédula" });
        return;
      }

      // Verificar que acepta la política
      if (!aceptoPolitica) {
        sendJSON(res, 400, {
          error: "Debe aceptar la política de tratamiento de datos",
        });
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
        fechaCreacion: new Date(),
      };

      users.push(newUser);
      console.log(
        `✅ Usuario registrado: ${nombre} ${apellido} (${tipoUsuario})`,
      );

      sendJSON(res, 200, { success: true, userId: newUser.id });
    } catch (error) {
      console.error("Error en registro:", error);
      sendJSON(res, 500, { error: "Error al registrar usuario" });
    }
    return;
  }

  if (pathname === "/api/login" && method === "POST") {
    try {
      const body = await parseBody(req);
      const { cedula, clave } = body;

      const user = users.find((u) => u.cedula === cedula);
      if (!user) {
        sendJSON(res, 401, { error: "Credenciales inválidas" });
        return;
      }

      const validPassword = await bcrypt.compare(clave, user.clave);
      if (!validPassword) {
        sendJSON(res, 401, { error: "Credenciales inválidas" });
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
          tipoUsuario: user.tipoUsuario,
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      sendJSON(res, 500, { error: "Error del servidor" });
    }
    return;
  }

  if (pathname === "/api/quejas" && method === "POST") {
    // Usar multer para procesar archivos adjuntos
    upload.array("soporte", 5)(req, res, async (err) => {
      if (err) {
        console.error("❌ Error subiendo archivos:", err);
        sendJSON(res, 400, {
          error: "Error subiendo archivos adjuntos",
        });
        return;
      }

      try {
        const body = req.body;
        const archivos = req.files || [];
        const {
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
        } = body;

        // Crear identificador único para la petición (sin timestamp para detectar duplicados inmediatos)
        const peticionId = `${correo}-${cedula}-${problema}-${detalle}`;
        const peticionHash = require("crypto")
          .createHash("md5")
          .update(peticionId)
          .digest("hex");

        // Verificar si es una petición duplicada
        if (peticionesRecientes.has(peticionHash)) {
          console.log("⚠️ Petición duplicada detectada, ignorando...");
          sendJSON(res, 200, {
            success: true,
            mensaje: "Queja ya procesada",
          });
          return;
        }

        // Agregar a peticiones recientes (se limpia después de 30 segundos)
        peticionesRecientes.add(peticionHash);
        setTimeout(() => {
          peticionesRecientes.delete(peticionHash);
        }, 30000);

        // Obtener nombres de archivos subidos
        const nombresArchivos = archivos.map((archivo) => archivo.filename);
        if (nombresArchivos.length > 0) {
          console.log(`📎 Archivos adjuntos: ${nombresArchivos.join(", ")}`);
        }

        // Validar datos requeridos
        if (
          !nombre ||
          !cedula ||
          !correo ||
          !problema ||
          !detalle ||
          !ciudad ||
          !departamento ||
          !clasificacion ||
          !tipoUsuario ||
          !aceptoPolitica
        ) {
          sendJSON(res, 400, { error: "Faltan campos requeridos" });
          return;
        }

        // Crear objeto usuario temporal para el envío de correos
        const usuario = {
          nombre: nombre,
          apellido: "", // Agregar apellido vacío ya que el formulario actual no lo tiene
          cedula: cedula,
          correo: correo,
          celular: celular || "No proporcionado",
          tipoUsuario: tipoUsuario,
        };

        // Validación avanzada de contenido con filtro de lenguaje inapropiado
        const textoCompleto = `${problema} ${detalle}`;
        const resultadoFiltro = revisarQueja(textoCompleto);

        if (!resultadoFiltro.esApropiada) {
          const sugerencia = sugerirModificacion(textoCompleto);
          const razones = resultadoFiltro.palabrasEncontradas.join(", ");

          console.log(
            `🚫 Queja rechazada por contenido inapropiado. Razones: ${razones}`,
          );

          sendJSON(res, 400, {
            error:
              "El contenido de la queja contiene lenguaje inapropiado para comunicaciones oficiales.",
            detalles: `Problemas detectados: ${razones}`,
            sugerencia: sugerencia,
            mensaje:
              "Por favor, reformule su mensaje de manera respetuosa y constructiva. Una comunicación adecuada nos ayuda a brindar mejor atención a su caso.",
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
          soporte: nombresArchivos,
          estado: "pendiente",
          fechaCreacion: new Date(),
        };

        quejas.push(nuevaQueja);

        console.log(
          `📋 Nueva queja registrada: ${problema} - ${departamento} (${clasificacion})`,
        );

        // Enviar al formulario de Google
        let resultadoGoogle = { exito: false, mensaje: "No enviado" };
        try {
          resultadoGoogle = await enviarAFormularioGoogle(nuevaQueja);
        } catch (googleError) {
          console.error("Error enviando a Google Forms:", googleError);
        }

        // Enviar correos automáticamente
        try {
          const resultadosCorreo = await enviarNotificacionQueja(
            nuevaQueja,
            usuario,
            destinatariosConfig,
          );

          let mensajeCompleto = "";
          if (resultadosCorreo.destinatariosEnviado) {
            mensajeCompleto += "Notificación enviada a autoridades de salud. ";
          }
          if (resultadosCorreo.usuarioEnviado) {
            mensajeCompleto += "Comprobante enviado a su correo. ";
          }
          if (resultadoGoogle.exito) {
            mensajeCompleto += "Datos registrados en formulario oficial. ";
          }
          if (resultadosCorreo.errores.length > 0) {
            console.log(
              "Advertencias en envío de correos:",
              resultadosCorreo.errores,
            );
          }

          sendJSON(res, 200, {
            success: true,
            quejaId: nuevaQueja.id,
            mensaje: `Queja registrada exitosamente. ${mensajeCompleto}`.trim(),
          });
        } catch (emailError) {
          console.error("Error al enviar correos:", emailError);
          let mensajeFinal = "Queja registrada exitosamente. ";
          if (resultadoGoogle.exito) {
            mensajeFinal += "Datos registrados en formulario oficial. ";
          }
          mensajeFinal += "Error en envío de notificaciones por correo.";

          sendJSON(res, 200, {
            success: true,
            quejaId: nuevaQueja.id,
            mensaje: mensajeFinal,
          });
        }
      } catch (error) {
        console.error("Error en queja:", error);
        sendJSON(res, 500, { error: "Error al registrar queja" });
      }
    });
    return;
  }

  if (pathname.startsWith("/api/quejas/") && method === "GET") {
    try {
      const userId = parseInt(pathname.split("/")[3]);
      const userQuejas = quejas.filter((q) => q.usuarioId === userId);

      sendJSON(res, 200, { quejas: userQuejas });
    } catch (error) {
      console.error("Error obteniendo quejas:", error);
      sendJSON(res, 500, { error: "Error al obtener quejas" });
    }
    return;
  }

  // Obtener departamentos
  if (pathname === "/api/departamentos" && method === "GET") {
    sendJSON(res, 200, Object.keys(DEPARTAMENTOS));
    return;
  }

  // Obtener municipios por departamento
  if (pathname.startsWith("/api/municipios/") && method === "GET") {
    const departamento = decodeURIComponent(pathname.split("/")[3]);
    const municipios = DEPARTAMENTOS[departamento] || [];
    sendJSON(res, 200, municipios);
    return;
  }

  // Obtener tipos de queja por clasificación
  if (pathname.startsWith("/api/tipos-queja/") && method === "GET") {
    const clasificacion = pathname.split("/")[3];
    let tipos = [];
    if (clasificacion === "primaria") {
      tipos = tiposQuejasData.primaria;
    } else if (clasificacion === "complementaria") {
      tipos = tiposQuejasData.complementaria;
    } else if (clasificacion === "medicamentos") {
      tipos = tiposQuejasData.medicamentos;
    }
    sendJSON(res, 200, tipos);
    return;
  }

  // Obtener información de veedores (usa datos dinámicos del panel administrativo)
  if (pathname === "/api/veedores" && method === "GET") {
    // Formatear los datos para la vista pública, usando email en lugar de correo
    const veedoresPublicos = veedoresData.map((veedor) => ({
      nombre: veedor.nombre,
      cargo: veedor.cargo,
      departamento: veedor.departamento,
      telefono: veedor.telefono,
      email: veedor.correo, // Mapear correo a email para compatibilidad
    }));
    sendJSON(res, 200, veedoresPublicos);
    return;
  }

  // Panel administrativo
  if (pathname === "/admin" || pathname === "/admin.html") {
    serveFile(res, "admin.html");
    return;
  }

  // API Administrativa - Destinatarios
  if (pathname === "/api/admin/destinatarios" && method === "GET") {
    sendJSON(res, 200, { success: true, destinatarios: destinatariosConfig });
    return;
  }

  if (pathname === "/api/admin/destinatarios" && method === "POST") {
    try {
      const body = await parseBody(req);
      const { departamento, principal, copia, responsable } = body;

      destinatariosConfig[departamento] = { principal, copia, responsable };
      sendJSON(res, 200, { success: true, mensaje: "Destinatarios guardados" });
    } catch (error) {
      sendJSON(res, 500, {
        success: false,
        error: "Error al guardar destinatarios",
      });
    }
    return;
  }

  if (pathname.startsWith("/api/admin/destinatarios/") && method === "DELETE") {
    const departamento = decodeURIComponent(pathname.split("/")[4]);
    delete destinatariosConfig[departamento];
    sendJSON(res, 200, { success: true, mensaje: "Destinatarios eliminados" });
    return;
  }

  // API Administrativa - Veedores
  if (pathname === "/api/admin/veedores" && method === "GET") {
    sendJSON(res, 200, { success: true, veedores: veedoresData });
    return;
  }

  if (pathname === "/api/admin/veedores" && method === "POST") {
    try {
      const body = await parseBody(req);
      const { departamento, nombre, cedula, correo, telefono, cargo } = body;

      // Buscar si ya existe (para actualizar)
      const existingIndex = veedoresData.findIndex((v) => v.cedula === cedula);
      const veedorData = {
        departamento,
        nombre,
        cedula,
        correo,
        telefono,
        cargo,
      };

      if (existingIndex >= 0) {
        veedoresData[existingIndex] = veedorData;
      } else {
        veedoresData.push(veedorData);
      }

      sendJSON(res, 200, { success: true, mensaje: "Veedor guardado" });
    } catch (error) {
      sendJSON(res, 500, { success: false, error: "Error al guardar veedor" });
    }
    return;
  }

  if (pathname.startsWith("/api/admin/veedores/") && method === "DELETE") {
    const cedula = pathname.split("/")[4];
    veedoresData = veedoresData.filter((v) => v.cedula !== cedula);
    sendJSON(res, 200, { success: true, mensaje: "Veedor eliminado" });
    return;
  }

  // API de estadísticas
  if (pathname === "/api/admin/estadisticas" && method === "GET") {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Calcular estadísticas básicas
      const totalQuejas = quejas.length;
      const quejasMes = quejas.filter(
        (q) => new Date(q.fecha) >= startOfMonth,
      ).length;

      let promedioDiario = 0;
      if (totalQuejas > 0 && quejas.length > 0) {
        const fechas = quejas
          .map((q) => new Date(q.fecha))
          .filter((fecha) => !isNaN(fecha.getTime()));
        if (fechas.length > 0) {
          const primeraFecha = new Date(Math.min(...fechas));
          const diasTranscurridos = Math.max(
            1,
            Math.ceil((now - primeraFecha) / (1000 * 60 * 60 * 24)),
          );
          promedioDiario = totalQuejas / diasTranscurridos;
        }
      }

      const totalUsuarios = users.length;

      // Estadísticas por departamento
      const porDepartamento = {};
      quejas.forEach((q) => {
        porDepartamento[q.departamento] =
          (porDepartamento[q.departamento] || 0) + 1;
      });

      // Estadísticas por tipo de atención
      const porTipo = {};
      quejas.forEach((q) => {
        porTipo[q.clasificacion] = (porTipo[q.clasificacion] || 0) + 1;
      });

      // Tendencia de los últimos 30 días
      const tendencia = {};
      for (let i = 29; i >= 0; i--) {
        const fecha = new Date(now);
        fecha.setDate(fecha.getDate() - i);
        const fechaStr = fecha.toISOString().split("T")[0];

        const quejasDelDia = quejas.filter((q) => {
          const quejaFecha = new Date(q.fecha).toISOString().split("T")[0];
          return quejaFecha === fechaStr;
        }).length;

        tendencia[fechaStr] = quejasDelDia;
      }

      // Quejas recientes (últimas 20)
      const quejasRecientes = quejas
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 20)
        .map((q) => ({
          fecha: q.fecha,
          departamento: q.departamento,
          ciudad: q.ciudad,
          clasificacion: q.clasificacion,
          problema: q.problema,
          usuario: `${q.usuario.nombre} ${q.usuario.apellido}`,
        }));

      const estadisticas = {
        totalQuejas,
        quejasMes,
        promedioDiario,
        totalUsuarios,
        porDepartamento,
        porTipo,
        tendencia,
        quejasRecientes,
      };

      sendJSON(res, 200, { success: true, estadisticas });
    } catch (error) {
      console.error("Error generando estadísticas:", error);
      sendJSON(res, 500, {
        success: false,
        error: "Error al generar estadísticas",
      });
    }
    return;
  }

  // API Administrativa - Tipos de Quejas
  if (pathname === "/api/admin/tipos-quejas" && method === "GET") {
    sendJSON(res, 200, { success: true, tipos: tiposQuejasData });
    return;
  }

  if (pathname === "/api/admin/tipos-quejas" && method === "POST") {
    try {
      const body = await parseBody(req);
      const { categoria, tipo } = body;

      if (!tiposQuejasData[categoria]) {
        sendJSON(res, 400, { success: false, error: "Categoría inválida" });
        return;
      }

      if (tiposQuejasData[categoria].includes(tipo)) {
        sendJSON(res, 400, { success: false, error: "El tipo ya existe" });
        return;
      }

      tiposQuejasData[categoria].push(tipo);
      sendJSON(res, 200, {
        success: true,
        mensaje: "Tipo agregado exitosamente",
      });
    } catch (error) {
      sendJSON(res, 500, { success: false, error: "Error al agregar tipo" });
    }
    return;
  }

  if (pathname === "/api/admin/tipos-quejas" && method === "DELETE") {
    try {
      const body = await parseBody(req);
      const { categoria, index } = body;

      if (!tiposQuejasData[categoria]) {
        sendJSON(res, 400, { success: false, error: "Categoría inválida" });
        return;
      }

      if (index < 0 || index >= tiposQuejasData[categoria].length) {
        sendJSON(res, 400, { success: false, error: "Índice inválido" });
        return;
      }

      tiposQuejasData[categoria].splice(index, 1);
      sendJSON(res, 200, {
        success: true,
        mensaje: "Tipo eliminado exitosamente",
      });
    } catch (error) {
      sendJSON(res, 500, { success: false, error: "Error al eliminar tipo" });
    }
    return;
  }

  // Servir archivos estáticos
  if (pathname === "/" || pathname === "/index.html") {
    serveFile(res, "index.html");
    return;
  }

  // Para cualquier otra ruta, servir index.html (SPA)
  serveFile(res, "index.html");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 ================================");
  console.log("   VEEDURÍA NACIONAL POR EL DERECHO A LA SALUD");
  console.log("   Sistema de Recepción de Quejas");
  console.log("🚀 ================================");
  console.log(`✅ Servidor iniciado en puerto ${PORT}`);
  console.log(`🌐 Aplicación disponible en http://localhost:${PORT}`);
  console.log("💾 Usando almacenamiento en memoria");
  console.log("📊 Listo para recibir usuarios y quejas");
  console.log("================================");
});
