const router = require("express").Router();
const auth = require("../middlewares/auth");
const checkCardOwnership = require("../middlewares/checkCardOwnership");
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
router.get("/", auth, getCards); // Rota para obter todos os cards
router.post("/", auth, validateCreateCard, createCard); // Rota para criar um card
router.delete("/:cardId", checkCardOwnership, validateCardId, deleteCard); // Rota para deletar um card
router.put("/:cardId/likes", auth, validateCardId, likeCard); // Rota para curtir um card
router.delete("/:cardId/likes", auth, validateCardId, dislikeCard); // Rota para descurtir um card

module.exports = router;
