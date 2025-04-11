import User from "../models/user.js";
import { HttpStatus, HttpResponseMessage, ErrorTypes } from "../enums/http.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper para formatar erros
export const throwError = (message, status, type) => {
  const error = new Error(message);
  error.status = status;
  error.type = type;
  throw error;
};

// controller para buscar usuario atuals
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throwError("Usuário não encontrado", 404, "NOT_FOUND");
    }
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

// controller para criar um usuario
export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throwError(
        "Email e senha são obrigatórios",
        HttpStatus.BAD_REQUEST,
        ErrorTypes.VALIDATION
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    res.status(HttpStatus.CREATED).json(userWithoutPassword);
  } catch (error) {
    if (error.code === 11000) {
      error.message = "Email já cadastrado";
      error.status = HttpStatus.BAD_REQUEST;
    }
    next(error);
  }
};

// controller para atualizar informações do usuario
export const updateUserInfo = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;

    if (req.params.userId && req.params.userId !== userId) {
      throwError(
        "Acesso negado: você só pode editar seu próprio perfil",
        HttpStatus.FORBIDDEN,
        ErrorTypes.AUTH
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throwError(
        "Usuário não encontrado",
        HttpStatus.NOT_FOUND,
        ErrorTypes.NOT_FOUND
      );
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: HttpResponseMessage.SUCCESS,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// controller para atualizar o avatar do usuario
export const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id; // ID do usuário logado

    // Bloqueia se tentar editar outro usuário
    if (req.params.userId && req.params.userId !== userId) {
      throwError(
        "Acesso negado: você só pode editar seu próprio avatar",
        HttpStatus.FORBIDDEN,
        ErrorTypes.AUTH
      );
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throwError(
        "Usuário não encontrado",
        HttpStatus.NOT_FOUND,
        ErrorTypes.NOT_FOUND
      );
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: HttpResponseMessage.SUCCESS,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// controller para manipular login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validação basica de email e senha
    if (!email || !password) {
      throwError(
        "Email e senha são obrigatórios",
        HttpStatus.BAD_REQUEST,
        ErrorTypes.VALIDATION
      );
    }

    // Busca usuario
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throwError(
        "Credenciais inválidas",
        HttpStatus.UNAUTHORIZED,
        ErrorTypes.AUTH
      );
    }

    // Verifica senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throwError(
        "Credenciais inválidas",
        HttpStatus.UNAUTHORIZED,
        ErrorTypes.AUTH
      );
    }

    // Verifica se a variável de ambiente JWT_SECRET está definida
    const jwtSecret =
      process.env.NODE_ENV === "production"
        ? process.env.JWT_SECRET // Em produção, exige a variável
        : process.env.JWT_SECRET || "dev-secret-fallback"; // Em dev, usa fallback

    if (!jwtSecret) {
      throwError(
        "Configuração de autenticação inválida",
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorTypes.SERVER
      );
    }

    // Gera token
    const token = jwt.sign(
      { _id: user._id },
      jwtSecret, // Usa a chave determinada acima
      { expiresIn: "7d" }
    );

    // Remove senha do response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Response
    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};
