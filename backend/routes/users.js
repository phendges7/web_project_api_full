const router = require("express").Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
} = require("../controllers/users");

// rota para buscar todos os usuarios
router.get("/", getUsers);

// rota para buscar um usuario especifico
router.get("/:userId", getUserById);

// rota para criar um usuario
router.post("/", createUser);

// rota para atualizar informações do usuario
router.patch("/me", updateUserInfo);

// rota para atualizar avatar do usuario
router.patch("/me/avatar", updateAvatar);

module.exports = router;
