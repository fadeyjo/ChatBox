import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError";
import INewMessage from "../interfaces/INewMessage";
import messageService from "../services/message-service";

class MessageController {
    async newMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect body", errors.array());
            }
            const senderId = Number(res.locals.userData.userId);
            const { content, chatId, childrenMessageId }: INewMessage =
                req.body;
            const messageData = await messageService.newMessage(
                content,
                childrenMessageId,
                senderId,
                chatId
            );
            res.json({ ...messageData });
        } catch (error) {
            next(error);
        }
    }

    async getMessagesByChatId(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                throw ApiError.BadRequest("Incorrect chat id", errors.array());

            const chatId = Number(req.params.chatId);
            const messages = await messageService.getMessagesByChatId(chatId);
            res.json({ messages });
        } catch (error) {
            next(error);
        }
    }

    async getMessageById(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                throw ApiError.BadRequest(
                    "Incorrect message id",
                    errors.array()
                );
            const messageId = Number(req.params.messageId);
            const message = await messageService.getMessageById(messageId);
            res.json({ ...message });
        } catch (error) {
            next(error);
        }
    }

    async deleteMessageById(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                throw ApiError.BadRequest(
                    "Incorrect message id",
                    errors.array()
                );
            const messageId = Number(req.params.messageId);
            const message = await messageService.deleteMessages(messageId);
            res.json({ ...message });
        } catch (error) {
            next(error);
        }
    }
}

export default new MessageController();
