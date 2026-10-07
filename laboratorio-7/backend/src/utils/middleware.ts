import { NextFunction, Request, Response } from "express";
import logger from "./logger";
import config from "./config";
import jwt from "jsonwebtoken";

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
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

const errorHandler = (
  error: { name: string; message: string },
  request: Request,
  response: Response,
  next: NextFunction
) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message });
  }
  // TODO (P2): username o email repetido (E11000)
  else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    response.status(400).json({ error: "username or email already exists" });
  }
  // TODO (P4): token expirado (TokenExpiredError)
  else if (
    error.name === "TokenExpiredError" ||
    error.name === "JsonWebTokenError"
  ) {
    response.status(401).json({ error: "token invalid" });
  }
  else {
    next(error);
  }
};

// TODO (P4): verificar el JWT de la cookie `token` y el header `X-CSRF-Token`,
// y guardar el id del usuario en `req.userId`.
export const withUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: "token missing" });
    return;
  }

  const decodedToken = jwt.verify(token, config.JWT_SECRET);
  const csrfToken = req.headers["x-csrf-token"];

  if (
    typeof decodedToken === "object" &&
    decodedToken.id &&
    decodedToken.csrf === csrfToken
  ) {
    req.userId = decodedToken.id;
    next();
  } else {
    res.status(401).json({ error: "invalid token" });
  }
};

// TODO (P5): withOptionalUser

export default { requestLogger, unknownEndpoint, errorHandler };
