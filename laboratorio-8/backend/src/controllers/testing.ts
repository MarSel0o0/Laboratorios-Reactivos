import express from "express";
import PostModel from '../models/posts'
import User from '../models/user'

const router = express.Router();

router.post("/reset", async (request, response) => {
    await PostModel.deleteMany({});
    await User.deleteMany({});

    response.status(204).end();
});

export default router;
