// Servicio de envío de correos basado en la versión original
const nodemailer = require("nodemailer");

// Configuración de destinatarios por departamento (basado en destinatarios_departamento.py)
const DESTINATARIOS_POR_DEPARTAMENTO = {
    Amazonas: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Antioquia: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Atlántico: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    "Bogotá D.C.": {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Bolívar: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Boyacá: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Caldas: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Caquetá: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Casanare: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Cauca: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Cesar: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Chocó: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Cundinamarca: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Córdoba: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Guainía: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Guaviare: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Huila: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    "La Guajira": {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Magdalena: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Meta: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Nariño: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    "Norte de Santander": {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Putumayo: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Quindío: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Risaralda: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    "San Andrés y Providencia": {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Santander: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Sucre: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Tolima: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    "Valle del Cauca": {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Vaupés: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
    Vichada: {
        principal: "servicioalcliente@fiduprevisora.com.co",
        copia: ["correointernosns@supersalud.gov.co"],
        responsable: "",
    },
};

// Configuración de correo de la veeduría (basado en config.py original)
const EMAIL_REMETENTE = "veedurianacionalsaludmagcol@gmail.com";
const EMAIL_PASSWORD = "jhpxfxlrzzghztqj";
const SMTP_SERVER = "smtp.gmail.com";
const SMTP_PORT = 587;

// Configuración del transporter de correo
let transporter = null;

function configurarTransporter() {
    // Configuración con Gmail SMTP (como en la versión original)
    transporter = nodemailer.createTransport({
        host: SMTP_SERVER,
        port: SMTP_PORT,
        secure: false, // true para 465, false para otros puertos
        auth: {
            user: EMAIL_REMETENTE,
            pass: EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    console.log(
        "📧 Configurado envío de correos con Gmail SMTP desde veeduría",
    );
}

function obtenerDestinatarios(departamento, destinatariosConfig = {}) {
    // Usar configuración dinámica si está disponible, sino usar la estática
    return (
        destinatariosConfig[departamento] ||
        DESTINATARIOS_POR_DEPARTAMENTO[departamento] ||
        null
    );
}

async function enviarNotificacionQueja(
    quejaData,
    usuario,
    destinatariosConfig = {},
) {
    configurarTransporter();

    const {
        problema,
        detalle,
        ciudad,
        departamento,
        clasificacion,
        paraBeneficiario,
        id,
        soporte,
    } = quejaData;
    const { nombre, apellido, cedula, celular, correo } = usuario;

    // Obtener destinatarios según el departamento (dinámico o estático)
    const infoDestinatarios = obtenerDestinatarios(
        departamento,
        destinatariosConfig,
    );
    if (!infoDestinatarios) {
        throw new Error(
            `No se ha configurado un correo destinatario para el departamento '${departamento}'.`,
        );
    }

    const destinatarios = [
        infoDestinatarios.principal,
        ...infoDestinatarios.copia,
    ];
    const responsable = infoDestinatarios.responsable;

    // Cuerpo del correo para destinatarios institucionales
    const cuerpoDestinatarios = `NUEVA QUEJA DE SALUD
-------------------

Cordial saludo,

A través de la Veeduría Nacional por el Derecho a la Salud del Magisterio, informo de mi situación de salud, que requiere de la atención y pronta solución.

En ejercicio de mis derechos constitucionales como ciudadano(a), y en busca de la garantía efectiva del derecho fundamental a la salud, solicito respetuosamente su intervención para dar solución a la problemática que expongo en esta comunicación.

Agradezco de antemano su gestión y quedo atento(a) a una respuesta oportuna.

DESCRIPCIÓN DE LA SITUACIÓN:
${detalle}

DATOS DEL CIUDADANO:
Nombre: ${nombre} ${apellido}
Cédula: ${cedula}
Celular: ${celular}
Correo: ${correo}
Tipo de atención: ${clasificacion}
Departamento: ${departamento}
Municipio: ${ciudad}
Tipo de queja: ${problema}
Para beneficiario: ${paraBeneficiario ? "Sí" : "No"}

Copia enviada a: ${infoDestinatarios.copia.length > 0 ? infoDestinatarios.copia.join(", ") : "No aplica"}


---
Este correo ha sido generado a través por el sistema de Veeduría Nacional en Salud del Magisterio.
Fecha: ${new Date().toLocaleString("es-CO")}`;

    // Cuerpo del correo para el usuario (comprobante)
    const cuerpoUsuario = `COMPROBANTE DE REGISTRO DE QUEJA
-------------------------------

Estimado/a ${nombre} ${apellido},

Le informamos que su queja ha sido registrada en nuestro sistema y ha sido enviada exitosamente a las siguientes entidades nacionales responsables:

DESTINATARIOS DE SU QUEJA:
• ${responsable}
• Correo principal: ${infoDestinatarios.principal}
${infoDestinatarios.copia.length > 0 ? infoDestinatarios.copia.map((correo) => `• Correo copia: ${correo}`).join("\n") : ""}

DETALLE DE SU REGISTRO:
Fecha: ${new Date().toLocaleString("es-CO")}
Tipo de Atención: ${clasificacion}
Tipo de Queja: ${problema}
Ubicación: ${ciudad}, ${departamento}

CONTENIDO DE SU QUEJA:
${detalle}

${
    soporte && soporte.length > 0
        ? `ARCHIVOS ADJUNTOS:
${soporte.map((archivo, index) => `${index + 1}. ${archivo}`).join("\n")}`
        : "No se adjuntaron archivos."
}

Para cualquier consulta relacionada con su caso, puede responder a este correo o contactar directamente a las entidades responsables mencionadas.

Atentamente,
Veeduría Nacional por el Derecho a la Salud del Magisterio
Sólo organizados podemos luchar por un mejor servicio

---
Este es un comprobante oficial de su registro de queja. Por favor, consérvelo para futuras referencias.`;

    const resultados = {
        destinatariosEnviado: false,
        usuarioEnviado: false,
        errores: [],
    };

    // Preparar archivos adjuntos si los hay y existen
    let attachments = [];
    if (soporte && soporte.length > 0) {
        const fs = require("fs");
        for (const archivo of soporte) {
            const rutaArchivo = `./uploads/${archivo}`;
            if (fs.existsSync(rutaArchivo)) {
                attachments.push({
                    filename: archivo,
                    path: rutaArchivo,
                });
            } else {
                console.log(`⚠️ Archivo no encontrado: ${archivo}`);
            }
        }
    }

    // 1. Enviar a destinatarios institucionales
    try {
        await transporter.sendMail({
            from: EMAIL_REMETENTE,
            to: destinatarios.join(", "),
            replyTo: correo,
            subject: `Nueva queja de salud - ${problema}`,
            text: cuerpoDestinatarios,
            attachments: attachments,
        });

        console.log(
            `📧 Correo enviado a destinatarios institucionales: ${destinatarios.join(", ")}`,
        );
        resultados.destinatariosEnviado = true;
    } catch (error) {
        console.error(
            `❌ Error al enviar correo a destinatarios: ${error.message}`,
        );
        resultados.errores.push(
            `Error al enviar correo a destinatarios: ${error.message}`,
        );
    }

    // 2. Enviar comprobante al usuario
    if (correo && correo.includes("@")) {
        try {
            await transporter.sendMail({
                from: EMAIL_REMETENTE,
                to: correo,
                replyTo: EMAIL_REMETENTE,
                subject: `Comprobante de registro de queja - ${problema}`,
                text: cuerpoUsuario,
                attachments: attachments,
            });

            console.log(`📧 Comprobante enviado al usuario: ${correo}`);
            resultados.usuarioEnviado = true;
        } catch (error) {
            console.error(
                `❌ Error al enviar comprobante al usuario: ${error.message}`,
            );
            resultados.errores.push(
                `Error al enviar comprobante al usuario: ${error.message}`,
            );
        }
    } else {
        console.log(
            "⚠️ No se envió comprobante al usuario: correo no disponible o inválido",
        );
        resultados.errores.push(
            "No se pudo enviar comprobante al usuario: correo no disponible",
        );
    }

    return resultados;
}

module.exports = {
    enviarNotificacionQueja,
    obtenerDestinatarios,
};
