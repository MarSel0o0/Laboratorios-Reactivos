import { Router } from 'express';

import { Post } from '../models/post.ts';
import {validateThreadCreation} from "../middlware/validators.ts";

const threadsRouter = Router();


threadsRouter.get("/", async (request, response, next) => {
    try{
        const threads = await Post.find({ thread: null });
        response.json(threads);
  } catch (error) {
        next(error);
  }
});

threadsRouter.post("/", validateThreadCreation, async (request, response, next) => {
    try {
        const { content, author } = request.body;
        console.log()
        const thread = await Post.create({
        content,
        author: author || undefined, 
        thread: null,
        parent: null,
        });

    response.status(201).json(thread);
  } catch (error) {
    next(error);
  }
});

export default threadsRouter;