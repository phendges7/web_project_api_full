const router = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

// rota para buscar todos os cards
router.get("/", getCards);

// rota para criar um card
router.post("/", createCard); // Rota para criar um card

// rota para deletar um card
router.delete("/:cardId", deleteCard);

// rota para curtir um card
router.put("/:cardId/likes", likeCard);

// rota para descurtir um card
router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
