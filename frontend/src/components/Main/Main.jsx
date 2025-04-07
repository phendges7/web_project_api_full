import { useContext, useEffect, useState } from "react";

import { fetchUserAndCards } from "../../utils/api.js";

import Popup from "./components/Popup/Popup.jsx";
import editProfileButton from "../../images/editButton.svg";
import avatar from "../../images/avatarDefault.jpg";
import Card from "./components/Card/Card";
import ImagePopup from "./components/Popup/components/ImagePopup.jsx";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";
import CardContext from "../../contexts/CardContext.js";

export default function Main({
  onOpenPopup,
  onClosePopup,
  popup,
  cards,
  setCards,
}) {
  // Contextos atuais
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { handleCardLike, handleCardDelete } = useContext(CardContext);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do usuário
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userData, cardsData] = await fetchUserAndCards();
        console.log("Dados recebidos:", {
          userData,
          cardsData,
          currentUserId: currentUser._id,
        });

        setCurrentUser((prev) => ({
          ...prev,
          name: userData.name || "USUARIO PADRAO",
          about: userData.about || "DESCRICAO PADRAO",
          avatar: userData.avatar || avatar,
          _id: userData._id || "",
        }));
        // Verifica se cardsData existe e é um array antes de mapear
        const processedCards = Array.isArray(cardsData)
          ? cardsData.map((card) => ({
              ...card,
              isLiked: card.isLiked, // Usa diretamente o valor da API
            }))
          : [];

        setCards(processedCards);
        console.log(
          "Cards processados:",
          processedCards.map((c) => ({
            id: c._id,
            isLiked: c.isLiked,
          }))
        );
      } catch {
        console.error("Erro ao carregar dados iniciais:", Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [setCurrentUser, setCards, currentUser._id]);

  if (isLoading) {
    return <div className="loading">Carregando...</div>;
  }

  // FUNCTION - LIKE CARD
  const handleLike = async (card) => {
    try {
      // Atualiza o estado local imediatamente
      setCards((prevCards) =>
        prevCards.map((c) =>
          c._id === card._id ? { ...c, isLiked: !c.isLiked } : c
        )
      );

      // Envia a requisição para a API em segundo plano
      handleCardLike(card).catch((error) => {
        console.error("Falha na API (silenciosa):", error);
      });
    } catch (error) {
      console.error("Erro inesperado:", error);
    }
  };

  // FUNCTION - DELETAR CARD
  const handleDelete = async (card) => {
    try {
      await handleCardDelete(card);
      setCards((prevCards) => prevCards.filter((c) => c._id !== card._id));
    } catch (error) {
      console.error("Erro ao deletar card:", error);
    }
  };

  return (
    <>
      {/*------------- PROFILE -------------*/}
      <div className="profile">
        <div className="profile__picture-container">
          <img
            src={currentUser?.avatar || avatar}
            alt="Foto de Perfil"
            className="profile__picture"
          />
          <div
            className="profile__overlay"
            onClick={() => onOpenPopup("editAvatarPopup")}
          ></div>
        </div>
        <div className="profile__info-wrapper">
          <div className="profile__info">
            <h1 className="profile__name">{currentUser?.name}</h1>
            <img
              src={editProfileButton}
              alt="Editar Perfil"
              className="profile__edit-button"
              onClick={() => onOpenPopup("editProfilePopup")}
            />
          </div>
          <p className="profile__description">{currentUser?.about}</p>
        </div>
        <button
          aria-label="Add card"
          className="profile__add-place-button"
          type="button"
          onClick={() => onOpenPopup("addPlacePopup")}
        ></button>
      </div>

      {/*------------- POPUP -------------*/}
      {popup && (
        <Popup
          onClose={onClosePopup}
          title={popup.title}
          className="popup__opened"
        >
          {popup.children}
        </Popup>
      )}

      {/*------------- CARDS -------------*/}
      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            isLiked={card.isLiked}
            onCardLike={handleLike}
            onCardDelete={handleDelete}
            onImageClick={() => onOpenPopup("imagePopup", card)}
          />
        ))}
      </div>
    </>
  );
}
