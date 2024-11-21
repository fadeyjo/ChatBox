import { Router } from "express";
import { body, param } from "express-validator";
import authMiddleware from "../middlewares/auth-middleware";
import chatController from "../controllers/chat-controller";

const chatRouter = Router();

chatRouter.post(
    "/",
    body("secondUserId").isNumeric(),
    authMiddleware,
    chatController.newChat
);

chatRouter.get("/", authMiddleware, chatController.getChatsByUserId);

chatRouter.get(
    "/:chatId",
    param("chatId").isNumeric(),
    authMiddleware,
    chatController.getChatById
);

chatRouter.delete(
    "/:chatId",
    param("chatId").isNumeric(),
    authMiddleware,
    chatController.deleteChatById
);

export default chatRouter;
