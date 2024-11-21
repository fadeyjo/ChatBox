import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError";
import chatService from "../services/chat-service";
import INewChat from "../interfaces/INewChat";

class ChatController {
    async newChat(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                throw ApiError.BadRequest(
                    "Incorrect second user id",
                    errors.array()
                );
            const firstUserId = Number(res.locals.userData.userId);
            const { secondUserId }: INewChat = req.body;
            const newChat = await chatService.newChat(
                firstUserId,
                secondUserId
            );
            res.json({ ...newChat });
        } catch (error) {
            next(error);
        }
    }

    async getChatsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(res.locals.userData.userId);
            const chats = await chatService.getChatsByUserId(userId);
            res.json({ chats });
        } catch (error) {
            next(error);
        }
    }

    async getChatById(req: Request, res: Response, next: NextFunction) {
        try {
            const chatId = Number(req.params.chatId);
            const chat = await chatService.getChatByChatId(chatId);
            res.json({ ...chat });
        } catch (error) {
            next(error);
        }
    }

    async deleteChatById(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                throw ApiError.BadRequest("Incorrect chat id", errors.array());
            const chatId = Number(req.params.chatId);
            const chatData = await chatService.deleteChatById(chatId);
            res.json({ ...chatData });
        } catch (error) {
            next(error);
        }
    }
}

export default new ChatController();
