// Servicio de envío de correos basado en la versión original
const nodemailer = require("nodemailer");

// Configuración de destinatarios por departamento (basado en destinatarios_departamento.py)
const DESTINATARIOS_POR_DEPARTAMENTO = {
    Amazonas: {
        principal: "ingenierodimas@gmail.com",
        copia: [],
        responsable: "Secretaría de Salud Amazonas",
    },
    Antioquia: {
        principal: "salud.antioquia@ejemplo.gov.co",
        copia: ["secretaria.antioquia@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Antioquia",
    },
    Atlántico: {
        principal: "salud.atlantico@ejemplo.gov.co",
        copia: ["secretaria.atlantico@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Atlántico",
    },
    "Bogotá D.C.": {
        principal: "salud.bogotadc@ejemplo.gov.co",
        copia: ["secretaria.bogotadc@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Bogotá D.C.",
    },
    Bolívar: {
        principal: "salud.bolivar@ejemplo.gov.co",
        copia: ["secretaria.bolivar@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Bolívar",
    },
    Boyacá: {
        principal: "salud.boyaca@ejemplo.gov.co",
        copia: ["secretaria.boyaca@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Boyacá",
    },
    Caldas: {
        principal: "salud.caldas@ejemplo.gov.co",
        copia: ["secretaria.caldas@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Caldas",
    },
    Caquetá: {
        principal: "salud.caqueta@ejemplo.gov.co",
        copia: ["secretaria.caqueta@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Caquetá",
    },
    Casanare: {
        principal: "salud.casanare@ejemplo.gov.co",
        copia: ["secretaria.casanare@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Casanare",
    },
    Cauca: {
        principal: "salud.cauca@ejemplo.gov.co",
        copia: ["secretaria.cauca@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Cauca",
    },
    Cesar: {
        principal: "salud.cesar@ejemplo.gov.co",
        copia: ["secretaria.cesar@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Cesar",
    },
    Chocó: {
        principal: "salud.choco@ejemplo.gov.co",
        copia: ["secretaria.choco@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Chocó",
    },
    Cundinamarca: {
        principal: "salud.cundinamarca@ejemplo.gov.co",
        copia: ["secretaria.cundinamarca@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Cundinamarca",
    },
    Córdoba: {
        principal: "salud.cordoba@ejemplo.gov.co",
        copia: ["secretaria.cordoba@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Córdoba",
    },
    Guainía: {
        principal: "salud.guainia@ejemplo.gov.co",
        copia: ["secretaria.guainia@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Guainía",
    },
    Guaviare: {
        principal: "salud.guaviare@ejemplo.gov.co",
        copia: ["secretaria.guaviare@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Guaviare",
    },
    Huila: {
        principal: "salud.huila@ejemplo.gov.co",
        copia: ["secretaria.huila@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Huila",
    },
    "La Guajira": {
        principal: "salud.laguajira@ejemplo.gov.co",
        copia: ["secretaria.laguajira@ejemplo.gov.co"],
        responsable: "Secretaría de Salud La Guajira",
    },
    Magdalena: {
        principal: "salud.magdalena@ejemplo.gov.co",
        copia: ["secretaria.magdalena@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Magdalena",
    },
    Meta: {
        principal: "salud.meta@ejemplo.gov.co",
        copia: ["secretaria.meta@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Meta",
    },
    Nariño: {
        principal: "salud.narino@ejemplo.gov.co",
        copia: ["secretaria.narino@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Nariño",
    },
    "Norte de Santander": {
        principal: "salud.nortedesantander@ejemplo.gov.co",
        copia: ["secretaria.nortedesantander@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Norte de Santander",
    },
    Putumayo: {
        principal: "salud.putumayo@ejemplo.gov.co",
        copia: ["secretaria.putumayo@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Putumayo",
    },
    Quindío: {
        principal: "salud.quindio@ejemplo.gov.co",
        copia: ["secretaria.quindio@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Quindío",
    },
    Risaralda: {
        principal: "salud.risaralda@ejemplo.gov.co",
        copia: ["secretaria.risaralda@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Risaralda",
    },
    "San Andrés y Providencia": {
        principal: "salud.sanandresyprovidencia@ejemplo.gov.co",
        copia: ["secretaria.sanandresyprovidencia@ejemplo.gov.co"],
        responsable: "Secretaría de Salud San Andrés y Providencia",
    },
    Santander: {
        principal: "salud.santander@ejemplo.gov.co",
        copia: ["secretaria.santander@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Santander",
    },
    Sucre: {
        principal: "salud.sucre@ejemplo.gov.co",
        copia: ["secretaria.sucre@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Sucre",
    },
    Tolima: {
        principal: "salud.tolima@ejemplo.gov.co",
        copia: ["secretaria.tolima@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Tolima",
    },
    "Valle del Cauca": {
        principal: "salud.valledelcauca@ejemplo.gov.co",
        copia: ["secretaria.valledelcauca@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Valle del Cauca",
    },
    Vaupés: {
        principal: "salud.vaupes@ejemplo.gov.co",
        copia: ["secretaria.vaupes@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Vaupés",
    },
    Vichada: {
        principal: "salud.vichada@ejemplo.gov.co",
        copia: ["secretaria.vichada@ejemplo.gov.co"],
        responsable: "Secretaría de Salud Vichada",
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

function obtenerDestinatarios(departamento) {
    return DESTINATARIOS_POR_DEPARTAMENTO[departamento] || null;
}

async function enviarNotificacionQueja(quejaData, usuario) {
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

    // Obtener destinatarios según el departamento
    const infoDestinatarios = obtenerDestinatarios(departamento);
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

A través de la Veeduría Nacional de Salud, me permito poner en su conocimiento una situación relacionada con mi salud que requiere atención y pronta respuesta.

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

Entidad responsable: ${responsable}
Copia enviada a: ${infoDestinatarios.copia.length > 0 ? infoDestinatarios.copia.join(", ") : "No aplica"}


---
Este correo ha sido generado a través por el sistema de Veeduría Nacional en Salud del Magisterio.
Número de registro: ${id}
Fecha: ${new Date().toLocaleString("es-CO")}`;

    // Cuerpo del correo para el usuario (comprobante)
    const cuerpoUsuario = `COMPROBANTE DE REGISTRO DE QUEJA
-------------------------------

Estimado/a ${nombre} ${apellido},

Le informamos que su queja ha sido registrada y exitosamente en nuestro sistema y ha sido enviada exitosamente a las siguientes entidades responsables de su departamento:

DESTINATARIOS DE SU QUEJA:
• ${responsable}
• Correo principal: ${infoDestinatarios.principal}
${infoDestinatarios.copia.length > 0 ? infoDestinatarios.copia.map((correo) => `• Correo copia: ${correo}`).join("\n") : ""}

DETALLE DE SU REGISTRO:
Número de Registro: ${id}
Fecha: ${new Date().toLocaleString("es-CO")}
Tipo de Atención: ${clasificacion}
Tipo de Queja: ${problema}
Ubicación: ${ciudad}, ${departamento}

CONTENIDO DE SU QUEJA:
${detalle}

${soporte && soporte.length > 0 ? `ARCHIVOS ADJUNTOS:
${soporte.map((archivo, index) => `${index + 1}. ${archivo}`).join("\n")}` : "No se adjuntaron archivos."}

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
                attachments: attachments
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
