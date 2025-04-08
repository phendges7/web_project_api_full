import React from "react";
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
import Main from "../pages/Main";
import Footer from "./Footer";
import InfoTooltip from "./Main/components/Popup/components/InfoTooltip";
import Popup from "./Main/components/Popup/Popup";

// Contexts
import CurrentUserContext from "../contexts/CurrentUserContext";
import CardContext from "../contexts/CardContext";
import AppContext from "../contexts/AppContext";

// Utils
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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado se o usuário está logado
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false); // Estado se o popup de informação está aberto
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false); // Estado de sucesso do registro
  const [isLoginSuccess, setIsLoginSuccess] = useState(false); // Estado de sucesso do login
  const [errorType, setErrorType] = useState(null); // Estado de tipo de erro para o popup de informação
  const [popup, setPopup] = useState(null); // Estado do popup
  const [cards, setCards] = useState([]); // Estado de cards adicionado

  const navigate = useNavigate();
  const location = useLocation();

  // FUNCTION - VALIDA TOKEN
  useEffect(() => {
    const token = getToken();
    if (token) {
      const loadData = async () => {
        try {
          // 1. Carrega dados completos do usuário
          const userData = await api.getUserInfo();

          // 2. Carrega dados de cards
          const cardsData = await api.getCards();
          console.log(cardsData);
          setCurrentUser({
            email: userData?.email,
            _id: userData?._id,
            name: userData?.name,
            about: userData?.about,
            avatar: userData?.avatar,
          });

          setCards(cardsData || []);
          setIsLoggedIn(true);
          navigate(location.state?.from || "/");
        } catch {
          removeToken();
          setIsLoggedIn(false);
        }
      };

      loadData();
    }
  }, [location.state?.from, navigate]);

  // FUNCTION - REGISTRO
  const onRegister = async ({ email, password }) => {
    try {
      await api.registerUser({ email, password });
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
      const response = await api.loginUser({ email, password });

      if (response && response.data && response.data.token) {
        setToken(response.data.token);
        const userData = response.data.user;

        setCurrentUser({
          email: userData.email,
          name: userData.name,
          about: userData.about,
          avatar: userData.avatar,
          _id: userData._id,
        });

        const cardsData = await api.getCards();
        setCards(cardsData || []);

        setIsLoginSuccess(true); // Marca login como sucesso
        setIsLoggedIn(true);
        navigate(location.state?.from || "/");
      } else {
        // Caso a resposta não venha no formato esperado
        setIsLoginSuccess(false);
        setIsInfoTooltipOpen(true);
      }
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
      setIsLoginSuccess(false);
      setIsInfoTooltipOpen(true); // Mostra o popup de erro
      removeToken();
      setIsLoggedIn(false);
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
      const newCard = await handleCardFormSubmit({ name, link });
      setCards([newCard, ...cards]);
      onClosePopup();
    } catch (error) {
      console.error("Falha ao criar card:", error);
      setIsInfoTooltipOpen(true);
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
    const result = await handleCardDelete(card, setCards, currentUser);

    if (result.success && result.shouldRemove) {
      // Remove visualmente apenas após confirmação do servidor
      setCards((prevCards) => prevCards.filter((c) => c._id !== card._id));
      onClosePopup();
    } else {
      // Mostra feedback de erro sem remover o card
      setIsRegistrationSuccess(false);
      setIsLoginSuccess(false);
      setIsInfoTooltipOpen(true);

      // Log para debug (pode remover depois)
      console.error("Falha ao excluir card:", result.message);
    }
  };

  // FUNCTION - ABRIR POPUP
  const onOpenPopup = (popupType, additionalData) => {
    if (Popups[popupType]) {
      let popupConfig;

      if (typeof Popups[popupType] === "function") {
        // Para popups dinâmicos como imagePopup
        popupConfig = Popups[popupType](additionalData);
      } else {
        // Para popups estáticos
        popupConfig = {
          ...Popups[popupType],
          children: React.cloneElement(Popups[popupType].children, {
            onClose: onClosePopup,
            ...(popupType === "addPlacePopup" && {
              handleCardFormSubmit: onAddCard,
            }),
          }),
        };
      }

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
            onClose={() => {
              setIsInfoTooltipOpen(false);
              setErrorType(null);
            }}
            isSuccess={isRegistrationSuccess || isLoginSuccess}
            errorType={errorType}
          />
        </CardContext.Provider>
      </CurrentUserContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
