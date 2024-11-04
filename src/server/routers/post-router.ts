import { Router } from "express";
import postController from "../controllers/post-controller";
import authMiddleware from "../middlewares/auth-middleware";
import { param } from "express-validator";

const postRouter = Router();

postRouter.post("/", authMiddleware, postController.newPost);
postRouter.get(
    "/:userId",
    param("userId").isNumeric(),
    authMiddleware,
    postController.getPostsByUserId
);
postRouter.delete("/:postId", param("postId").isNumeric(), authMiddleware, postController.deletePost);

export default postRouter;
