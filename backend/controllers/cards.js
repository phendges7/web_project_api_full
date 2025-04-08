const Card = require("../models/card");
const { HttpStatus, HttpResponseMessage } = require("../enums/http.js");

// controller para buscar todos os cards
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate("owner");

    if (!cards) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Nenhum card encontrado",
      });
    }

    res.status(HttpStatus.OK).json(cards);
  } catch (error) {
    console.error("Erro ao buscar cards:", error);
    next(error); // Passa para o middleware de erro
  }
};

// controller para criar novo card
const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const newCard = await Card.create({ name, link, owner });

    // Retorna o card criado
    res.status(HttpStatus.CREATED).json({
      message: HttpResponseMessage.CREATED,
      data: newCard,
    });
    // Captura erros
  } catch (error) {
    console.error(`Erro ao criar cartão: ${error.message}`);

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

// controller deletar card por id
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    // Busca o card pelo ID
    const card = await card.findById(cardId);
    if (!card) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: HttpResponseMessage.NOT_FOUND,
      });
    }

    // Verifica se o usuário é o dono do card
    if (card.owner.toString() !== req.user._id.toString()) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: HttpResponseMessage.FORBIDDEN,
      });
    }

    // Deleta o card
    await Card.findByIdAndDelete(cardId);
    res.json({
      message: HttpResponseMessage.SUCCESS,
    });
    // Captura erros
  } catch (error) {
    console.error(`Erro ao deletar cartão: ${error.message}`);

    // Verifica se o ID é inválido
    if (error.name === "CastError") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpResponseMessage.BAD_REQUEST,
        details: "ID inválido",
      });
    }

    // Retorna erro interno do servidor
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.SERVER_ERROR,
    });
  }
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    // Busca o card pelo ID
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    // Verifica se o card foi encontrado
    if (!updatedCard) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: HttpResponseMessage.NOT_FOUND,
      });
    }

    // Retorna o card atualizado
    res.status(HttpStatus.OK).json({
      message: HttpResponseMessage.SUCCESS,
      data: updatedCard,
    });
  } catch (error) {
    // Captura erros
    console.error(`Erro ao curtir card: ${error.message}`);

    // Verifica se o ID é inválido
    if (error.name === "CastError") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpResponseMessage.BAD_REQUEST,
        details: "ID inválido",
      });
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.SERVER_ERROR,
    });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    // Busca o card pelo ID
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!updatedCard) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: HttpResponseMessage.NOT_FOUND,
      });
    }
    res.status(HttpStatus.OK).json({
      message: HttpResponseMessage.SUCCESS,
      data: updatedCard,
    });
  } catch (error) {
    // Captura erros
    console.error(`Erro ao descurtir card: ${error.message}`);

    // Verifica se o ID é inválido
    if (error.name === "CastError") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpResponseMessage.BAD_REQUEST,
        details: "ID inválido",
      });
    }

    // Retorna erro interno do servidor
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.SERVER_ERROR,
    });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
