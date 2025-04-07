export const SELECTORS = {
  // Elementos GLOBAIS
  root: document.querySelector(".root"),
  cardContainer: document.querySelector(".card-grid"),
  cardTemplate: "#cardTemplate",

  // Elementos do PERFIL
  profileName: document.querySelector(".profile__name"),
  profileDescription: document.querySelector(".profile__description"),
  profileAvatar: document.querySelector(".profile__picture"),
  profileEditButton: document.querySelector(".profile__edit-button"),
  profileEditAvatarButton: document.querySelector(
    ".profile__picture-container"
  ),

  // Elementos de CARD
  cardAddButton: document.querySelector(".profile__add-place-button"),
  cardTitle: document.querySelector(".card__title"),
  cardImage: document.querySelector(".card__image"),
  cardLikeButton: document.querySelector(".card__like-button"),
  cardDeleteButton: document.querySelector(".card__delete-button"),

  // POPUPS
  popupProfile: document.querySelector("#popupProfile"),
  popupAvatar: document.querySelector("#popupAvatar"),
  popupCard: document.querySelector("#popupCard"),
  popupDeleteCard: document.querySelector("#popupDeleteCard"),
  popupImage: document.querySelector(".popupImage"),
};

export const API_BASE_URL = {
  baseUrl: "https://around-api.pt-br.tripleten-services.com/v1",
  defaultHeaders: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `8308cb53-bc91-42d1-afda-3dc42a0181bf`,
  },
};
