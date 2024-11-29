import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import s from "./Chat.module.css";
import { useParams } from "react-router-dom";
import IGetMessage from "../../interfaces/IResponses/IGetMessage";
import MessageService from "../../services/message-service";
import Message from "../Message/Message";
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
import { ChatHeader } from "../ChatHeader/ChatHeader";

export const Chat: React.FC = () => {
    const { chatId } = useParams();

    const { store } = useContext(Context);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<IGetMessage[]>([]);
    const [user, setUser] = useState({} as IUser);
    const [image, setImage] = useState("");
    const [chat, setChat] = useState({} as IGetChat);
    const [input, setInput] = useState("");
    const [resend, setResend] = useState<{
        content: string;
        childrenMessageId: number;
    } | null>(null);
    const [isOnline, setIsOnline] = useState(false);
    const [isLoading, setIsloading] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const setUnreadPosition = () => {
        if (messagesContainerRef.current) {
            const firstUnreadMessage = messages.find(
                (message) =>
                    !message.isChecked && message.senderId !== store.user.userId
            );

            if (firstUnreadMessage && isLoading) {
                const firstUnreadMessageElement = document.querySelector(
                    `[data-message-id="${firstUnreadMessage.messageId}"]`
                );

                if (firstUnreadMessageElement) {
                    messagesContainerRef.current.scrollTop =
                        firstUnreadMessageElement.getBoundingClientRect().top -
                        messagesContainerRef.current.getBoundingClientRect()
                            .top +
                        messagesContainerRef.current.scrollTop;
                }
            } else {
                messagesContainerRef.current.scrollTop =
                    messagesContainerRef.current.scrollHeight;
            }
        }
    };

    const loadMessages = async () => {
        const loadedMessages = (
            await MessageService.getMessagesByChatId(Number(chatId))
        ).data.messages.sort((first, second) => {
            const dateFirst = new Date(first.dispatchDateTime);
            const dateSecond = new Date(second.dispatchDateTime);
            return dateFirst.getTime() - dateSecond.getTime();
        });

        setMessages(loadedMessages);
        setUnreadPosition();
    };

    const sendMessage = useCallback(() => {
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
                        childrenMessageId: data.childrenMessageId,
                        senderId: data.senderId,
                        chatId: data.chatId,
                    },
                });
            });
        if (messagesContainerRef.current) {
            setTimeout(() => {
                messagesContainerRef.current!.scrollTop =
                    messagesContainerRef.current!.scrollHeight;
            }, 0);
        }
    }, [input, chatId, resend, store.user.userId]);

    const loadChat = async () => {
        if (!chatId) return;
        const chatData = (await ChatService.getChatById(Number(chatId))).data;
        setChat(chatData);
        const userId =
            chatData.firstUserId === store.user.userId
                ? chatData.secondUserId
                : chatData.firstUserId;
        setIsOnline((await UserService.getStatus(userId)).data.isOnline);
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

    const messageIsSelf = (messageId: number) => {
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].messageId !== messageId) continue;
            if (messages[i].senderId === store.user.userId) return true;
            return false;
        }
    };

    const observeMessages = () => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const messageId = Number(
                            entry.target.getAttribute("data-message-id")
                        );
                        const messageData = messages.find(
                            (msg) => msg.messageId === messageId
                        );
                        if (
                            messageId &&
                            messageData &&
                            !messageIsSelf(messageId) &&
                            !messageData.isChecked
                        ) {
                            MessageService.checkMessage(messageId);
                            setMessages((prev) =>
                                prev.map((msgData) => {
                                    if (msgData.messageId !== messageId)
                                        return msgData;
                                    msgData.isChecked = true;
                                    return msgData;
                                })
                            );
                            const socket = io(globalSocket);
                            socket.emit("reading_message", { messageId });
                            if (
                                messageId ===
                                messages[messages.length - 1].messageId
                            ) {
                                const socket = io(globalSocket);
                                socket.emit("add_unread_message_count", {
                                    chatId: Number(chatId),
                                });
                            }
                        }
                    }
                });
            },
            {
                threshold: 1.0,
            }
        );
        messageRefs.current.forEach((messageEl) => {
            if (messageEl) {
                observer.observe(messageEl);
            }
        });
    };

    const handleScroll = () => {
        if (!messagesContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } =
            messagesContainerRef.current;
        setIsAtBottom(scrollHeight - scrollTop === clientHeight);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        loadMessages();
        const newSocket = io(globalSocket);
        newSocket.emit("subscribe_messages", {
            chatId: Number(chatId),
            userId: store.user.userId,
        });
        loadChat().then((response) => {
            const userId =
                response?.firstUserId === store.user.userId
                    ? response.secondUserId
                    : response?.firstUserId;
            newSocket.emit("subscribe_online", { userId });
            newSocket.on(
                "set_status",
                ({ isOnline }: { isOnline: boolean }) => {
                    setIsOnline(isOnline);
                }
            );
            newSocket.emit("subscribe_image", {
                userId,
            });
        });
        newSocket.on("add_message", ({ message }: { message: IGetMessage }) => {
            setMessages((prev) => [...prev, message]);
        });
        newSocket.on("filter_messages", deleteMessage);
        newSocket.on("set_image", () => loadChat());
        return () => {
            newSocket.off("set_status");
            newSocket.off("set_image");
            newSocket.off("filter_messages");
            newSocket.off("add_message");
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0 && isLoading) {
            setUnreadPosition();
            setIsloading(false);
        }
        observeMessages();
        if (isAtBottom && messagesContainerRef.current)
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;

        if (messages.length > 0) observeMessages();
    }, [messages]);

    return (
        <div className={s.chat_container}>
            <ChatHeader user={user} image={image} isOnline={isOnline} />
            <div
                className={s.messages}
                ref={messagesContainerRef}
                onScroll={handleScroll}
            >
                {messages.map((message, index) => (
                    <Message
                        key={message.messageId}
                        message={message}
                        isSelf={message.senderId === store.user.userId}
                        setResend={setResend}
                        isChild={false}
                        deleteMessage={deleteMessage}
                        ref={(el) => (messageRefs.current[index] = el)}
                        setMessages={setMessages}
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
                    ref={inputRef}
                    value={input}
                    onChange={(event) => {
                        event.target.style.height = "auto";
                        event.target.style.height = `${event.target.scrollHeight}px`;
                        setInput(event.target.value);
                    }}
                    className={s.new_message}
                    placeholder="Type your message..."
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            sendMessage();
                        }
                    }}
                ></textarea>
                <IoMdSend className={s.input} onClick={sendMessage} />
            </div>
        </div>
    );
};
