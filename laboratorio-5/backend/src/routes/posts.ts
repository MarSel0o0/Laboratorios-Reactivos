import { Router } from "express";
import { Post } from "../models/post";

const router = Router();

router.put("/:id", (request, response, next) => {
  const { id } = request.params;
  Post.findByIdAndUpdate(id, request.body, { new: true, runValidators: true, context: "query" })
    .then(updated => {
      if (updated){
        response.json(updated);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));


});

export default router;