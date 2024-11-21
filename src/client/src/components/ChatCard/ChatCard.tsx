import React, { useContext, useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { globalSocket } from "../../globalSocket";

const ChatCard: React.FC<{ userId: number; chatId: number }> = ({
    userId,
    chatId,
}) => {
    const { store } = useContext(Context);

    const [user, setUser] = useState({} as IUser);
    const [image, setImage] = useState("");
    const [messages, setMessages] = useState<IGetMessage[]>([]);

    const navigate = useNavigate();

    const loadUser = async () => {
        setUser((await UserService.getUserById(userId)).data);
    };

    const loadAvatar = async () => {
        setImage((await ProfileImageService.getProfileImage(userId)).data.src);
    };

    const loadMessages = async () => {
        setMessages(
            (
                await MessageService.getMessagesByChatId(chatId)
            ).data.messages.sort((first, second) => {
                const dateFirst = new Date(first.dispatchDateTime);
                const dateSecond = new Date(second.dispatchDateTime);
                return dateSecond.getTime() - dateFirst.getTime();
            })
        );
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

    useEffect(() => {
        loadUser();
        loadAvatar();
        loadMessages();
        const newSocket = io(globalSocket);
        newSocket.emit("subscribe_messages", {
            chatId: Number(chatId),
            userId: store.user.userId,
        });
        newSocket.emit("subscribe_image", {
            userId,
        });
        newSocket.on("add_message", ({ message }: { message: IGetMessage }) => {
            setMessages((prev) => [message, ...prev]);
        });
        newSocket.on("filter_messages", deleteMessage);
        newSocket.on("set_image", () => loadAvatar());
        return () => {
            newSocket.off("set_image");
            newSocket.off("add_message");
            newSocket.off("filter_messages");
            newSocket.disconnect();
        };
    }, []);

    if (messages.length === 0) return null;

    return (
        <div
            className={s.container}
            onClick={() => {
                console.log(chatId);
                navigate(`/chats/${chatId}`);
            }}
        >
            <div
                className={s.avatar}
                style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div className={s.fio}>
                <div className={s.fio_content}>
                    {[user.lastName, user.firstName, user.patronymic].join(" ")}
                </div>
                <div className={s.content}>
                    {messages.length !== 0
                        ? `${
                              messages[0].senderId === store.user.userId
                                  ? "You: "
                                  : "Companion: "
                          }` + messages[0].content
                        : null}
                </div>
            </div>
            <div className={s.time}>
                {messages.length !== 0
                    ? DateTimeService.formDate(messages[0].dispatchDateTime)
                    : null}
            </div>
        </div>
    );
};

export default observer(ChatCard);
