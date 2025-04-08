const router = require("express").Router();
const auth = require("../middlewares/auth");

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
router.get("/me", auth, getCurrentUser);
router.patch("/me", validateUpdateUser, updateUserInfo);
router.patch("/me/avatar", validateUpdateAvatar, updateAvatar);

module.exports = router;
