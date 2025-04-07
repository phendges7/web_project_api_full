import { createContext } from "react";

const CardContext = createContext({
  cards: [],
  setCards: () => {},
  handleAddPlaceSubmit: () => {},
  handleCardLike: () => {},
  handleCardDelete: () => {},
});

export default CardContext;
