import IMessageFromDataBase from "../interfaces/IMessageFromDataBase";

export default class MessageDto {
    messageId: number;
    content: string;
    dispatchDateTime: string;
    isChecked: boolean;
    senderId: number;
    recipientId: number;

    constructor(message: IMessageFromDataBase) {
        this.messageId = message.message_id;
        this.content = message.content;
        this.dispatchDateTime = message.dispatch_date_time;
        this.isChecked = message.is_checked;
        this.senderId = message.sender_id;
        this.recipientId = message.recipient_id;
    }
}
