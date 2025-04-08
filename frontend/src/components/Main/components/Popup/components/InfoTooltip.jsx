import Popup from "../Popup.jsx";
import successIcon from "../../../../../images/successIcon.png";
import failIcon from "../../../../../images/failIcon.png";
import { useEffect } from "react";

export default function InfoTooltip({
  isOpen,
  onClose,
  isSuccess,
  errorType = null, // 'register' | 'login' | 'permission'
}) {
  const messages = {
    registerSuccess: {
      text: "Cadastro realizado com sucesso!\nAgora você pode fazer login.",
      icon: successIcon,
      altText: "Ícone de sucesso",
    },
    registerError: {
      text: "Ops, algo deu errado!\nPor favor, tente novamente.",
      icon: failIcon,
      altText: "Ícone de erro",
    },
    loginError: {
      text: "Falha no login!\nVerifique seu email e senha.",
      icon: failIcon,
      altText: "Ícone de erro",
    },
    permissionError: {
      text: "Você não tem permissão para excluir este card.",
      icon: failIcon,
      altText: "Ícone de erro de permissão",
    },
  };

  const getMessage = () => {
    if (errorType === "permission") return messages.permissionError;
    if (errorType === "login") return messages.loginError;
    return isSuccess ? messages.registerSuccess : messages.registerError;
  };

  const { text, icon, altText } = getMessage();

  useEffect(() => {
    let timer;
    if (isOpen && isSuccess) {
      timer = setTimeout(() => {
        onClose();
      }, 5000);
    }
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
