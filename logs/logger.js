import winston from "winston";
import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV_LOG = process.env.NODE_ENV_LOG || 'developer';

let logger;
if (process.env.NODE_ENV_LOG === "production") {
    logger = winston.createLogger({
        transports: [
            new winston.transports.Console({
            level: "info",
        }),
        new winston.transports.File({
            filename: "logs/errors.log",
            level: "error",
            format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
            ),
        }),
        ],
    });
} else {
    logger = winston.createLogger({
        transports: [
        new winston.transports.Console({
        level: "debug",
        }),
    ],
    });
}
export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    next();
};
export const logError = (error) => {
    const errorLogger = winston.createLogger({
        transports: [
        new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
        }),
    ],
    });
    errorLogger.error(error);
};






/*const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: "red",
    error: "orange",
    warning: "yellow",
    info: "green",
    debug: "blue",
  },
};*/