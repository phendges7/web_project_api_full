import * as api from "../api";

export const handleCardFormSubmit = async ({ name, link }) => {
  try {
    const newCard = await api.addCard({ name, link });
    return { success: true, card: newCard };
  } catch (error) {
    return { success: false, error };
  }
};

export async function handleCardLike(card) {
  try {
    const updatedCard = await api.changeLikeCardStatus(card._id, !card.isLiked);

    // Retorna os likes como array de strings (IDs)
    const likes = updatedCard.likes.map((like) => like._id.toString());

    return {
      success: true,
      card: updatedCard,
      likes, // Array de IDs dos usuários que curtiram
      isLiked: likes.includes(card.owner._id.toString()), // Calcula o novo estado
    };
  } catch (error) {
    return {
      success: false,
      error,
      originalCard: card,
    };
  }
}

export const handleCardDelete = async (card, userId) => {
  try {
    const response = await api.deleteCard(card._id, userId);

    // Se a resposta já tem o formato que precisamos, apenas retorne
    if (response && typeof response.success !== "undefined") {
      return response;
    }

    // Para manter compatibilidade com outras respostas
    return {
      success: true,
      shouldRemove: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      shouldRemove: false,
    };
  }
};
