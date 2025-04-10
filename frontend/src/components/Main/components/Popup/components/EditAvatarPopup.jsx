import { useRef, useContext, useState } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext.js";

export default function EditAvatar() {
  const { currentUser, handleUpdateAvatar } = useContext(CurrentUserContext);
  const avatarRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setIsLoading(true);
    try {
      await handleUpdateAvatar(avatarUrl);
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (evt) => {
    setAvatarUrl(evt.target.value);
  };

  return (
    <form
      className="popup__form"
      name="avatar-form"
      id="edit-avatar-form"
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          ref={avatarRef}
          className="popup__input popup__input_type_url"
          id="avatar-link"
          name="firstInput"
          placeholder="URL da imagem"
          required
          type="url"
          minLength="2"
          maxLength="200"
          onChange={handleInputChange}
        />
        <span className="popup__input-error" data-input="firstInput"></span>
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
