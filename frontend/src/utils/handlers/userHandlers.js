import * as api from "../api";
import { handleError } from "./errorHandlers";

// FUNCTION - manipula dados do form de PERFIL
export async function handleProfileFormSubmit({ name, about, setCurrentUser }) {
  try {
    const updatedUser = await api.updateUserInfo({ name, about });
    setCurrentUser((prev) => ({
      ...prev,
      name: updatedUser.name,
      about: updatedUser.about,
    }));
    return updatedUser;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// FUNCTION - manipula dados do form de AVATAR
export async function handleAvatarFormSubmit({ avatarUrl, setCurrentUser }) {
  try {
    const updatedUser = await api.updateAvatar(avatarUrl);
    setCurrentUser((prev) => ({
      ...prev,
      avatar: updatedUser.avatar,
    }));
    return updatedUser;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
