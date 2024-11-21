import React, { useContext, useEffect, useState } from "react";
import s from "./ChatsPage.module.css";
import { Context } from "../..";
import IGetChat from "../../interfaces/IResponses/IGetChat";
import ChatService from "../../services/chat-service";
import ChatCard from "../ChatCard/ChatCard";

export const ChatsPage: React.FC = () => {
    const { store } = useContext(Context);

    const [chats, setChats] = useState<IGetChat[]>([]);

    const loadChats = async () => {
        setChats((await ChatService.getChatsByUser()).data.chats);
    };

    useEffect(() => {
        loadChats();
    }, []);

    return (
        <div>
            {chats.map((chat) => (
                <ChatCard
                    userId={
                        store.user.userId === chat.firstUserId
                            ? chat.secondUserId
                            : chat.firstUserId
                    }
                    chatId={chat.chatId}
                    key={chat.chatId}
                />
            ))}
        </div>
    );
};
