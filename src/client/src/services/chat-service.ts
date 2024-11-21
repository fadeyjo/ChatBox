import $api from "../http";
import IGetChat from "../interfaces/IResponses/IGetChat";

export default class ChatService {
    static async newChat(secondUserId: number) {
        return await $api.post<IGetChat>("/chat", { secondUserId });
    }

    static async getChatsByUser() {
        return await $api.get<{ chats: IGetChat[] }>("/chat");
    }

    static async getChatById(chatId: number) {
        return await $api.get<IGetChat>(`/chat/${chatId}`);
    }

    static async deleteChatById(chatId: number) {
        return await $api.delete<IGetChat>(`/chat/${chatId}`);
    }
}
