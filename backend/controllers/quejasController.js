import nodemailer from "nodemailer";

export const registrarQueja = async (req, res) => {
  try {
    const datos = req.body;
    const archivo = req.file;

    // ENVÍO DE CORREO
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CORREO_EMISOR,
        pass: process.env.PASS_CORREO,
      },
    });

    await transporter.sendMail({
      from: `"Veeduría" <${process.env.CORREO_EMISOR}>`,
      to: process.env.CORREO_DESTINO,
      subject: "Nueva queja registrada",
      text: `Queja de ${datos.nombre}:\n\n${datos.descripcion}`,
      attachments: archivo
        ? [
            {
              filename: archivo.originalname,
              path: archivo.path,
            },
          ]
        : [],
    });

    res.json({ mensaje: "Queja recibida y correo enviado." });
  } catch (error) {
    console.error("Error al registrar queja:", error);
    res.status(500).json({ error: "Error al registrar queja" });
  }
};
