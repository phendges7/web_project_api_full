import jwt from "jsonwebtoken";
import { HttpStatus, HttpResponseMessage } from "../enums/http.js";

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Verificação mais robusta do header Authorization
  if (
    typeof authorization !== "string" ||
    !authorization.startsWith("Bearer ")
  ) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: HttpResponseMessage.UNAUTHORIZED,
      details: "Token de autenticação ausente ou mal formatado",
    });
  }

  const token = authorization.slice(7); // Mais eficiente que replace()

  // Validação mais segura do JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error("Falta configurar JWT_SECRET no ambiente");
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Erro interno no servidor",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Verificação adicional do payload
    if (!payload || typeof payload !== "object") {
      throw new Error("Payload do token inválido");
    }

    req.user = {
      _id: payload._id,
      // Inclua apenas os dados necessários no req.user
      ...(payload.email && { email: payload.email }),
      ...(payload.role && { role: payload.role }),
    };

    return next();
  } catch (error) {
    console.error("Falha na autenticação:", error.name, error.message);

    const response = {
      success: false,
      message: HttpResponseMessage.UNAUTHORIZED,
    };

    // Mensagens mais específicas para diferentes erros
    if (error.name === "TokenExpiredError") {
      response.details = "Token expirado";
    } else if (error.name === "JsonWebTokenError") {
      response.details = "Token inválido";
    } else {
      response.details = "Falha na autenticação";
    }

    return res.status(HttpStatus.UNAUTHORIZED).json(response);
  }
};

export default auth;
