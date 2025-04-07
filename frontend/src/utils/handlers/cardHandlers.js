import * as api from "../api";

export async function handleCardFormSubmit({ name, link }) {
  try {
    const newCard = await api.addCard({ name, link });
    return newCard;
  } catch (error) {
    console.error("Error adding card:", error);
    throw error;
  }
}

export async function handleCardLike(card) {
  await api.changeLikeCardStatus(card._id, !card.isLiked);
}

export async function handleCardDelete(card) {
  await api.deleteCard(card._id);
}
