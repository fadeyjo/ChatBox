import React, { useContext, useEffect, useRef, useState } from "react";
import s from "./Chat.module.css";
import { useNavigate, useParams } from "react-router-dom";
import IGetMessage from "../../interfaces/IResponses/IGetMessage";
import MessageService from "../../services/message-service";
import { Message } from "../Message/Message";
import { Context } from "../..";
import IUser from "../../interfaces/IResponses/IUser";
import ChatService from "../../services/chat-service";
import IGetChat from "../../interfaces/IResponses/IGetChat";
import UserService from "../../services/user-service";
import ProfileImageService from "../../services/profileImage-service";
import { IoMdSend } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import io from "socket.io-client";
import { globalSocket } from "../../globalSocket";

export const Chat: React.FC = () => {
    const { chatId } = useParams();

    const { store } = useContext(Context);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<IGetMessage[]>([]);
    const [user, setUser] = useState({} as IUser);
    const [image, setImage] = useState("");
    const [chat, setChat] = useState({} as IGetChat);
    const [input, setInput] = useState("");
    const [inDown, setInDown] = useState(true);
    const [resend, setResend] = useState<{
        content: string;
        childrenMessageId: number;
    } | null>(null);

    const navigate = useNavigate();

    const loadMessages = async () => {
        setMessages(
            (
                await MessageService.getMessagesByChatId(Number(chatId))
            ).data.messages.sort((first, second) => {
                const dateFirst = new Date(first.dispatchDateTime);
                const dateSecond = new Date(second.dispatchDateTime);
                return dateFirst.getTime() - dateSecond.getTime();
            })
        );
    };

    const loadChat = async () => {
        if (!chatId) return;
        const chatData = (await ChatService.getChatById(Number(chatId))).data;
        setChat(chatData);
        const userId =
            chatData.firstUserId === store.user.userId
                ? chatData.secondUserId
                : chatData.firstUserId;
        setUser((await UserService.getUserById(userId)).data);
        setImage((await ProfileImageService.getProfileImage(userId)).data.src);
        return chatData;
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
        loadMessages();
        const newSocket = io(globalSocket);
        newSocket.emit("subscribe_messages", {
            chatId: Number(chatId),
            userId: store.user.userId,
        });
        loadChat().then((response) => {
            newSocket.emit("subscribe_image", {
                userId:
                    response?.firstUserId === store.user.userId
                        ? response.secondUserId
                        : response?.firstUserId,
            });
        });
        newSocket.on("add_message", ({ message }: { message: IGetMessage }) => {
            setMessages((prev) => [...prev, message]);
        });
        newSocket.on("filter_messages", deleteMessage);
        newSocket.on("set_image", () => loadChat());
        return () => {
            newSocket.off("set_image");
            newSocket.off("filter_messages");
            newSocket.off("add_message");
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!inDown) return;
        const messagesContainer = messagesEndRef.current;

        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={s.chat_container}>
            <div className={s.header}>
                <div
                    onClick={() => navigate(`/profile/${user.userId}`)}
                    className={s.image}
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
                <div
                    className={s.fio}
                    onClick={() => navigate(`/profile/${user.userId}`)}
                >
                    {[user.lastName, user.firstName, user.patronymic].join(" ")}
                </div>
                <div className={s.back} onClick={() => navigate(-1)}>
                    Back
                </div>
            </div>
            <div
                ref={messagesEndRef}
                className={s.messages}
                onScroll={(event) => {
                    const container = event.target as HTMLDivElement;
                    const scrollTop = container.scrollTop;
                    const scrollHeight = container.scrollHeight;
                    const clientHeight = container.clientHeight;
                    if (scrollTop + clientHeight >= scrollHeight) {
                        setInDown(true);
                        return;
                    }
                    setInDown(false);
                }}
            >
                {messages.map((message) => (
                    <Message
                        key={message.messageId}
                        message={message}
                        isSelf={message.senderId === store.user.userId}
                        setResend={setResend}
                        isChild={false}
                        deleteMessage={deleteMessage}
                    />
                ))}
            </div>
            {resend && (
                <div className={s.resending}>
                    Resending: {resend.content}
                    <IoMdClose
                        className={s.delete_resending}
                        onClick={() => setResend(null)}
                    />
                </div>
            )}
            <div className={s.new_message_conteiner}>
                <textarea
                    value={input}
                    onChange={(event) => {
                        event.target.style.height = "auto";
                        event.target.style.height = `${event.target.scrollHeight}px`;
                        setInput(event.target.value);
                    }}
                    className={s.new_message}
                    placeholder="Type your message..."
                ></textarea>
                <IoMdSend
                    className={s.input}
                    onClick={() => {
                        if (input === "" || !chatId) return;
                        MessageService.newMessage(
                            input,
                            Number(chatId),
                            resend?.childrenMessageId
                        )
                            .then((response) => response.data)
                            .then((data) => {
                                setMessages((prev) => [...prev, data]);
                                setInput("");
                                setResend(null);
                                const socket = io(globalSocket);
                                socket.emit("new_message", {
                                    chatId: Number(chatId),
                                    userId: store.user.userId,
                                    message: {
                                        messageId: data.messageId,
                                        content: data.content,
                                        dispatchDateTime: data.dispatchDateTime,
                                        isChecked: data.isChecked,
                                        childrenMessageId:
                                            data.childrenMessageId,
                                        senderId: data.senderId,
                                        chatId: data.chatId,
                                    },
                                });
                            });
                    }}
                />
            </div>
        </div>
    );
};
