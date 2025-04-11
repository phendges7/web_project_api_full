import { Router } from "express";
import auth from "../middlewares/auth.js";

// Importa os middlewares de validação
import {
  validateCreateUser,
  validateLogin,
  validateUpdateUser,
  validateUpdateAvatar,
} from "../validators/usersValidator.js";

// Importa os controladores
import {
  getCurrentUser,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
} from "../controllers/users.js";

// Cria o router
const router = Router();

// Define as rotas
router.post("/signup", validateCreateUser, createUser);
router.post("/signin", validateLogin, login);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUpdateUser, updateUserInfo);
router.patch("/me/avatar", auth, validateUpdateAvatar, updateAvatar);

// Exporta o router
export default router;
