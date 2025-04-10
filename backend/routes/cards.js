import { Router } from 'express';
import auth from '../middlewares/auth.js';
import checkCardOwnership from '../middlewares/checkCardOwnership.js';
import {
  validateCreateCard,
  validateCardId,
} from '../validators/cardsValidator.js';

import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards.js';

const router = Router();

// Define as rotas
router.get('/', auth, getCards); // Rota para obter todos os cards
router.post('/', auth, validateCreateCard, createCard); // Rota para criar um card
router.delete('/:cardId', auth, checkCardOwnership, validateCardId, deleteCard); // Rota para deletar um card
router.put('/:cardId/likes', auth, validateCardId, likeCard); // Rota para curtir um card
router.delete('/:cardId/likes', auth, validateCardId, dislikeCard); // Rota para descurtir um card

export default router;