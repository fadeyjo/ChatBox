import { Router } from "express";
import repostController from "../controllers/repost-controller";
import authMiddleware from "../middlewares/auth-middleware";
import { body, param } from "express-validator";

const repostRouter = Router();

repostRouter.post(
    "/",
    body("postId").isNumeric(),
    authMiddleware,
    repostController.newRepost
);
repostRouter.get(
    "/:authorId",
    param("authorId").isNumeric(),
    authMiddleware,
    repostController.getRepostsByUserId
);
repostRouter.delete(
    "/:repostId",
    param("repostId").isNumeric(),
    authMiddleware,
    repostController.deleteRepost
);

export default repostRouter;
