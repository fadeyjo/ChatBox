import $api from "../http";
import IGetMessage from "../interfaces/IResponses/IGetMessage";

export default class MessageService {
    static async newMessage(
        content: string,
        chatId: number,
        childrenMessageId: number | null = null
    ) {
        return await $api.post<IGetMessage>("/message", {
            content,
            childrenMessageId,
            chatId,
        });
    }

    static async getMessageById(messageId: number) {
        return await $api.get<IGetMessage>(`/message/redirect/${messageId}`);
    }

    static async getMessagesByChatId(chatId: number) {
        return await $api.get<{ messages: IGetMessage[] }>(
            `/message/${chatId}`
        );
    }

    static async deleteMessageById(messageId: number) {
        return await $api.delete<IGetMessage>(`/message/${messageId}`);
    }

    static async checkMessage(messageId: number) {
        return await $api.put<IGetMessage>("/message", { messageId });
    }

    static async getUnreadMessages() {
        return await $api.get<{ unreadMessagesAmount: number }>(
            "/message/unread"
        );
    }
}
