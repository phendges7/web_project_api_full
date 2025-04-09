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
  await api.changeLikeCardStatus(card._id, !card.isLiked);
}

export const handleCardDelete = async (card, userId) => {
  try {
    const response = await api.deleteCard(card._id, userId);

    // Se a API retornar um erro de permissão
    if (response && !response.success) {
      return {
        success: false,
        message: response.message,
        shouldRemove: false,
      };
    }

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
