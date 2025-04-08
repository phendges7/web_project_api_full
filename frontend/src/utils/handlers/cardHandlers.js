import * as api from "../api";

export const handleCardFormSubmit = async ({ name, link }) => {
  try {
    const newCard = await api.addCard({ name, link });
    setCards([newCard, ...cards]);
    return { success: true, card: newCard };
  } catch (error) {
    return { success: false, error };
  }
};

export async function handleCardLike(card) {
  await api.changeLikeCardStatus(card._id, !card.isLiked);
}

export const handleCardDelete = async (card, setCards, currentUser) => {
  try {
    // Verificação de permissão no frontend (opcional mas recomendado)
    if (card.owner._id !== currentUser._id) {
      return {
        success: false,
        message: "Você não tem permissão para excluir este card",
        type: "permission",
        shouldRemove: false, // Não remove visualmente
      };
    }

    const response = await api.deleteCard(card._id);

    if (response.success) {
      return {
        success: true,
        shouldRemove: true, // Remove visualmente apenas após sucesso
      };
    }

    return {
      success: false,
      message: response.message || "Erro ao excluir card",
      shouldRemove: false,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Erro ao excluir card",
      type: error.type,
      shouldRemove: false,
    };
  }
};
