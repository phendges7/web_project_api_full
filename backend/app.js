const mongoose = require("mongoose");

const express = require("express");
const app = express();
const { PORT = 3000 } = process.env;

// Importa o tratamento das mensagens de erro
const { HttpStatus, HttpResponseMessage } = require("./enums/http");

// Importa as rotas
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

app.use(express.json());

// Conecta ao banco de dados
mongoose
  .connect("mongodb://localhost:27017/aroundb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch((err) => {
    console.log(`Erro ao conectar ao banco de dados: ${err.message}`);
  });

app.use((req, res, next) => {
  req.user = {
    _id: "67ca2603dfa3677eb50ba927", // Substitua pelo seu ID de usuário
  };

  next();
});

// Usa as rotas
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

// Rota padrão
app.get("/", (req, res) => {
  res.send(`
    <h1>Bem-vindo à API de Usuários e Cartões!</h1>
    <p>Use as seguintes rotas para acessar os dados:</p>
    <ul>
      <li><a href="/users">/users</a> - Listar todos os usuários</li>
      <li><a href="/cards">/cards</a> - Listar todos os cartões</li>
      <li>/users/id - Buscar um usuário pelo ID</li>
    </ul>
    <p>Divirta-se explorando a API!</p>
  `);
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
