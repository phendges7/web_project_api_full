import Popup from "./Popup.js";

export default function PopupWithForm({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
}) {
  const handleSubmit = (event) => {
    debugger;
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());
    onSubmit(formValues);
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} title={title}>
      <form className="popup__form" name="form" onSubmit={handleSubmit}>
        {children}
        <button type="submit" className="popup__save-button">
          Salvar
        </button>
      </form>
    </Popup>
  );
}
