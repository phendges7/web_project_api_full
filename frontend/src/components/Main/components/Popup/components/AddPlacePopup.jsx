import { useState, useContext } from "react";
import CardContext from "../../../../../contexts/CardContext";

export default function AddPlacePopup({ onClose }) {
  const { handleCardFormSubmit } = useContext(CardContext);
  const [placeName, setPlaceName] = useState("");
  const [placeImageUrl, setPlaceImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    placeName: "",
    placeImageUrl: "",
  });

  const validate = () => {
    const newErrors = {};
    if (!placeName.trim())
      newErrors.placeName = "O nome do local é obrigatório";
    if (!placeImageUrl.trim())
      newErrors.placeImageUrl = "A URL da imagem é obrigatória";
    else if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(placeImageUrl)) {
      newErrors.placeImageUrl = "URL de imagem inválida";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await handleCardFormSubmit({
        name: placeName,
        link: placeImageUrl,
      });

      // Limpa o formulário após sucesso
      setPlaceName("");
      setPlaceImageUrl("");

      // Fecha o popup
      if (onClose) onClose();
    } catch (error) {
      console.error("Erro ao adicionar card:", error);
      setErrors({
        placeName: "Erro ao salvar",
        placeImageUrl: "Erro ao salvar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="popup__form" name="new-card-form" onSubmit={handleSubmit}>
      <label className="popup__field">
        <input
          className={`popup__input popup__input_type_place ${
            errors.placeName ? "popup__input_error" : ""
          }`}
          id="place-name"
          name="placeName"
          placeholder="Nome do local"
          required
          type="text"
          minLength="2"
          maxLength="30"
          value={placeName}
          onChange={(evt) => setPlaceName(evt.target.value)}
        />
        <span className="popup__input-error">{errors.placeName}</span>
      </label>
      <label className="popup__field">
        <input
          className={`popup__input popup__input_type_url ${
            errors.placeImageUrl ? "popup__input_error" : ""
          }`}
          id="place-link"
          name="placeImageUrl"
          placeholder="URL da imagem"
          required
          type="url"
          value={placeImageUrl}
          onChange={(evt) => setPlaceImageUrl(evt.target.value)}
        />
        <span className="popup__input-error">{errors.placeImageUrl}</span>
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
