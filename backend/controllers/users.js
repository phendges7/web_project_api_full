const User = require("../models/user");
const {
  HttpStatus,
  HttpResponseMessage,
  ErrorTypes,
} = require("../enums/http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper para formatar erros
const throwError = (message, status, type) => {
  const error = new Error(message);
  error.status = status;
  error.type = type;
  throw error;
};

// controller para buscar usuario atuals
const getCurrentUser = async (req, res, next) => {
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
const createUser = async (req, res, next) => {
  try {
    debugger;
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
const updateUserInfo = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
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
const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
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
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throwError(
        "Email e senha são obrigatórios",
        HttpStatus.BAD_REQUEST,
        ErrorTypes.VALIDATION
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throwError(
        "Credenciais inválidas",
        HttpStatus.UNAUTHORIZED,
        ErrorTypes.AUTH
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throwError(
        "Credenciais inválidas",
        HttpStatus.UNAUTHORIZED,
        ErrorTypes.AUTH
      );
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "segredoSuperSecreto",
      { expiresIn: "7d" }
    );

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

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

module.exports = {
  getCurrentUser,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
};
