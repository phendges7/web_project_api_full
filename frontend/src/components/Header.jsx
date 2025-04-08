import headerLogo from "../images/headerLogo.svg";
import { useContext } from "react";
import AppContext from "../contexts/AppContext";
import CurrentUserContext from "../contexts/CurrentUserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/token";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const location = useLocation();
  const navigate = useNavigate();

  const onSignout = () => {
    removeToken();
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate("/login");
  };

  const getAuthButton = () => {
    if (isLoggedIn) {
      return {
        text: "Sair",
        action: onSignout,
      };
    }
    if (location.pathname === "/register") {
      return {
        text: "Fazer Login",
        action: () => navigate("/login"),
      };
    }
    return {
      text: "Entrar",
      action: () => navigate("/login"),
    };
  };

  const authButton = getAuthButton();

  return (
    <header className="header">
      <img
        src={headerLogo}
        alt="Around the U.S logo"
        className="logo header__logo"
      />
      <div className="header__navbar">
        <p className="header__current-user-email">{currentUser?.email}</p>
        <button onClick={authButton.action} className="header__auth-button">
          {authButton.text}
        </button>
      </div>
    </header>
  );
};

export default Header;
