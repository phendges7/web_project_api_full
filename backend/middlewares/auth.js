const jwt = require("jsonwebtoken");
const { HttpStatus, HttpResponseMessage } = require("../enums/http");

const auth = (req, res, next) => {
  console.log("Rota atual:", req.path);

  // Verifica se o token JWT está presente no cabeçalho Authorization
  // Se não houver token, retorna um erro de não autorizado
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: HttpResponseMessage.UNAUTHORIZED,
    });
  }

  // Remove o prefixo "Bearer " do token
  // Verifica se o token é válido
  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "segredoSuperSecreto",
      { expiresIn: "6h" }
    );
    req.user = payload;
    next();
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: HttpResponseMessage.UNAUTHORIZED,
    });
  }
};

module.exports = auth;
