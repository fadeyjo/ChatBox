import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import friendshipController from "../controllers/friendship-controller";
import { body, param } from "express-validator";

const friendshipRouter = Router();

friendshipRouter.post(
    "/",
    body("secondFriendId").isNumeric(),
    authMiddleware,
    friendshipController.newFriendship
);
friendshipRouter.get(
    "/:firstFriendId",
    param("firstFriendId").isNumeric(),
    authMiddleware,
    friendshipController.getFriendshipsByUserId
);
friendshipRouter.delete(
    "/:secondFriendId",
    param("secondFriendId").isNumeric(),
    authMiddleware,
    friendshipController.deleteFriendship
);

export default friendshipRouter;
