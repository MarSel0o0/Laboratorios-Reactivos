import { Router } from "express";
import { Post } from "../models/post";

const router = Router();

// GET /api/thread/:id -> { thread, comments }
router.get("/:id", (request, response, next) => {
  const { id } = request.params;

  Promise.all([Post.findById(id), Post.find({ thread: id })])
    .then(([thread, comments]) => {
      if (thread) {
        response.json({ thread, comments });
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// POST /api/thread/:id -> crear un comentario en ese thread
router.post("/:id", (request, response, next) => {
  const { id } = request.params;
  const { content, author, parent } = request.body;

  const comment = new Post({
    content,
    author,
    thread: id,
    parent: parent || null,
  });

  comment
    .save()
    .then((saved) => response.json(saved))
    .catch((error) => next(error));
});

export default router;