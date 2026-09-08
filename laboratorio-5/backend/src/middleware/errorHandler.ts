import type { NextFunction, Request, Response } from "express";

export const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

export const errorHandler = (
  error: { name: string; message: string },
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error(error.message);

  if (error.name === "CastError"){
    response.status(400).send({ error: "malformatted id" });
    return;
  }

  if (error.name === "ValidationError"){
    response.status(400).json({ error: error.message });
    return;
  }


  next(error);
};