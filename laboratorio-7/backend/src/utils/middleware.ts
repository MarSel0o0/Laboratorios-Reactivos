import { NextFunction, Request, Response } from "express";
import logger from "./logger";

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const validatePassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (typeof password !== "string" || password.length < 3) {
    res
      .status(400)
      .json({ error: "password must be at least 3 characters long" });
    return;
  }
  next();
};

const errorHandler = (
  error: { name: string; message: string },
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message });
  } else if (error.message.includes("E11000")) {
    if (error.message.includes("index: username_1")) {
      response.status(400).json({ error: "username already exists" });
    } else if (error.message.includes("index: email_1")) {
      response.status(400).json({ error: "email already exists" });
    } else {
      response.status(400).json({ error: "duplicate key" });
    }
  }
  // TODO (P4): token expirado (TokenExpiredError)
  else {
    next(error);
  }
};

// TODO (P4): verificar el JWT de la cookie `token` y el header `X-CSRF-Token`,
// y guardar el id del usuario en `req.userId`.
export const withUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  res.status(501).json({ error: "not implemented" });
};

// TODO (P5): withOptionalUser

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  validatePassword,
};
