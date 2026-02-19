import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createPost, getFeed, getPost } from "../controllers/post.controller";
import {
  toggleLike,
  addComment,
  getComments,
} from "../controllers/interaction.controller";
import {
  createPostSchema,
  createCommentSchema,
} from "../validators/post.validators";

const router = Router();

router.use(authenticate);

router.post("/", validate(createPostSchema), createPost);
router.get("/", getFeed);
router.get("/:id", getPost);
router.post("/:id/like", toggleLike);
router.post("/:id/comment", validate(createCommentSchema), addComment);
router.get("/:id/comments", getComments);

export default router;
