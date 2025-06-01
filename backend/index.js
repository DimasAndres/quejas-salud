import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import quejasRoutes from "./routes/quejas.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/quejas", quejasRoutes);

app.get("/", (req, res) => {
  res.send("Backend de Veeduría funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
