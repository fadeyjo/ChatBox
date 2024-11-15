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
            const { content, recipientId, childrenMessageId }: INewMessage =
                req.body;
            const messageData = await messageService.newMessage(
                content,
                childrenMessageId,
                senderId,
                recipientId
            );
            res.json({ ...messageData });
        } catch (error) {
            next(error);
        }
    }

    async getMessagesBySecondFriendId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Second user id is null", errors.array());
            }
            const firstUserId = Number(res.locals.userData.userId);
            const secondUserId = Number(req.params.secondUserId);
            const messages = await messageService.getMessages(
                firstUserId,
                secondUserId
            );
            res.json({ messages });
        } catch (error) {
            next(error);
        }
    }

    async getMessageById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect message id", errors.array());
            }
            const messageId = Number(req.params.messageId);
            const messages = await messageService.getMessageById(
                messageId
            );
            res.json({ ...messages });
        } catch (error) {
            next(error);
        }
    }

    async deleteMessageById(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("", errors.array());
            }
            const messageId = Number(req.params.messageId);
            const message = await messageService.deleteMessages(messageId);
            res.json({ ...message });
        } catch (error) {
            next(error);
        }
    }
}

export default new MessageController();
