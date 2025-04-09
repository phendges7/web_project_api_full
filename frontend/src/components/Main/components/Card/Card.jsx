export default function Card({
  card,
  onImageClick,
  isLiked,
  onCardLike,
  onCardDelete,
}) {
  const { name, link, likes = [] } = card;

  // Debug visual
  console.log(
    `Card ${card._id} - isLiked:`,
    isLiked,
    "Likes count:",
    likes.length
  );

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "active" : ""
  }`;

  function handleLikeClick() {
    console.log("Like clicked - current state:", isLiked);
    onCardLike(card);
  }

  // Manipulador do clique no botão de deletar
  function handleDeleteClick() {
    onCardDelete(card);
  }

  // Manipulador do clique na imagem do card
  function handleImageClick() {
    onImageClick(card);
  }

  return (
    <div className="card">
      <img
        className="card__image"
        src={link}
        alt={name}
        onClick={handleImageClick}
      />
      <button
        aria-label="DELETE"
        className="card__delete-button"
        type="button"
        onClick={handleDeleteClick}
      />
      <h2 className="card__title">{name}</h2>
      <button
        aria-label="LIKE"
        className={cardLikeButtonClassName}
        type="button"
        onClick={handleLikeClick}
      />
    </div>
  );
}
