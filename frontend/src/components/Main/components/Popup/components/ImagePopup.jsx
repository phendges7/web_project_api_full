// ImagePopup.jsx
export default function ImagePopup({ card }) {
  if (!card) return null;

  return (
    <>
      <img className="popup__image" src={card.link} alt={card.name} />
      <h3 className="popup__image-title">{card.name}</h3>
    </>
  );
}
