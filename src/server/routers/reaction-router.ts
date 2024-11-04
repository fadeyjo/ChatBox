import { Router } from "express";
import reactionController from "../controllers/reaction-controller";
import authMiddleware from "../middlewares/auth-middleware";
import { body, param } from "express-validator";

const reactionRouter = Router();

reactionRouter.post(
    "/",
    body("postId").isNumeric(),
    authMiddleware,
    reactionController.newReaction
);
reactionRouter.get(
    "/:postId",
    param("postId").isNumeric(),
    authMiddleware,
    reactionController.getReactionsByPostId
);
reactionRouter.delete(
    "/:postId",
    param("postId").isNumeric(),
    authMiddleware,
    reactionController.deleteReactionByUserId
);

export default reactionRouter;
