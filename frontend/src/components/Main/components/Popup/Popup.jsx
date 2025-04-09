import { useEffect } from "react";

export default function Popup({
  isOpen,
  onClose,
  title,
  children,
  contentClassName,
}) {
  // Adiciona o evento para fechar o popup com a tecla ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleEscClose = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscClose);

    // Remove o evento quando o componente é desmontado ou o popup é fechado
    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="overlay visible" onClick={onClose}>
      <div className="popup popup__opened" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="popup__close-button"
          onClick={onClose}
          aria-label="Fechar"
        />

        <div className={contentClassName}>
          {title && <h2 className="popup__title">{title}</h2>}
          {children}
        </div>
      </div>
    </div>
  );
}
