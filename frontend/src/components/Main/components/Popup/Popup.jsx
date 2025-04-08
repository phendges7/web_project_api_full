export default function Popup({
  isOpen,
  onClose,
  title,
  children,
  contentClassName,
}) {
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
