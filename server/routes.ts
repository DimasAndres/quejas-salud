import { Router } from "express";
import { storage } from "./storage";
import { insertUserSchema, insertQuejaSchema } from "../shared/schema";
import bcrypt from "bcryptjs";
import { filtrarContenido } from "./utils/filtro";
import { enviarNotificacionQueja } from "./utils/email";

const router = Router();

// Auth routes
router.post("/api/auth/register", async (req, res) => {
  try {
    const validatedData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByCedula(validatedData.cedula);
    if (existingUser) {
      return res.status(400).json({ error: "Ya existe un usuario con esa cédula" });
    }

    const user = await storage.createUser(validatedData);
    
    // Don't return password
    const { clave, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: "Error al registrar usuario" });
  }
});

router.post("/api/auth/login", async (req, res) => {
  try {
    const { cedula, clave } = req.body;
    
    const user = await storage.getUserByCedula(cedula);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isValidPassword = await bcrypt.compare(clave, user.clave);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    if (!user.aceptoPolitica) {
      return res.status(403).json({ 
        error: "Debe aceptar la política de tratamiento de datos",
        requiresPolicyAcceptance: true 
      });
    }

    // Don't return password
    const { clave: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Quejas routes
router.post("/api/quejas", async (req, res) => {
  try {
    const validatedData = insertQuejaSchema.parse(req.body);
    
    // Filter inappropriate content
    const esApropiada = filtrarContenido(validatedData.detalle);
    if (!esApropiada.esValido) {
      return res.status(400).json({ 
        error: "El contenido contiene lenguaje inapropiado",
        sugerencia: esApropiada.textoCorregido 
      });
    }

    const queja = await storage.createQueja(validatedData);
    
    // Send email notification
    try {
      await enviarNotificacionQueja(queja);
    } catch (emailError) {
      console.error("Error enviando notificación:", emailError);
      // Continue even if email fails
    }

    res.json({ queja });
  } catch (error) {
    res.status(400).json({ error: "Error al registrar queja" });
  }
});

router.get("/api/quejas/user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const quejas = await storage.getQuejasByUser(userId);
    res.json({ quejas });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener quejas" });
  }
});

router.get("/api/quejas", async (req, res) => {
  try {
    const quejas = await storage.getAllQuejas();
    res.json({ quejas });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener quejas" });
  }
});

// Data routes
router.get("/api/departamentos", (req, res) => {
  const departamentos = [
    "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá",
    "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba",
    "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena",
    "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda",
    "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca",
    "Vaupés", "Vichada", "Bogotá D.C."
  ];
  res.json({ departamentos });
});

router.get("/api/tipos-queja/:clasificacion", (req, res) => {
  const { clasificacion } = req.params;
  
  const tiposPrimaria = [
    "Demora en la atención médica",
    "Falta de medicamentos",
    "Mal trato del personal",
    "Falta de especialistas",
    "Problemas con citas médicas",
    "Infraestructura deficiente",
    "Equipos médicos dañados"
  ];

  const tiposComplementaria = [
    "Negación de servicios",
    "Demora en autorizaciones",
    "Problemas con EPS",
    "Medicamentos no autorizados",
    "Procedimientos negados",
    "Tutelas necesarias",
    "Copagos excesivos"
  ];

  const tipos = clasificacion === "primaria" ? tiposPrimaria : tiposComplementaria;
  res.json({ tipos });
});

export default router;