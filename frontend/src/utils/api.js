import { getToken } from "./token";

const BASE_URL = "http://localhost:7000"; // Substitua pelo URL da sua API

// FUNCTION - pegar cabecalhos
const getHeaders = () => {
  const token = getToken();
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// FUNCTION - tratar respostas
export const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status} ${res.statusText}`);
};

// FUNCTION - tratar erros
export const handleError = (err) => {
  if (err instanceof TypeError) {
    console.error("Erro de rede: Não foi possível se conectar ao servidor.");
    return {
      type: "network",
      message: "Erro de rede: Não foi possível se conectar ao servidor.",
    };
  } else if (err instanceof SyntaxError) {
    console.error("Erro de sintaxe na resposta da API.");
    return {
      type: "syntax",
      message: "Erro de sintaxe na resposta. Tente novamente mais tarde.",
    };
  } else {
    console.error("Erro desconhecido:", err.message || err);
    return {
      type: "unknown",
      message: err.message || "Ocorreu um erro desconhecido.",
    };
  }
};

// FUNCTION - login usuario
export const loginUser = ({ email, password }) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  })
    .then(handleResponse)
    .catch(handleError);
};

// FUNCTION - registrar usuario
export const registerUser = ({ email, password }) => {
  return fetch("/api/signup", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  })
    .then(handleResponse)
    .catch(handleError);
};

// FUNCTION - obter dados do usuario
export const getUserInfo = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: getHeaders(),
  })
    .then(handleResponse)
    .catch(handleError);
};

// FUNCTION - obter dados dos cards
export const getCards = () => {
  return fetch(`${BASE_URL}/cards`, {
    method: "GET",
    headers: getHeaders(),
  })
    .then(handleResponse)
    .catch(handleError);
};

// FUNCTION - atualizar dados do usuario
export const updateUserInfo = ({ name, about }) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ name, about }),
  })
    .then(handleResponse)
    .catch(handleError);
};

// FUNCTION - atualizar avatar do usuario
export const updateAvatar = (avatar) => {
  return fetch(`${BASE_URL}/users/me/avatar`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ avatar }),
  })
    .then(handleResponse)
    .catch(handleError);
};

// FUNCTION - adicionar novo card
export const addCard = ({ name, link }) => {
  return fetch(`${BASE_URL}/cards`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name, link }),
  })
    .then(handleResponse)
    .catch(handleError);
};

// FUNCTION - mudar status de like do card
export const changeLikeCardStatus = (cardId, isLiked) => {
  return fetch(`${BASE_URL}/cards/${cardId}/likes`, {
    method: isLiked ? "PUT" : "DELETE",
    headers: getHeaders(),
  })
    .then(handleResponse)
    .catch(handleError);
};

// FUNCTION - deletar card
export const deleteCard = (cardId) => {
  return fetch(`${BASE_URL}/cards/${cardId}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
    .then(handleResponse)
    .catch(handleError);
};

// FUNCTION - obter dados do usuario e cards
export const fetchUserAndCards = async () => {
  try {
    const [userData, cardsData] = await Promise.all([
      getUserInfo(),
      getCards(),
    ]);
    return [userData, cardsData || []];
  } catch (error) {
    console.error("Error in fetchUserAndCards:", error);
    throw error;
  }
};
