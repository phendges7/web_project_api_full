const router = require("express").Router();

// Importa os middlewares de validação
const {
  validateCreateUser,
  validateLogin,
  validateUpdateUser,
  validateUpdateAvatar,
} = require("../validators/usersValidator");

// Importa os controladores
const {
  getCurrentUser,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
} = require("../controllers/users");

// Define as rotas
router.post("/signup", validateCreateUser, createUser);
router.post("/signin", validateLogin, login);
router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUser, updateUserInfo);
router.patch("/me/avatar", validateUpdateAvatar, updateAvatar);

module.exports = router;
