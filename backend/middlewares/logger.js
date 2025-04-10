import winston from "winston";
import expressWinston from "express-winston";

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: "logs/request.log",
      level: "info",
    }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
  format: winston.format.json(),
});

export { requestLogger, errorLogger };
