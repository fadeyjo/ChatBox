export default interface INewMessage {
    content: string;
    childrenMessageId: number | null;
    recipientId: number;
}
