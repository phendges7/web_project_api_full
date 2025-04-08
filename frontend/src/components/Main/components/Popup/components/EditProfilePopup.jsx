import { useState, useContext } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext.js";

export default function EditProfile() {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser?.name || "");
  const [description, setDescription] = useState(currentUser?.about || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await handleUpdateUser({ name, about: description });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="popup__form"
      name="profile-form"
      id="edit-profile-form"
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          type="text"
          name="firstInput"
          id="owner-name"
          className="popup__input popup__input_type_name"
          placeholder="Nome"
          minLength="2"
          maxLength="40"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <span className="popup__input-error" data-input="firstInput"></span>
      </label>
      <label className="popup__field">
        <input
          type="text"
          name="secondInput"
          id="user-description"
          className="popup__input popup__input_type_description"
          placeholder="Sobre mim"
          minLength="2"
          maxLength="200"
          required
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <span className="popup__input-error" data-input="secondInput"></span>
      </label>

      <button
        type="submit"
        className="popup__submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
