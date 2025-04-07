import { handleResponse } from "./api";

const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";

// FUNCTION - REGISTRA USUARIO
export const register = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email, password),
    });

    if (!response.ok) {
      let errorMessage = "Erro desconhecido"; // Valor padrão
      if (response.status === 400) {
        errorMessage = "Um ou mais campos foram preenchidos incorretamente";
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Dados do usuário:", data);
    return data;
  } catch (error) {
    console.error("Erro detalhado:", {
      endpoint: "/signup",
      error: error.message,
    });
    throw error;
  }
};

// FUNCTION - AUTORIZA USUARIO - LOGIN
export const authorize = async (email, password) => {
  const payload = {
    email,
    password,
  };
  try {
    const response = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse(response);
    return data.token;
  } catch (error) {
    console.error("Erro detalhado:", {
      endpoint: "/signin",
      error: error.message,
    });
    throw error;
  }
};

// FUNCTION - VALIDA TOKEN
export const validateToken = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro detalhado:", {
      endpoint: "/users/me",
      error: error.message,
    });
    throw error;
  }
};

// FUNCTION - obter dados do usuario
export const getUserInfo = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 403) {
      const errorData = await response.json();
      console.error("Erro de autorização:", errorData);
      throw new Error(`${errorData.message || "Sem mensagem"}`);
    }
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw error;
  }
};
