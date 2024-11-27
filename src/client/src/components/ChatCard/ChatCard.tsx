import React, { Dispatch, useContext, useEffect, useState } from "react";
import s from "./ChatCard.module.css";
import IGetChat from "../../interfaces/IResponses/IGetChat";
import IUser from "../../interfaces/IResponses/IUser";
import UserService from "../../services/user-service";
import ProfileImageService from "../../services/profileImage-service";
import IGetMessage from "../../interfaces/IResponses/IGetMessage";
import MessageService from "../../services/message-service";
import DateTimeService from "../../services/dateTime-service";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { useAsyncError, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { globalSocket } from "../../globalSocket";
import { GrStatusGoodSmall } from "react-icons/gr";
import { TbPointFilled } from "react-icons/tb";
import classNames from "classnames";

const ChatCard: React.FC<{
    userId: number;
    chatId: number;
    setChats: Dispatch<React.SetStateAction<IGetChat[]>>;
}> = ({ userId, chatId, setChats }) => {
    const { store } = useContext(Context);

    const [user, setUser] = useState({} as IUser);
    const [image, setImage] = useState("");
    const [messages, setMessages] = useState<IGetMessage[]>([]);
    const [isOnline, setIsOnline] = useState(false);
    const [unreadAmount, setUnreadAmount] = useState(0);

    const navigate = useNavigate();

    const loadUser = async () => {
        setUser((await UserService.getUserById(userId)).data);
    };

    const loadAvatar = async () => {
        setImage((await ProfileImageService.getProfileImage(userId)).data.src);
    };

    const loadMessages = async () => {
        const messagesData = (
            await MessageService.getMessagesByChatId(chatId)
        ).data.messages.sort((first, second) => {
            const dateFirst = new Date(first.dispatchDateTime);
            const dateSecond = new Date(second.dispatchDateTime);
            return dateSecond.getTime() - dateFirst.getTime();
        });
        setUnreadAmount(
            messagesData.filter(
                (messageData) =>
                    messageData.senderId !== store.user.userId &&
                    !messageData.isChecked
            ).length
        );
        setMessages(messagesData);
    };

    const deleteMessage = ({ messageId }: { messageId: number }) => {
        setMessages((prev) => {
            const messagesToDelete = new Set<number>();
            const collectMessagesToDelete = (id: number) => {
                messagesToDelete.add(id);
                prev.forEach((message) => {
                    if (message.childrenMessageId === id) {
                        collectMessagesToDelete(message.messageId);
                    }
                });
            };

            collectMessagesToDelete(messageId);

            return prev.filter(
                (message) => !messagesToDelete.has(message.messageId)
            );
        });
    };

    const loadIsOnline = async () => {
        setIsOnline((await UserService.getStatus(userId)).data.isOnline);
    };

    useEffect(() => {
        loadUser();
        loadAvatar();
        loadMessages();
        loadIsOnline();
        const newSocket = io(globalSocket);
        newSocket.emit("subscribe_messages", {
            chatId: Number(chatId),
            userId: store.user.userId,
        });
        newSocket.emit("subscribe_image", {
            userId,
        });
        newSocket.emit("subscribe_online", { userId });
        newSocket.on("set_status", ({ isOnline }: { isOnline: boolean }) => {
            setIsOnline(isOnline);
        });
        newSocket.on("add_message", ({ message }: { message: IGetMessage }) => {
            if (message.senderId !== store.user.userId) {
                setChats((prev) => {
                    let chatData: IGetChat | null = null;
                    for (let i = 0; i < prev.length; i++) {
                        if (message.chatId !== prev[i].chatId) continue;
                        chatData = prev[i];
                        break;
                    }
                    if (!chatData) return prev;
                    return [
                        chatData,
                        ...prev.filter(
                            (chatFilter) => chatFilter.chatId !== message.chatId
                        ),
                    ];
                });
                setUnreadAmount((prev) => prev + 1);
            }
            setMessages((prev) => [message, ...prev]);
        });
        newSocket.on("filter_messages", deleteMessage);
        newSocket.on("set_image", () => loadAvatar());
        return () => {
            newSocket.off("set_status");
            newSocket.off("set_image");
            newSocket.off("add_message");
            newSocket.off("filter_messages");
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (
            messages.length !== 0 &&
            messages[0].senderId === store.user.userId &&
            !messages[0].isChecked
        ) {
            const socket = io(globalSocket);
            socket.emit("subscribe_chat_read", { chatId });
            socket.on("set_undread_message_count", () => {
                console.log("daaaaaaaaaaaaaaaaaaa")
                setMessages((prev) =>
                    prev.map((messageData, index) => {
                        if (index !== 0) return messageData;
                        messageData.isChecked = true;
                        return messageData;
                    })
                );
                messages[0].isChecked = true;
            });
            return () => {
                socket.off("set_undread_message_count");
                socket.disconnect();
            };
        }
    }, [messages]);

    if (messages.length === 0) return null;

    return (
        <div
            className={classNames(s.container, {
                [s.unself_unread]: unreadAmount !== 0,
            })}
            onClick={() => {
                navigate(`/chats/${chatId}`);
            }}
        >
            <div
                className={s.avatar}
                style={{ backgroundImage: `url(${image})` }}
            >
                {isOnline && <GrStatusGoodSmall className={s.online} />}
            </div>
            <div className={s.fio}>
                <div className={s.fio_content}>
                    {[user.lastName, user.firstName, user.patronymic].join(" ")}
                </div>
                <div className={s.content}>
                    {`${
                        messages[0].senderId === store.user.userId
                            ? "You: "
                            : "Companion: "
                    }` + messages[0].content}
                </div>
            </div>
            <div className={s.time}>
                {DateTimeService.formDate(messages[0].dispatchDateTime)}
            </div>
            {messages[0].senderId === store.user.userId &&
                !messages[0].isChecked && (
                    <TbPointFilled className={s.self_unread} />
                )}
            {unreadAmount !== 0 && (
                <div className={s.self_unread}>{unreadAmount}</div>
            )}
        </div>
    );
};

export default observer(ChatCard);
