import express from "express";
import path from "path";
import { db } from "./db";
import routes from "./routes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use(routes);

// Serve static files from client
app.use(express.static(path.join(__dirname, "../client")));

// Serve index.html for all other routes (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

const PORT = parseInt(process.env.PORT || "5000");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Aplicación disponible en http://localhost:${PORT}`);
});