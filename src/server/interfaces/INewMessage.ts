export default interface INewMessage {
    content: string;
    childrenMessageId: number | null;
    chatId: number;
}
