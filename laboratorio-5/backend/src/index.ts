import "dotenv/config";

import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { Post } from "./models/post.ts";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.get("/api/threads", (req, res) => {
  Post.find({}).then((posts) => {
    res.json(posts);
  });
});

app.post("/api/threads", async (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    res.status(400).json({
      error: "content missing",
    });
  } else {
    const posts = await Post.find({});
    const ids = posts
      .map((p) => p.id)
      .filter((id) => typeof id === "number" && !Number.isNaN(id));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const thread = {
      id: maxId + 1,
      content: body.content,
      author: body.author ?? null,
      thread: null,
      parent: null,
      likes: 0,
      dislikes: 0,
    };

    const threadToSave = new Post(thread);
    threadToSave
      .save()
      .then((savedPost) => res.json(savedPost))
      .catch((error) => next(error));
  }
});

app.get("/api/threads/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const thread = await Post.findOne({ id: id });
    if (!thread) {
      res.status(404).json({
        error: "Thread does not exist",
      });
    } else {
      const comments = await Post.find({ thread: id });
      res.json({ thread, comments });
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/threads/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  const thread = await Post.findOne({ id: id });

  if (!thread) {
    res.status(404).json({
      error: "Thread does not exist",
    });
  } else {
    const { content, author, parent } = req.body;

    if (!content) {
      res.status(400).json({
        error: "content missing",
      });
    } else {
      const posts = await Post.find({});
      const ids = posts
        .map((p) => p.id)
        .filter((id) => typeof id === "number" && !Number.isNaN(id));
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      const thread = {
        id: maxId + 1,
        content: content,
        author: author ?? null,
        thread: id,
        parent: parent ?? null,
        likes: 0,
        dislikes: 0,
      };

      const threadToSave = new Post(thread);
      threadToSave
        .save()
        .then((savedPost) => res.json(savedPost))
        .catch((error) => next(error));
    }
  }
});

app.put("/api/posts/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  const { content, author, thread, parent, likes, dislikes } = req.body;

  await Post.findOne({ id: id })
    .then((post) => {
      if (post) {
        post.content = content;
        post.author = author;
        post.thread = thread;
        post.parent = parent;
        post.likes = likes;
        post.dislikes = dislikes;

        post.save().then((updatedPost) => res.json(updatedPost));
      } else {
        res.status(400).json({
          error: "Post not found",
        });
      }
    })
    .catch((error) => next(error));
});

const errorHandler = (
  error: { name: string; message: string },
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(error.message);

  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 7064;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
