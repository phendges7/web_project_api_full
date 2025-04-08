import { useContext, useEffect, useState } from "react";
import { fetchUserAndCards } from "../utils/api.js";
import Popup from "../components/Main/components/Popup/Popup.jsx";
import editProfileButton from "../images/editButton.svg";
import avatar from "../images/avatarDefault.jpg";
import Card from "../components/Main/components/Card/Card.jsx";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import CardContext from "../contexts/CardContext.js";
import { Popups } from "../components/Main/components/constants.jsx";

export default function Main({
  onOpenPopup,
  onClosePopup,
  popup,
  cards,
  setCards,
}) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { handleCardLike, handleCardDelete } = useContext(CardContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userData, cardsData] = await fetchUserAndCards();

        setCurrentUser({
          email: userData?.email,
          _id: userData?._id,
          name: userData?.name || "USUARIO PADRAO",
          about: userData?.about || "DESCRICAO PADRAO",
          avatar: userData?.avatar || avatar,
        });

        setCards(Array.isArray(cardsData) ? cardsData : []);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [setCurrentUser, setCards]);

  const handleLike = async (card) => {
    try {
      setCards((prevCards) =>
        prevCards.map((c) =>
          c._id === card._id ? { ...c, isLiked: !c.isLiked } : c
        )
      );
      await handleCardLike(card);
    } catch (error) {
      console.error("Erro ao curtir card:", error);
      // Reverte a mudança em caso de erro
      setCards((prevCards) =>
        prevCards.map((c) =>
          c._id === card._id ? { ...c, isLiked: !c.isLiked } : c
        )
      );
    }
  };

  const handleDelete = async (card) => {
    try {
      await handleCardDelete(card);
      setCards((prevCards) => prevCards.filter((c) => c._id !== card._id));
    } catch (error) {
      console.error("Erro ao deletar card:", error);
    }
  };

  if (isLoading) {
    return <div className="loading">Carregando...</div>;
  }

  const handleOpenPopup = (popupType) => {
    switch (popupType) {
      case "editProfilePopup":
        onOpenPopup({
          ...Popups.editProfilePopup,
          children: <Popups.editProfilePopup.children.type />,
        });
        break;

      case "editAvatarPopup":
        onOpenPopup({
          ...Popups.editAvatarPopup,
          children: <Popups.editAvatarPopup.children.type />,
        });
        break;

      case "addPlacePopup":
        onOpenPopup({
          ...Popups.addPlacePopup,
          children: (
            <Popups.addPlacePopup.children.type onClose={onClosePopup} />
          ),
        });
        break;

      default:
        onOpenPopup(Popups[popupType]);
    }
  };

  return (
    <>
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

      {popup && (
        <Popup
          isOpen={!!popup}
          onClose={onClosePopup}
          title={popup.title}
          contentClassName={popup.contentClassName}
        >
          {popup.children}
        </Popup>
      )}

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
