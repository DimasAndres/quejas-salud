import express from "express";
import { db } from "./db";
import routes from "./routes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Serve static files
app.use(express.static("client/dist"));

const PORT = parseInt(process.env.PORT || "5000");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});