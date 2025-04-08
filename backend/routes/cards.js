const router = require("express").Router();
const {
  validateCreateCard,
  validateCardId,
} = require("../validators/cardsValidator");

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

// Define as rotas
router.get("/", getCards); // Rota para obter todos os cards
router.post("/", validateCreateCard, createCard); // Rota para criar um card
router.delete("/:cardId", validateCardId, deleteCard); // Rota para deletar um card
router.put("/:cardId/likes", validateCardId, likeCard); // Rota para curtir um card
router.delete("/:cardId/likes", validateCardId, dislikeCard); // Rota para descurtir um card

module.exports = router;
