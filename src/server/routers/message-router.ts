import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import messageController from "../controllers/message-controller";
import { body, param } from "express-validator";

const messageRouter = Router();

messageRouter.post(
    "/",
    body("content").isLength({ min: 1 }),
    body("recipientId").isNumeric(),
    authMiddleware,
    messageController.newMessage
);
messageRouter.get(
    "/redirect/:messageId",
    param("messageId").isNumeric(),
    authMiddleware,
    messageController.getMessageById
);
messageRouter.get(
    "/:secondUserId",
    param("secondUserId").isNumeric(),
    authMiddleware,
    messageController.getMessagesBySecondFriendId
);
messageRouter.delete(
    "/:messageId",
    param("messageId").isNumeric(),
    authMiddleware,
    messageController.deleteMessageById
);

export default messageRouter;
