import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "./config";
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

export const validatePassword = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
  } else if (error.name === "TokenExpiredError") {
    response.status(401).json({ error: "invalid token" });
  }

  next(error);
};

// TODO (P4): verificar el JWT de la cookie `token` y el header `X-CSRF-Token`,
// y guardar el id del usuario en `req.userId`.
export const withUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.token;
    if (!token) res.status(401).json({ error: "missing token" });
    else {
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
    }
  } catch (error) {
    res.status(401).json({ error: "invalid token" });
  }
};

export const withOptionalUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.token;
    if (token) {
      const decodedToken = jwt.verify(token, config.JWT_SECRET);
      const csrfToken = req.headers["x-csrf-token"];
      if (
        typeof decodedToken === "object" &&
        decodedToken.id &&
        decodedToken.csrf === csrfToken
      ) {
        req.userId = decodedToken.id;
        req.body.author = decodedToken.username;
      } else {
        res.status(401).json({ error: "invalid token" });
        return;
      }
    }
    if (!req.body.author) req.body.author = "Anónimo";
    next();
  } catch (error) {
    res.status(401).json({ error: "invalid token" });
  }
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
