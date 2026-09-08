"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_1 = require("../models/post");
const router = (0, express_1.Router)();
// GET /api/thread/:id -> { thread, comments }
router.get("/:id", (request, response, next) => {
    const { id } = request.params;
    Promise.all([post_1.Post.findById(id), post_1.Post.find({ thread: id })])
        .then(([thread, comments]) => {
        if (thread) {
            response.json({ thread, comments });
        }
        else {
            response.status(404).end();
        }
    })
        .catch((error) => next(error));
});
// POST /api/thread/:id -> crear un comentario en ese thread
router.post("/:id", (request, response, next) => {
    const { id } = request.params;
    const { content, author, parent } = request.body;
    const comment = new post_1.Post({
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
exports.default = router;
//# sourceMappingURL=thread.js.map