import ApiError from "../exceptions/ApiError";
import IMessageFromDataBase from "../interfaces/IMessageFromDataBase";
import userService from "./user-service";
import db from "../db";
import dateTimeService from "./dateTime-service";
import MessageDto from "../dtos/message-dto";
import chatService from "./chat-service";

class MessageService {
    async newMessage(
        content: string,
        childrenMessageId: number | null,
        senderId: number,
        chatId: number
    ) {
        if (!(await userService.userIsExistsById(senderId)))
            throw ApiError.BadRequest("Sender with this is isn't found");

        if (!(await chatService.chatIsExistsById(chatId)))
            throw ApiError.BadRequest("Chat isn't found");
        if (
            childrenMessageId &&
            !(await this.messageIsExistById(childrenMessageId))
        )
            throw ApiError.BadRequest("Children message isn't found");

        const nowFormattedDate = dateTimeService.getNowDate();
        const messageData: IMessageFromDataBase = (
            await db.query(
                "INSERT INTO messages (content, dispatch_date_time, children_message_id, sender_id, chat_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [content, nowFormattedDate, childrenMessageId, senderId, chatId]
            )
        ).rows[0];
        messageData.dispatch_date_time = dateTimeService.formatDateTime(
            messageData.dispatch_date_time
        );
        return new MessageDto(messageData);
    }

    async getMessagesByChatId(chatId: number) {
        if (!(await chatService.chatIsExistsById(chatId))) return [];

        const messagesData: IMessageFromDataBase[] = (
            await db.query("SELECT * FROM messages WHERE chat_id = $1", [
                chatId,
            ])
        ).rows;
        return messagesData.map((message) => {
            message.dispatch_date_time = dateTimeService.formatDateTime(
                message.dispatch_date_time
            );
            return new MessageDto(message);
        });
    }

    async deleteMessages(messageId: number) {
        if (!(await this.messageIsExistById(messageId))) {
            throw ApiError.BadRequest("Message with this id isn't found");
        }
        const messageData: IMessageFromDataBase = (
            await db.query(
                "DELETE FROM messages WHERE message_id = $1 RETURNING *",
                [messageId]
            )
        ).rows[0];
        messageData.dispatch_date_time = dateTimeService.formatDateTime(
            messageData.dispatch_date_time
        );
        return new MessageDto(messageData);
    }

    async getMessageById(messageId: number) {
        if (!(await this.messageIsExistById(messageId)))
            throw ApiError.BadRequest("Message isn't found");
        const messageData: IMessageFromDataBase = (
            await db.query("SELECT * FROM messages WHERE message_id = $1", [
                messageId,
            ])
        ).rows[0];
        messageData.dispatch_date_time = dateTimeService.formatDateTime(
            messageData.dispatch_date_time
        );
        return new MessageDto(messageData);
    }

    async messageIsExistById(messageId: number) {
        const message: IMessageFromDataBase[] = (
            await db.query("SELECT * FROM messages WHERE message_id = $1", [
                messageId,
            ])
        ).rows;
        if (message.length == 0) {
            return false;
        }
        return true;
    }
}

export default new MessageService();
