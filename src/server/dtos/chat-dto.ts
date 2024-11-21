import IChatFromDataBase from "../interfaces/IChatFromDataBase";

export default class ChatDto {
    chatId: number;
    firstUserId: number;
    secondUserId: number;

    constructor(chat: IChatFromDataBase) {
        this.chatId = chat.chat_id;
        this.firstUserId = chat.first_user_id;
        this.secondUserId = chat.second_user_id;
    }
}
