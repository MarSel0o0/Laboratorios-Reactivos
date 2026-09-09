import { NextFunction, Request, Response, Router } from "express"
import { Post } from "../models/post.ts"
import {validateCommentCreation} from "../middlware/validators.ts";

const router = Router();

// GET /api/thread/:id -> { thread, comments }
router.get("/:id", (request: Request, response: Response, next: NextFunction) => {
  const id = Number(request.params.id);

  Promise.all([Post.findById(id), Post.find({ thread:id})])
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
router.post("/:id", validateCommentCreation, (request: Request, response: Response, next) => {
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

// PUT /api/thread/:id -> Edita un comentario en ese thread
router.post("/:id", validateCommentCreation, (request: Request, response: Response, next) => {
  const id = Number(request.params.id);
  const { content, author, thread, parent, likes, dislikes } = request.body;

  await Post.findOne({ id: id })
    .then((post) => {
      if (post) {
        post.content = content;
        post.author = author;
        post.thread = thread;
        post.parent = parent;
        post.likes = likes;
        post.dislikes = dislikes;

        post.save().then((updatedPost) => response.json(updatedPost));
      } else {
        response.status(404).json({
          error: "Post not found",
        });
      }
    })
    .catch((error) => next(error));
});

  comment
    .save()
    .then((saved) => response.json(saved))
    .catch((error) => next(error));
});

export default router;