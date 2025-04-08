const Card = require("../models/card");
const { HttpStatus, HttpResponseMessage } = require("../enums/http.js");

// controller para buscar todos os cards
const getCards = async (req, res, next) => {
  try {
    // Verifique se o modelo está acessível
    if (!Card || !Card.find) {
      throw new Error("Modelo Card não está disponível");
    }

    const cards = await Card.find()
      .populate("owner", "name about avatar")
      .populate("likes", "name about avatar");

    res.status(HttpStatus.OK).json(cards);
  } catch (error) {
    console.error("Erro detalhado:", error);
    next(error);
  }
};

// controller para criar novo card
const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;

    // O owner é automaticamente pego do token JWT
    const card = await Card.create({
      name,
      link,
      owner: req.user._id, // Usuário autenticado
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// controller deletar card por id
const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId).populate(
      "owner",
      "_id"
    );

    if (!card) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Card não encontrado",
      });
    }

    if (card.owner.toString() !== req.user._id) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: "Você não tem permissão para excluir este card",
      });
    }

    await Card.findByIdAndDelete(req.params.cardId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Card excluído com sucesso",
    });
  } catch (error) {
    next(error);
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
