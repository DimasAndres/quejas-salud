
import express from "express";
import { createServer } from "http";
import session from "express-session";
import { setupVite } from "./vite";
import { registerRoutes } from "./routes";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'veeduria-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Cambiar a true en producción con HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Registrar rutas
registerRoutes(app);

setupVite(app, server).then(() => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
  });
});
