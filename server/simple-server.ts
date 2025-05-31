import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes.js";

const app = express();
const server = createServer(app);

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rutas
registerRoutes(app).then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  });
}).catch(console.error);