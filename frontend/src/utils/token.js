const TOKEN_KEY = "jwt";

export const setToken = (token) => {
  try {
    if (!token) throw new Error("Token inválido");
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  } catch (error) {
    console.error("Erro ao salvar token:", error);
  }
};

export const getToken = () => {
  try {
    const token = JSON.parse(localStorage.getItem(TOKEN_KEY));
    if (!token) throw new Error("Token inválido");
    return token;
  } catch {
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Erro ao remover token:", error);
  }
};
