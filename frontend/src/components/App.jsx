import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Utils
import * as api from "../utils/api";

import { setToken, getToken, removeToken } from "../utils/token";

import { Popups } from "./Main/components/constants";

// Contexts
import AppContext from "../contexts/AppContext";
import CurrentUserContext from "../contexts/CurrentUserContext";
import CardContext from "../contexts/CardContext";

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

// Components
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import Login from "../components/Login";
import Header from "./Header";
import Main from "../pages/Main";
import Footer from "./Footer";
import Popup from "./Main/components/Popup/Popup";
import InfoTooltip from "./Main/components/Popup/components/InfoTooltip";

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
      const response = await api.registerUser({ email, password });

      // Verifica se houve erro na resposta da API
      if (response && response.type) {
        throw new Error(response.message || "Erro no registro");
      }
      setIsRegistrationSuccess(true);
      navigate("/signin");
    } catch (error) {
      console.error("Erro no registro:", error);
      setIsRegistrationSuccess(false);
      setErrorType("register"); // Define o tipo de erro específico
    } finally {
      setIsInfoTooltipOpen(true); // Sempre abre o popup, sucesso ou erro
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
        setErrorType("login");
      }
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
      setIsLoginSuccess(false);
      setIsInfoTooltipOpen(true);
      setErrorType("login"); // Mostra o popup de erro
      removeToken();
      setIsLoggedIn(false);
    }
  };

  // FUNCTION - ATUALIZAR DADOS DO USUARIO
  const onUpdateProfile = async ({ name, about }) => {
    try {
      // Chamada ao handler existente
      const updatedUser = await handleProfileFormSubmit({
        name,
        about,
        setCurrentUser: (updateFn) => {
          // Esta função será chamada pelo handler para atualizar o estado
          setCurrentUser((prev) => {
            const updated = updateFn(prev);
            return {
              ...updated,
              // Garante que os campos não sejam undefined
              name: updated.name || name,
              about: updated.about || about,
            };
          });
        },
      });

      onClosePopup();
      return updatedUser;
    } catch (error) {
      // Reverte para os valores originais em caso de erro
      setCurrentUser((prev) => ({
        ...prev,
        name: currentUser.name,
        about: currentUser.about,
      }));

      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  };

  // FUNCTION - ATUALIZAR AVATAR
  const onUpdateAvatar = async (avatarUrl) => {
    try {
      const updatedUser = await handleAvatarFormSubmit({
        avatarUrl,
        setCurrentUser: (updateFn) => {
          setCurrentUser((prev) => {
            const updated = updateFn(prev);
            return {
              ...updated,
              avatar: updated.avatar || avatarUrl, // Fallback
            };
          });
        },
      });

      onClosePopup();
      return updatedUser;
    } catch (error) {
      // Reverte em caso de erro
      setCurrentUser((prev) => ({
        ...prev,
        avatar: currentUser.avatar,
      }));

      console.error("Erro ao atualizar avatar:", error);
      throw error;
    }
  };

  // FUNCTION - CRIAR NOVO CARD
  const onAddCard = async ({ name, link }) => {
    try {
      const result = await handleCardFormSubmit({ name, link });

      if (result.success) {
        // Atualização otimista com rolagem para o topo
        setCards((prevCards) => [result.card, ...prevCards]);
        onClosePopup();
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Falha ao criar card:", error);
      setIsInfoTooltipOpen(true);
      setErrorType("card_creation");
    }
  };

  // FUNCTION - CURTIR/DESCURTIR CARD
  const onCardLike = async (card) => {
    try {
      // Atualização otimista imediata
      setCards((prevCards) =>
        prevCards.map((c) =>
          c._id === card._id ? { ...c, isLiked: !c.isLiked } : c
        )
      );

      const result = await handleCardLike(card);

      if (result.success) {
        // Atualização definitiva com os dados da API
        setCards((prevCards) =>
          prevCards.map((c) =>
            c._id === card._id
              ? {
                  ...c,
                  isLiked: result.isLiked,
                  likes: result.likes,
                }
              : c
          )
        );
      } else {
        // Reverte em caso de erro
        setCards((prevCards) =>
          prevCards.map((c) =>
            c._id === card._id ? { ...c, isLiked: !c.isLiked } : c
          )
        );
      }
    } catch (error) {
      console.error("Erro ao curtir card:", error);
      // Reverte em caso de exceção não tratada
      setCards((prevCards) =>
        prevCards.map((c) =>
          c._id === card._id ? { ...c, isLiked: !c.isLiked } : c
        )
      );
    }
  };

  // FUNCTION - DELETAR CARD
  const onCardDelete = async (card) => {
    try {
      const result = await handleCardDelete(card, currentUser._id);

      // Verifique explicitamente se o card deve ser removido da UI
      if (result.success && result.shouldRemove) {
        // Apenas remova o card da UI se a operação foi bem-sucedida
        setCards((prevCards) => prevCards.filter((c) => c._id !== card._id));
        onClosePopup();
      } else {
        // Se não deve remover, apenas mostre a mensagem de erro, sem alterar o estado dos cards
        setIsInfoTooltipOpen(true);
        setErrorType("permission");
      }
    } catch (error) {
      console.error("Erro ao deletar card:", error);
      setIsInfoTooltipOpen(true);
      setErrorType("permission");
      // Não altere o estado dos cards em caso de erro
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
                        cards={cards}
                        setCards={setCards}
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
