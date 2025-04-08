const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");
const { errors } = require("celebrate");

const app = express();
const { PORT = 7000 } = process.env;

// Importa os controladores de usuário
const { login, createUser } = require("./controllers/users");

// Importa o middlewares
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

// Importa os roteadores
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const {
  validateLogin,
  validateCreateUser,
} = require("./validators/usersValidator");

// Middlewares
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Conexão com o MongoDB
mongoose
  .connect("mongodb://localhost:27017/aroundb")
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso"))
  .catch((err) => console.error("❌ Erro na conexão com MongoDB:", err));

// Chamada do logger
app.use(requestLogger);

// Rotas públicas
app.post("/signin", validateLogin, login);
app.post("/signup", validateCreateUser, createUser);

// Rotas protegidas
app.use("/users", auth, usersRouter);
app.use("/cards", auth, cardsRouter);

app.use(errorLogger); // Logger de erros

app.use(errors()); // Celebrate - erros de validação
app.use(errorHandler); // Middleware de tratamento de erros

// Rota para o frontend (React)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Rota para 404 (API)
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
