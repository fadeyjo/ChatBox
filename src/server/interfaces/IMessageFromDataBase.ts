export default interface IMessageFromDataBase {
    message_id: number;
    content: string;
    dispatch_date_time: string;
    is_checked: boolean;
    children_message_id: number | null;
    sender_id: number;
    chat_id: number;
}
