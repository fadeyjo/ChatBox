import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import messageController from "../controllers/message-controller";
import { body, param } from "express-validator";

const messageRouter = Router();

messageRouter.post(
    "/",
    body("content").isLength({ min: 1 }),
    body("chatId").isNumeric(),
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
    "/:chatId",
    param("chatId").isNumeric(),
    authMiddleware,
    messageController.getMessagesByChatId
);

messageRouter.delete(
    "/:messageId",
    param("messageId").isNumeric(),
    authMiddleware,
    messageController.deleteMessageById
);

export default messageRouter;
