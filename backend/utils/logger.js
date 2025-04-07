const fs = require("fs");
const path = require("path");

// Verifica se o diretório de logs existe, se não existir, cria o diretório
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Formato do log
const logFormat = (data) =>
  JSON.stringify({
    timestamp: new Date().toISOString(),
    ...data,
  });

// Funções para registrar logs de requisições
const requestLogger = (req) => {
  const logData = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    params: req.params,
    query: req.query,
    body: req.body,
  };

  fs.appendFileSync(
    path.join(logsDir, "request.log"),
    logFormat(logData) + "\n",
    "utf8"
  );
};

// Função para registrar logs de erro
const errorLogger = (error, req = null) => {
  const logData = {
    error: error.message,
    stack: error.stack,
    type: error.type || "UNKNOWN_ERROR",
    status: error.status || 500,
    ...(req && {
      method: req.method,
      path: req.path,
      ip: req.ip,
    }),
  };

  fs.appendFileSync(
    path.join(logsDir, "error.log"),
    logFormat(logData) + "\n",
    "utf8"
  );
};

module.exports = {
  requestLogger,
  errorLogger,
};
