import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "./db";
import threadsRouter from "./routes/threads";
import threadRouter from "./routes/thread";
import { errorHandler, unknownEndpoint } from "./middleware/errorHandler";
import postsRouter from "./routes/posts";

const app = express();
app.use(express.json());
app.use("/api/threads", threadsRouter);
app.use("/api/thread", threadRouter);



app.get("/", (_request, response) => {
  response.send("<h1>Backend Laboratorio 5</h1>");
});
app.use("/api/posts", postsRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
