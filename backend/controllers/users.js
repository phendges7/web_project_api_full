const User = require("../models/user");
const { HttpStatus, HttpResponseMessage } = require("../enums/http.js");

// controller para buscar todos os usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(HttpStatus.OK).json({
      message: HttpResponseMessage.SUCCESS,
      data: users,
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
      data: user,
    });
    // Captura erros
  } catch (error) {
    console.error(`Erro ao buscar usuário: ${error.message}`);
    if (error.name === "UserNotFound") {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: HttpResponseMessage.NOT_FOUND,
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
    const { name, about, avatar } = req.body;

    const newUser = await User.create({ name, about, avatar });

    res.status(HttpStatus.CREATED).json({
      message: HttpResponseMessage.CREATED,
      data: newUser,
    });
    // Captura erros
  } catch (error) {
    console.error(`Erro ao criar usuário: ${error.message}`);
    if (error.name === "ValidationError") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpResponseMessage.BAD_REQUEST,
        details: error.message,
      });
    }

    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Usuário já cadastrado",
        details: "O nome ou avatar informado já está em uso",
      });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR,
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
        message: HttpResponseMessage.NOT_FOUND,
      });
    }
    res.status(HttpStatus.OK).json({
      message: HttpResponseMessage.SUCCESS,
      data: updatedUser,
    });
    // Captura erros
  } catch (error) {
    console.error(`Erro ao atualizar usuário: ${error.message}`);
    if (error.name === "ValidationError") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpResponseMessage.BAD_REQUEST,
        details: error.message,
      });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

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
        message: HttpResponseMessage.NOT_FOUND,
      });
    }
    res.status(HttpStatus.OK).json({
      message: HttpResponseMessage.SUCCESS,
      data: updatedUser,
    });
    // Captura erros
  } catch (error) {
    console.error(`Erro ao atualizar avatar: ${error.message}`);
    if (error.name === "ValidationError") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpResponseMessage.BAD_REQUEST,
        details: error.message,
      });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR,
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
};
