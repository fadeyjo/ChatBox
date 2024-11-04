export default interface IMessageFromDataBase {
    message_id: number;
    content: string;
    dispatch_date_time: string;
    is_checked: boolean;
    sender_id: number;
    recipient_id: number;
}
