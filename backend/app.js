const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

const app = express();
const { PORT = 3000 } = process.env;

// Importa o tratamento das mensagens de erro
const { HttpStatus, HttpResponseMessage } = require("./enums/http");

// Importa as rotas
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Conecta ao banco de dados
mongoose
  .connect("mongodb://localhost:27017/aroundb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch(err => {
    console.log(`Erro ao conectar ao banco de dados: ${err.message}`);
  });

app.use((req, res, next) => {
  req.user = {
    _id: "67ca2603dfa3677eb50ba927" // Substitua pelo seu ID de usuário
  };

  next();
});

// Rotas de autenticação
app.post("/signin", login);
app.post("/signup", createUser);

// Rotas principais
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

// Rota padrão
app.get("*", (req, res) => {
  res.send(path.join(__dirname, "../frontend/index.html"));
});

//Rota padrão para caso a rota não seja encontrada
app.use((req, res) => {
  return res
    .status(HttpStatus.NOT_FOUND)
    .json({ message: HttpResponseMessage.NOT_FOUND });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Ouvindo a porta ${PORT}`);
});
