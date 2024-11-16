import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import postImageController from "../controllers/postImage-controller";
import multer from "multer";
import { body, param } from "express-validator";

const postImageRouter = Router();

const upload = multer();

postImageRouter.post(
    "/",
    upload.array("images"),
    body("postId").isNumeric(),
    authMiddleware,
    postImageController.newPostImages
);
postImageRouter.get(
    "/:postId",
    param("postId").isNumeric(),
    authMiddleware,
    postImageController.getPostImages
);

export default postImageRouter;
