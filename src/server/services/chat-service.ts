import ApiError from "../exceptions/ApiError";
import userService from "./user-service";
import db from "../db";
import IChatFromDataBase from "../interfaces/IChatFromDataBase";
import ChatDto from "../dtos/chat-dto";

class ChatService {
    async newChat(firstUserId: number, secondUserId: number) {
        if (!(await userService.userIsExistsById(firstUserId)))
            throw ApiError.BadRequest("First user isn't found");
        if (!(await userService.userIsExistsById(secondUserId)))
            throw ApiError.BadRequest("Second user isn't found");
        if (await this.chatIsExists(firstUserId, secondUserId))
            throw ApiError.BadRequest("Chat already exists");
        const chatData: IChatFromDataBase = (
            await db.query(
                "INSERT INTO chats (first_user_id, second_user_id) VALUES ($1, $2) RETURNING *",
                [firstUserId, secondUserId]
            )
        ).rows[0];
        return new ChatDto(chatData);
    }

    async getChatsByUserId(userId: number) {
        if (!(await userService.userIsExistsById(userId)))
            throw ApiError.BadRequest("User isn't found");
        const chats: IChatFromDataBase[] = (
            await db.query(
                "SELECT * FROM chats WHERE first_user_id = $1 OR second_user_id = $1",
                [userId]
            )
        ).rows;
        return chats.map((chat) => new ChatDto(chat));
    }

    async chatIsExists(firstUserId: number, secondUserId: number) {
        const chatData: IChatFromDataBase[] = (
            await db.query(
                "SELECT * FROM chats WHERE (first_user_id = $1 AND second_user_id = $2) OR (first_user_id = $2 AND second_user_id = $1)",
                [firstUserId, secondUserId]
            )
        ).rows;
        if (chatData.length === 0) return false;
        return true;
    }

    async chatIsExistsById(chatId: number) {
        const chatData: IChatFromDataBase[] = (
            await db.query("SELECT * FROM chats WHERE chat_id = $1", [chatId])
        ).rows;
        if (chatData.length === 0) return false;
        return true;
    }

    async getChatByChatId(chatId: number) {
        if (!(await this.chatIsExistsById(chatId)))
            throw ApiError.BadRequest("Chat isn't found");
        const chatData: IChatFromDataBase = (
            await db.query("SELECT * FROM chats WHERE chat_id = $1", [chatId])
        ).rows[0];
        return new ChatDto(chatData);
    }

    async deleteChatById(chatId: number) {
        if (!(await this.chatIsExistsById(chatId)))
            throw ApiError.BadRequest("Chat isn't found");
        const chatData: IChatFromDataBase = (
            await db.query("DELETE FROM chats WHERE chat_id = $1 RETURNING *", [
                chatId,
            ])
        ).rows[0];
        return new ChatDto(chatData);
    }
}

export default new ChatService();
