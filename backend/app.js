import mongoose from "mongoose";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { errors } from "celebrate";

import dotenv from "dotenv";
dotenv.config();

// Carrega .env apenas em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  dotenv.config(); // Tenta carregar, mas não falha se não existir
}

// Configurações com fallback para desenvolvimento
const config = {
  JWT_SECRET: process.env.JWT_SECRET || "seguro-mas-nao-producao",
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/aroundb",
};

// Em produção, exige as variáveis
if (process.env.NODE_ENV === "production") {
  if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
    throw new Error(
      "❌ Variáveis de ambiente obrigatórias faltando em produção!"
    );
  }
}

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const { PORT = 7000 } = process.env;

// Import controllers
import { login, createUser } from "./controllers/users.js";

// Import middlewares
import auth from "./middlewares/auth.js";
import { requestLogger, errorLogger } from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";

// Import routers
import usersRouter from "./routes/users.js";
import cardsRouter from "./routes/cards.js";

// Import validators
import {
  validateLogin,
  validateCreateUser,
} from "./validators/usersValidator.js";

// Middlewares
app.use(cors()); // Permite TODAS origens (remova depois dos testes)
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso"))
  .catch((err) => console.error("❌ Erro na conexão com MongoDB:", err));

// Request logger
app.use(requestLogger);

// Crash test route
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("O servidor travará agora");
  }, 0);
});

// Public routes
app.post("/signin", validateLogin, login);
app.post("/signup", validateCreateUser, createUser);

// Protected routes
app.use("/users", auth, usersRouter);
app.use("/cards", auth, cardsRouter);

// Error logger
app.use(errorLogger);

// Error handlers
app.use(errors());
app.use(errorHandler);

// Frontend route (React)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 404 handler (API)
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Start server
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
