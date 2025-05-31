import nodemailer from "nodemailer";
import type { Queja, User } from "../../shared/schema.js";

// Email configuration from attached config.py
const EMAIL_CONFIG = {
  user: process.env.EMAIL_USER || "veedurianacionalsaludmagcol@gmail.com",
  password: process.env.EMAIL_PASSWORD || "jhpxfxlrzzghztqj",
  smtp: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
  },
};

// Destinatarios por departamento from attached files
const DESTINATARIOS_POR_DEPARTAMENTO: Record<
  string,
  { principal: string; copia: string[]; responsable: string }
> = {
  Amazonas: {
    principal: "ingenierodimas@gmail.com",
    copia: ["secretaria.amazonas@ejemplo.gov.co"],
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
  "Valle del Cauca": {
    principal: "salud.valledelcauca@ejemplo.gov.co",
    copia: ["secretaria.valledelcauca@ejemplo.gov.co"],
    responsable: "Secretaría de Salud Valle del Cauca",
  },
  // Add more departments as needed
};

// Create transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.smtp.host,
  port: EMAIL_CONFIG.smtp.port,
  secure: EMAIL_CONFIG.smtp.secure,
  auth: {
    user: EMAIL_CONFIG.user,
    pass: EMAIL_CONFIG.password,
  },
});

export async function sendComplaintEmail(
  queja: Queja,
  user: User,
): Promise<void> {
  try {
    const destinatarios = DESTINATARIOS_POR_DEPARTAMENTO[queja.departamento];
    if (!destinatarios) {
      console.warn(
        `No se encontraron destinatarios para el departamento: ${queja.departamento}`,
      );
      return;
    }

    const allDestinations = [destinatarios.principal, ...destinatarios.copia];

    // Email to authorities
    const authorityEmailBody = `
NUEVA QUEJA DE SALUD
-----------------------------
La Veeduría Nacional por el Derecho a la Salud del Magisterio envía, a solicitud de ${user.nombre} ${user.apellido}, identificado con cédula ${user.cedula}, la siguiente queja de salud:

Nombre: ${user.nombre} ${user.apellido}
Cédula: ${user.cedula}
Celular: ${user.celular}
Correo: ${user.correo}
Atención: ${queja.clasificacion}
Departamento: ${queja.departamento}
Municipio: ${queja.ciudad}
Tipo de queja: ${queja.problema}
Responsable asignado: ${destinatarios.responsable}

DETALLE:
${queja.detalle}

Soportes adjuntos: ${queja.soporte ? JSON.parse(queja.soporte).join(", ") : "Ninguno"}

---------------------------------
Este correo ha sido generado automáticamente por el sistema de Veeduría Nacional de Salud.
    `;

    // Send to authorities
    await transporter.sendMail({
      from: EMAIL_CONFIG.user,
      to: allDestinations,
      subject: `Nueva queja de salud - ${queja.problema}`,
      text: authorityEmailBody,
      replyTo: user.correo,
    });

    // Confirmation email to user
    const userEmailBody = `
COMPROBANTE DE REGISTRO DE QUEJA
-------------------------------

Estimado/a ${user.nombre} ${user.apellido},

Le informamos que su queja ha sido enviada exitosamente a la Super Intendencia de Salud, a la dependencia de FOMAG de la Fiduprevisora y la Personeria Departamental .
A continuación encontrará el detalle de su queja como comprobante:

Número de Registro: ${queja.id}
Fecha: ${queja.createdAt}
Tipo de Atención: ${queja.clasificacion}
Tipo de Queja: ${queja.problema}
Ubicación: ${queja.ciudad}, ${queja.departamento}

Es importante que conserve este
correo para cualquier seguimiento o consulta adicional que necesite realizar.

Para cualquier consulta relacionada con su caso, puede responder a este correo.

Atentamente,
Veeduría Nacional de Salud
Unidos podemos luchar por mejorar los servicios de salud

---
Este es un comprobante oficial de su registro de queja. Por favor, consérvelo para futuras referencias.
    `;

    await transporter.sendMail({
      from: EMAIL_CONFIG.user,
      to: user.correo,
      subject: `Comprobante de registro de queja - ${queja.problema}`,
      text: userEmailBody,
    });

    console.log(`Emails enviados exitosamente para la queja ${queja.id}`);
  } catch (error) {
    console.error("Error enviando emails:", error);
    throw error;
  }
}
