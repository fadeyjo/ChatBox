import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import profileImagesController from "../controllers/profileImages-controller";
import { body, param } from "express-validator";
import multer from "multer";

const profileImageRouter = Router();

const upload = multer();

profileImageRouter.post(
    "/",
    upload.single("image"),
    authMiddleware,
    profileImagesController.newProfileImage
);
profileImageRouter.get(
    "/:userId",
    param("userId").isNumeric(),
    authMiddleware,
    profileImagesController.getProfileImage
);

export default profileImageRouter;
