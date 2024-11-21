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
}
