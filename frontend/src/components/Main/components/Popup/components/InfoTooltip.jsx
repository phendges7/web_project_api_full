import Popup from "../Popup.jsx";
import successIcon from "../../../../../images/successIcon.png";
import failIcon from "../../../../../images/failIcon.png";
import { useEffect } from "react";

export default function InfoTooltip({ isOpen, onClose, isSuccess }) {
  const messages = {
    success: {
      text: "Cadastro realizado com sucesso!\nAgora você pode fazer login.",
      icon: successIcon,
      altText: "Ícone de sucesso",
    },
    error: {
      text: "Ops, algo deu errado!\nPor favor, tente novamente.",
      icon: failIcon,
      altText: "Ícone de erro",
    },
  };

  const { text, icon, altText } = isSuccess ? messages.success : messages.error;

  useEffect(() => {
    let timer;
    // Fecha popup depois de 5 segundos apenas no sucesso
    if (isOpen && isSuccess) {
      timer = setTimeout(() => {
        onClose();
      }, 5000);
    }

    // Limpa o timer se o componente for desmontado ou se isOpen mudar
    return () => clearTimeout(timer);
  }, [isOpen, isSuccess, onClose]);

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title=""
      contentClassName="popup__content"
    >
      <img src={icon} alt={altText} className="popup__infotooltip-icon" />
      <h2
        className={`popup__infotooltip-message ${
          !isSuccess && "infotooltip__message--error"
        }`}
      >
        {text}
      </h2>
    </Popup>
  );
}
