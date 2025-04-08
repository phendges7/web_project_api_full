const { requestLogger, errorLogger } = require("../utils/logger");

const loggingMiddleware = (req, res, next) => {
  // Log da requisição
  requestLogger(req);

  // Intercepta respostas para logar erros
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode >= 400) {
      errorLogger(new Error(body.message || "Unknown error"), req);
    }
    originalSend.call(this, body);
  };

  next();
};

module.exports = loggingMiddleware;
