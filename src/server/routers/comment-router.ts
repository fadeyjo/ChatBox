import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import commentController from "../controllers/comment-controller";
import { body, param } from "express-validator";

const commentRouter = Router();

commentRouter.post(
    "/",
    body("content").isLength({ min: 1 }),
    body("postId").isNumeric(),
    authMiddleware,
    commentController.newComment
);
commentRouter.get(
    "/:postId",
    param("postId").isNumeric(),
    authMiddleware,
    commentController.getCommentsByPostId
);
commentRouter.delete(
    "/:commentId",
    param("commentId").isNumeric(),
    authMiddleware,
    commentController.deleteComment
);

export default commentRouter;
