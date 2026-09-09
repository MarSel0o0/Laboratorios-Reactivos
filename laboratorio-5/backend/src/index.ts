import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Post } from './models/posts';
import { validateThreadCreation, validateCommentCreation } from './middlewares/validators';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());
app.use(express.static("dist"));

app.get("/api/threads", (req, res, next) => {
    Post.find({ thread: null })
      .then((posts) => {
          if (posts) {
              res.json(posts);
          } else {
              res.status(404).end();
          }
      })
      .catch((error) => {
          next(error);
      })
});

app.post("/api/threads", validateThreadCreation, (req, res, next) => {
  Post.findOne().sort({ id: -1 })
    .then((lastPost) => {
      const nextId = lastPost ? lastPost.id + 1 : 1;

      const { content, author } = req.body;
      const newPost = new Post({
        id: nextId,
        content,
        author,
      })
      return newPost.save();
    })
    .then((post) => {
      res.json(post);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/threads/:id", (req, res, next) => {
  const threadId = Number(req.params.id);
  Post.findOne({ id: threadId })
    .then((thread) => {
      if (thread) {
        return Post.find({ thread: threadId })
          .then((comments) => {
            res.json({
              thread: thread,
              comments: comments
            });
          });
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/threads/:id", validateCommentCreation, (req, res, next) => {
  Post.findOne().sort({ id: -1 })
    .then((lastPost) => {
      const nextId = lastPost ? lastPost.id + 1 : 1;

      const { content, author, parent } = req.body;
      const newPost = new Post({
        id: nextId,
        content,
        author,
        thread: Number(req.params.id),
        parent: parent || null,
      })
      return newPost.save();
    })
    .then((post) => {
      res.json(post);
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/posts/:id", (req, res, next) => {
  const threadId = Number(req.params.id);
  const { likes, dislikes } = req.body;

  Post.findOne({ id: threadId })
    .then((post) => {
      if (post) {
        post.likes = likes;
        post.dislikes = dislikes;

        post.save().then((updatedPost) => { res.json(updatedPost) });
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => { next(error) });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});