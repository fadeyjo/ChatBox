export default interface IGetMessage {
    messageId: number;
    content: string;
    dispatchDateTime: string;
    isChecked: boolean;
    childrenMessageId: number | null;
    senderId: number;
    chatId: number;
}
