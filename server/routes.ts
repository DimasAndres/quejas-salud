import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertQuejaSchema, loginSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { contentFilter } from "./utils/contentFilter";
import { sendComplaintEmail } from "./utils/emailService";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido"));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "No autorizado" });
    }
    next();
  };

  // User registration
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByCedula(userData.cedula);
      if (existingUser) {
        return res.status(400).json({ message: "Usuario ya existe con esta cédula" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Remove password from response
      const { password, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User login
  app.post("/api/login", async (req, res) => {
    try {
      const { cedula, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByCedula(cedula);
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      // Set session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Logout
  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Sesión cerrada" });
    });
  });

  // Get current user
  app.get("/api/user", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      
      const { password, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create complaint
  app.post("/api/quejas", requireAuth, upload.array("files", 10), async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const quejaData = {
        ...req.body,
        usuarioId: userId,
        paraBeneficiario: req.body.paraBeneficiario === "true"
      };
      
      const validatedQueja = insertQuejaSchema.parse(quejaData);
      
      // Filter inappropriate content
      const isAppropriate = contentFilter.checkContent(validatedQueja.detalle);
      if (!isAppropriate.isAppropriate) {
        return res.status(400).json({ 
          message: "El contenido contiene lenguaje inapropiado",
          reasons: isAppropriate.reasons
        });
      }

      // Handle file uploads
      const files = req.files as Express.Multer.File[];
      const filePaths = files ? files.map(file => file.path) : [];
      
      const queja = await storage.createQueja({
        ...validatedQueja,
        soporte: JSON.stringify(filePaths)
      });

      // Send email notification
      try {
        const user = await storage.getUser(userId);
        if (user) {
          await sendComplaintEmail(queja, user);
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the request if email fails
      }

      res.json({ queja });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get user's complaints
  app.get("/api/quejas", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const quejas = await storage.getQuejasByUserId(userId);
      res.json({ quejas });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get specific complaint
  app.get("/api/quejas/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const queja = await storage.getQuejaById(id);
      
      if (!queja) {
        return res.status(404).json({ message: "Queja no encontrada" });
      }

      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "No autorizado" });
      }

      // Ensure user owns this complaint
      if (queja.usuarioId !== userId) {
        return res.status(403).json({ message: "No autorizado" });
      }

      res.json({ queja });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update complaint
  app.put("/api/quejas/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const queja = await storage.getQuejaById(id);
      
      if (!queja || queja.usuarioId !== req.session.userId) {
        return res.status(404).json({ message: "Queja no encontrada" });
      }

      const updates = req.body;
      
      // Filter content if detalle is being updated
      if (updates.detalle) {
        const isAppropriate = contentFilter.checkContent(updates.detalle);
        if (!isAppropriate.isAppropriate) {
          return res.status(400).json({ 
            message: "El contenido contiene lenguaje inapropiado",
            reasons: isAppropriate.reasons
          });
        }
      }

      const updatedQueja = await storage.updateQueja(id, updates);
      res.json({ queja: updatedQueja });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete complaint
  app.delete("/api/quejas/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const queja = await storage.getQuejaById(id);
      
      if (!queja || queja.usuarioId !== req.session.userId) {
        return res.status(404).json({ message: "Queja no encontrada" });
      }

      const deleted = await storage.deleteQueja(id);
      if (deleted) {
        res.json({ message: "Queja eliminada" });
      } else {
        res.status(500).json({ message: "Error al eliminar queja" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
