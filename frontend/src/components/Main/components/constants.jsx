import EditAvatar from "./Popup/components/EditAvatarPopup";
import EditProfile from "./Popup/components/EditProfilePopup";
import AddPlace from "./Popup/components/AddPlacePopup";
import ImagePopup from "./Popup/components/ImagePopup";

export const Popups = {
  editAvatarPopup: {
    type: "editAvatarPopup",
    title: "Alterar foto de perfil",
    children: <EditAvatar />,
    contentClassName: "popup__content",
  },
  editProfilePopup: {
    type: "editProfilePopup",
    title: "Editar perfil",
    children: <EditProfile />,
    contentClassName: "popup__content",
  },
  addPlacePopup: {
    type: "addPlacePopup",
    title: "Novo local",
    children: <AddPlace />,
    contentClassName: "popup__content",
  },
  imagePopup: (card) => ({
    type: "imagePopup",
    title: "",
    children: <ImagePopup card={card} />,
    contentClassName: "popup__image-content",
  }),
};
