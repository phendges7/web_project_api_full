import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Handlers
import {
  handleProfileFormSubmit,
  handleAvatarFormSubmit,
} from "../utils/handlers/userHandlers";
import {
  handleCardFormSubmit,
  handleCardLike,
  handleCardDelete,
} from "../utils/handlers/cardHandlers";
import {
  handleOpenPopup,
  handleClosePopup,
} from "../utils/handlers/popupHandlers";
import { handleError } from "../utils/handlers/errorHandlers";

// Components
import Register from "./Register";
import Login from "../components/Login";
import Header from "./Header";
import Main from "./Main/Main";
import Footer from "./Footer";
import InfoTooltip from "./Main/components/Popup/components/InfoTooltip";
import Popup from "./Main/components/Popup/Popup";

// Contexts
import CurrentUserContext from "../contexts/CurrentUserContext";
import CardContext from "../contexts/CardContext";
import AppContext from "../contexts/AppContext";

// Utils
import * as auth from "../utils/auth";
import * as api from "../utils/api";
import { setToken, getToken, removeToken } from "../utils/token";
import { Popups } from "./Main/components/constants";

function App() {
  const [currentUser, setCurrentUser] = useState({
    email: "",
    name: "",
    about: "",
    avatar: "",
    _id: "",
  });

  // Estados de controladores
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [popup, setPopup] = useState(null);
  const [cards, setCards] = useState([]); // Estado de cards adicionado

  const navigate = useNavigate();
  const location = useLocation();

  // FUNCTION - VALIDA TOKEN
  useEffect(() => {
    const token = getToken();
    if (token) {
      const loadData = async () => {
        try {
          // 1. Valida token com auth API
          const authData = await auth.getUserInfo(token);

          // 2. Carrega dados completos do usuário
          const userData = await api.getUserInfo();

          setCurrentUser({
            email: authData?.data.email,
            _id: authData.data?._id || userData?._id || "",
            name: userData?.name,
            about: userData?.about,
            avatar: userData?.avatar,
          });

          setIsLoggedIn(true);
          navigate(location.state?.from || "/");
        } catch {
          removeToken();
        }
      };

      loadData();
    }
  }, [location.state?.from, navigate]);

  // FUNCTION - REGISTRO
  const onRegister = async ({ email, password }) => {
    try {
      await auth.register({ email, password });
      setIsRegistrationSuccess(true);
      navigate("/signin");
    } catch {
      setIsRegistrationSuccess(false);
    } finally {
      setIsInfoTooltipOpen(true);
    }
  };

  // FUNCTION - LOGIN
  const onLogin = async ({ email, password }) => {
    try {
      const jwtToken = await auth.authorize(email, password);
      if (!jwtToken) throw new Error("Token não recebido");

      const userData = await auth.getUserInfo(jwtToken);

      setCurrentUser({
        email,
        name: userData.name,
        about: userData.about,
        avatar: userData.avatar,
        _id: userData._id,
      });

      setToken(jwtToken);
      setIsLoggedIn(true);
      navigate(location.state?.from || "/");
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
      setIsLoginTooltipOpen(true);
      removeToken();
      setIsLoggedIn(false);
      throw error;
    }
  };

  // FUNCTION - ATUALIZAR DADOS DO USUARIO
  const onUpdateProfile = async ({ name, about }) => {
    try {
      const updatedUser = await handleProfileFormSubmit({
        name,
        about,
        setCurrentUser,
      });
      onClosePopup();
      return updatedUser;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  // FUNCTION - ATUALIZAR AVATAR
  const onUpdateAvatar = async (avatarUrl) => {
    try {
      const updatedAvatar = await handleAvatarFormSubmit({
        avatarUrl,
        setCurrentUser,
      });
      onClosePopup();
      return updatedAvatar;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  // FUNCTION - CRIAR NOVO CARD
  const onAddCard = async ({ name, link }) => {
    try {
      const newCard = await handleCardFormSubmit({
        name,
        link,
      });
      setCards((prevCards) => [newCard, ...prevCards]); // Atualizar estado de cards
      onClosePopup();
      return newCard;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  // FUNCTION - LIKE CARD
  const onCardLike = async (card) => {
    try {
      await handleCardLike(card, setCards);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  // FUNCTION - DELETAR CARD
  const onCardDelete = async (card) => {
    try {
      await handleCardDelete(card, setCards);
      setCards((prevCards) => prevCards.filter((c) => c._id !== card._id)); // Atualizar estado de cards
      onClosePopup();
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  // FUNCTION - ABRIR POPUP
  const onOpenPopup = (popupType, ...args) => {
    if (Popups[popupType]) {
      const popupConfig =
        typeof Popups[popupType] === "function"
          ? Popups[popupType](...args)
          : Popups[popupType];
      handleOpenPopup(setPopup, popupConfig);
    } else {
      console.error(`Tipo de popup desconhecido: ${popupType}`);
    }
  };

  // FUNCTION - FECHAR POPUP
  const onClosePopup = () => {
    handleClosePopup(setPopup);
  };

  //------------- RENDER -------------//
  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser,
          handleUpdateUser: onUpdateProfile,
          handleUpdateAvatar: onUpdateAvatar,
        }}
      >
        <CardContext.Provider
          value={{
            handleCardFormSubmit: onAddCard,
            handleCardLike: onCardLike,
            handleCardDelete: onCardDelete,
          }}
        >
          <div className="page">
            <Header />
            <main className="content">
              <Routes>
                {/* REDIRECIONAMENTO DE ROTAS */}
                <Route
                  path="*"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/" replace />
                    ) : (
                      <Navigate to="/signin" replace />
                    )
                  }
                />
                {/* ROTA PRIVADA */}
                {/*------------- MAIN -------------*/}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Main
                        onOpenPopup={onOpenPopup}
                        onClosePopup={onClosePopup}
                        popup={popup}
                        onCardLike={onCardLike}
                        onCardDelete={onCardDelete}
                        cards={cards} // Passando cards como propriedade
                        setCards={setCards} // Passando setCards como propriedade
                      />
                    </ProtectedRoute>
                  }
                />
                {/* ROTA PUBLICA */}
                {/*------------- SIGNIN -------------*/}
                <Route
                  path="/signin"
                  element={
                    <div className="login">
                      <Login onLogin={onLogin} />
                    </div>
                  }
                />
                {/*------------- SIGNUP -------------*/}
                <Route
                  path="/signup"
                  element={<Register onRegister={onRegister} />}
                />
              </Routes>
            </main>
            <Footer />
          </div>
          {/*------------- POPUP -------------*/}
          <Popup
            isOpen={!!popup}
            onClose={onClosePopup}
            title={popup?.title || ""}
            contentClassName={popup?.contentClassName}
          >
            {popup?.children}
          </Popup>
          {/*------------- INFO TOOLTIP -------------*/}
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={() => setIsInfoTooltipOpen(false)}
            isSuccess={isRegistrationSuccess}
          />
        </CardContext.Provider>
      </CurrentUserContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
