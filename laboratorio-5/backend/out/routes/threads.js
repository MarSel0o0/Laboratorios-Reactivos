"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_1 = require("../models/post");
const router = (0, express_1.Router)();
// GET /api/threads: todos los threads (no comentarios)
router.get("/", (request, response, next) => {
    post_1.Post.find({ thread: null })
        .then(posts => response.json(posts))
        .catch(error => next(error));
});
// POST /api/threads: crear un thread nuevo
router.post("/", (request, response, next) => {
    const { content, author } = request.body;
    new post_1.Post({ content, author, thread: null, parent: null })
        .save()
        .then(saved => response.json(saved))
        .catch(next);
});
exports.default = router;
//# sourceMappingURL=threads.js.map