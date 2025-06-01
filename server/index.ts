import express from 'express';
import { createServer } from 'http';
import path from 'path';

const app = express();
const server = createServer(app);

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Sistema de Veeduría de Salud funcionando correctamente' });
});

// Servir archivos estáticos
app.use(express.static(path.join(process.cwd(), 'public')));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});