import winston from "winston";

const customLevelsOptions = {
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
  };

const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
    new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
    winston.format.colorize({
            all: true,
            colors: {
            fatal: "red",
            error: "yellow",
            warning: "magenta",
            info: "green",
            debug: "cyan",
            },
        }),
        winston.format.simple()
        ),
    }),
    new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
        format: winston.format.simple(),
    }),
    ],
});

export const loggerTesting = async (req, res) => {
    req.logger = logger
    try {
        req.logger.debug(`${req.method} en ${req.url}- ${new  Date().toISOString()} - Probando logger debug`)
        req.logger.http(`${req.method} en ${req.url}- ${new  Date().toISOString()} - Probando logger http`)
        req.logger.info(`${req.method} en ${req.url}- ${new  Date().toISOString()} - Probando logger info`)
        req.logger.warning(`${req.method} en ${req.url}- ${new  Date().toISOString()} - Probando logger warning`)
        req.logger.error(`${req.method} en ${req.url}- ${new  Date().toISOString()} - Probando logger error`)
        req.logger.fatal(`${req.method} en ${req.url}- ${new  Date().toISOString()} - Probando logger fatal`)
        res.status(200).send({message:"Test en consola"})
    } catch (err) {
        req.logger.error(`${req.method} en ${req.url}, ${new  Date().toLocaleTimeString()}`)
        res.status(500).send(err);
    }
}

