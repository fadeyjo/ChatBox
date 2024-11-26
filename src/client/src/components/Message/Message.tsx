import React, {
    Dispatch,
    forwardRef,
    useContext,
    useEffect,
    useState,
} from "react";
import s from "./Message.module.css";
import IGetMessage from "../../interfaces/IResponses/IGetMessage";
import classNames from "classnames";
import { RiSendPlane2Line } from "react-icons/ri";
import MessageService from "../../services/message-service";
import { Context } from "../..";
import DateTimeService from "../../services/dateTime-service";
import { IoMdClose } from "react-icons/io";
import IUser from "../../interfaces/IResponses/IUser";
import UserService from "../../services/user-service";
import { globalSocket } from "../../globalSocket";
import io from "socket.io-client";

const Message = forwardRef<
    HTMLDivElement,
    {
        message: IGetMessage;
        isSelf: boolean;
        setResend?: Dispatch<
            React.SetStateAction<{
                content: string;
                childrenMessageId: number;
            } | null>
        >;
        isChild: boolean;
        deleteMessage?: ({ messageId }: { messageId: number }) => void;
    }
>(({ message, isSelf, setResend, isChild, deleteMessage }, ref) => {
    const { store } = useContext(Context);

    const [childMessage, setChildMessage] = useState<JSX.Element | null>(null);
    const [author, setAuthor] = useState({} as IUser);

    const loadUser = async () => {
        setAuthor((await UserService.getUserById(message.senderId)).data);
    };

    useEffect(() => {
        loadUser();
        if (message.childrenMessageId) {
            MessageService.getMessageById(message.childrenMessageId)
                .then((response) => response.data)
                .then((data) => {
                    setChildMessage(
                        <Message
                            message={data}
                            isSelf={data.senderId === store.user.userId}
                            isChild={true}
                        />
                    );
                });
        }
    }, []);

    return (
        <div
            ref={ref}
            data-message-id={message.messageId}
            className={classNames(s.message, {
                [s.left]: !isSelf && !isChild,
                [s.right]: isSelf && !isChild,
                [s.child_message_back]: isChild,
                [s.unread]: !isChild && message.senderId === store.user.userId && !message.isChecked,
            })}
        >
            {!isChild && (
                <RiSendPlane2Line
                    className={classNames({
                        [s.left_but]: isSelf,
                        [s.right_but]: !isSelf,
                    })}
                    onClick={() => {
                        if (!setResend) return;
                        setResend({
                            content: message.content,
                            childrenMessageId: message.messageId,
                        });
                    }}
                />
            )}
            {isChild ? (
                <div className={s.resend_form}>
                    <div className={s.reseond_header}>
                        Resend by: {author.firstName}
                    </div>
                    <div>{message.content}</div>
                </div>
            ) : (
                message.content
            )}
            <div>{childMessage}</div>
            {!isChild && (
                <div className={s.date}>
                    {DateTimeService.formDate(message.dispatchDateTime)}
                </div>
            )}
            {isSelf && !isChild && (
                <IoMdClose
                    className={s.delete_message}
                    onClick={() => {
                        MessageService.deleteMessageById(message.messageId)
                            .then((response) => response.data)
                            .then((data) => {
                                if (!deleteMessage) return;
                                deleteMessage({ messageId: data.messageId });
                            });
                        const socket = io(globalSocket);
                        socket.emit("delete_message", {
                            chatId: message.chatId,
                            userId: store.user.userId,
                            messageId: message.messageId,
                        });
                    }}
                />
            )}
        </div>
    );
});

Message.displayName = "Message";
export default Message;
