import { useState, useContext } from "react";
import CardContext from "../../../../../contexts/CardContext";

export default function AddPlacePopup({ onClose, onSubmit }) {
  const { handleCardFormSubmit } = useContext(CardContext);
  const [placeName, setPlaceName] = useState("");
  const [placeImageUrl, setPlaceImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setIsLoading(true);

    try {
      const newCard = await handleCardFormSubmit({
        name: placeName,
        link: placeImageUrl,
      });

      // Adiciona o novo card à lista de cards
      onSubmit({
        name: placeName,
        link: placeImageUrl,
        newCard,
      });

      // Limpa os campos após o envio
      setPlaceName("");
      setPlaceImageUrl("");

      // Fecha o popup
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Erro adicionar card:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="popup__form" name="new-card-form" onSubmit={handleSubmit}>
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_place"
          id="place-name"
          name="firstInput"
          placeholder="Nome do local"
          required
          type="text"
          minLength="2"
          maxLength="30"
          onChange={(evt) => setPlaceName(evt.target.value)}
        />
        <span className="popup__input-error" data-input="firstInput"></span>
      </label>
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_url"
          id="place-link"
          name="secondInput"
          placeholder="URL da imagem"
          required
          type="url"
          onChange={(evt) => setPlaceImageUrl(evt.target.value)}
        />
        <span className="popup__input-error" data-input="secondInput"></span>
      </label>
      <button
        type="submit"
        className="popup__submit-button"
        disabled={isLoading}
      >
        {isLoading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
