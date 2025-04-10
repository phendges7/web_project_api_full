const Card = require("../models/card");
const { HttpStatus, HttpResponseMessage } = require("../enums/http.js");

// controller para buscar todos os cards
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find()
      .populate("owner", "name about avatar")
      .populate("likes", "_id name"); // Popula apenas o necessário

    // Garante que todos os cards tenham o campo likes como array
    const normalizedCards = cards.map((card) => ({
      ...card._doc,
      likes: card.likes || [],
      isLiked: card.likes.some(
        (like) => like._id.toString() === req.user._id.toString()
      ),
    }));

    res.status(200).json(normalizedCards);
  } catch (error) {
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
    const { cardId } = req.params;

    await Card.findByIdAndDelete(cardId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Card excluído com sucesso",
      shouldRemove: true,
    });
  } catch (error) {
    next(error);
  }
};

// Modifique o likeCard e dislikeCard para retornar os likes populados
const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).populate("likes", "_id"); // Popula apenas os IDs dos usuários que deram like

    if (!updatedCard) {
      return res.status(404).json({ message: "Card não encontrado" });
    }

    res.json({
      success: true,
      card: updatedCard,
      // Retorna os IDs dos likes para facilitar a verificação no front
      likes: updatedCard.likes.map((like) => like._id.toString()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao curtir card" });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    ).populate("likes", "_id");

    if (!updatedCard) {
      return res.status(404).json({ message: "Card não encontrado" });
    }

    res.json({
      success: true,
      card: updatedCard,
      likes: updatedCard.likes.map((like) => like._id.toString()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao descurtir card" });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
