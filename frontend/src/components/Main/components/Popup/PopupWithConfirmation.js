import Popup from "./Popup";

export default function PopupWithConfirmation({
  isOpen,
  onClose,
  onSubmit,
  children,
  title,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
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
