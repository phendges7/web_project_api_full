const User = require("../models/user");
const { HttpStatus, HttpResponseMessage } = require("../enums/http.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// controller para buscar todos os usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(HttpStatus.OK).json({
      message: HttpResponseMessage.SUCCESS,
      data: users
    });
    // Captura erros
  } catch (error) {
    console.error(`Erro ao buscar cards: ${error.message}`);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: HttpResponseMessage.INTERNAL_SERVER_ERROR });
  }
};

// controller para buscar um usuario
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error("Usuário não encontrado");
      error.name = "UserNotFound";
      error.status = HttpStatus.NOT_FOUND;
      throw error; // Lança o erro para ser capturado no catch
    }
    res.status(HttpStatus.OK).json({
      message: HttpResponseMessage.SUCCESS,
      data: user
    });
    // Captura erros
  } catch (error) {
    console.error(`Erro ao buscar usuário: ${error.message}`);
    if (error.name === "UserNotFound") {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: HttpResponseMessage.NOT_FOUND
      });
    }
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: HttpResponseMessage.INTERNAL_SERVER_ERROR });
  }
};

// controller para criar um usuario
const createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword
    });

    // Deleta a senha do objeto de resposta
    // Importante para não expor a senha do usuário na resposta
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    res.status(HttpStatus.CREATED).json({
      message: HttpResponseMessage.CREATED,
      data: userWithoutPassword
    });

    // Captura erros
  } catch (error) {
    console.error(`Erro ao criar usuário: ${error.message}`);
    if (error.name === "ValidationError") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpResponseMessage.BAD_REQUEST,
        details: error.message
      });
    }

    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Email  já cadastrado",
        details: "O email informado já está em uso"
      });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR
    });
  }
};

// controller para atualizar informações do usuario - name e about
const updateUserInfo = async (req, res) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );

    // Verifica se o usuário foi encontrado
    if (!updatedUser) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: HttpResponseMessage.NOT_FOUND
      });
    }
    res.status(HttpStatus.OK).json({
      message: HttpResponseMessage.SUCCESS,
      data: updatedUser
    });
    // Captura erros
  } catch (error) {
    console.error(`Erro ao atualizar usuário: ${error.message}`);
    if (error.name === "ValidationError") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpResponseMessage.BAD_REQUEST,
        details: error.message
      });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR
    });
  }
};

// controller para atualizar o avatar do usuario
const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    // Verifica se o usuário foi encontrado
    if (!updatedUser) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: HttpResponseMessage.NOT_FOUND
      });
    }
    res.status(HttpStatus.OK).json({
      message: HttpResponseMessage.SUCCESS,
      data: updatedUser
    });
    // Captura erros
  } catch (error) {
    console.error(`Erro ao atualizar avatar: ${error.message}`);
    if (error.name === "ValidationError") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpResponseMessage.BAD_REQUEST,
        details: error.message
      });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR
    });
  }
};

// controller para manipular login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se credenciais foram fornecidas
    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Email e senha são obrigatórios"
      });
    }

    // Busca o usuário pelo email incluindo a senha
    const user = await User.findOne({ email }).select("+password");

    // Verifica se o usuário existe
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Email ou senha inválidos"
      });
    }

    // Cria o token JWT
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "seuSegredoSuperSecreto",
      {
        expiresIn: "7d"
      }
    );

    // Retorna o token e os dados do usuário (sem a senha)
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(HttpStatus.OK).json({
      message: HttpResponseMessage.SUCCESS,
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error(`Erro ao fazer login: ${error.message}`);
    if (error.name === "ValidationError") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpResponseMessage.BAD_REQUEST,
        details: error.message
      });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR
    });
  }
};

// exporta os metodos
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
  login
};
