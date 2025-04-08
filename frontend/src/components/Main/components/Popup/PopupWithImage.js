import Popup from "./Popup.js";

export default function PopupWithImage({ isOpen, onClose, card }) {
  return (
    <Popup isOpen={isOpen} onClose={onClose} title="">
      <img className="popup__image" src={card.link} alt={card.name} />
      <p className="popup__caption">{card.name}</p>
    </Popup>
  );
}
