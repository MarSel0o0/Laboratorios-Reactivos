import { Router } from "express";
import { Post } from "../models/post";

const router = Router();

// GET /api/threads: todos los threads (no comentarios)
router.get("/", (request, response, next) => {
    Post.find({ thread: null })
      .then(posts => response.json(posts))
      .catch(error => next(error));
});

// POST /api/threads: crear un thread nuevo
router.post("/", (request, response, next) => {
  const { content, author } = request.body;
  new Post({ content, author, thread: null, parent: null })
    .save()
    .then(saved => response.json(saved))
    .catch(next);
});

export default router;