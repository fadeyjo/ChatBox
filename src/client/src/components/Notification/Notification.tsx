import React, { useContext, useEffect, useState } from "react";
import s from "./Notification.module.css";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import ChatService from "../../services/chat-service";
import io from "socket.io-client";
import { globalSocket } from "../../globalSocket";
import IGetMessage from "../../interfaces/IResponses/IGetMessage";
import UserService from "../../services/user-service";
import ProfileImageService from "../../services/profileImage-service";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const Notification: React.FC = observer(() => {
    const { store } = useContext(Context);

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState<IGetMessage | null>(null);
    const [fio, setFio] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);

    const navigate = useNavigate();

    const loadChats = async () => {
        const chats = (await ChatService.getChatsByUser()).data.chats;
        const sockets = chats.map(() => io(globalSocket));
        sockets.forEach((socket, index) => {
            socket.emit("subscribe_messages", {
                chatId: chats[index].chatId,
                userId: store.user.userId,
            });
            socket.on(
                "add_message",
                ({ message }: { message: IGetMessage }) => {
                    UserService.getUserById(message.senderId)
                        .then((response) => response.data)
                        .then((author) => {
                            ProfileImageService.getProfileImage(
                                message.senderId
                            )
                                .then((responseImage) => responseImage.data)
                                .then((dataImage) => {
                                    setFio(
                                        [
                                            author.lastName,
                                            author.firstName,
                                            author.patronymic,
                                        ].join(" ")
                                    );
                                    setImage(dataImage.src);
                                    setMessage(message);
                                    setShow(true);
                                    setTimeout(() => {
                                        handleClose();
                                    }, 5000);
                                });
                        });
                }
            );
        });
    };

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        loadChats();
    }, []);

    useEffect(() => {
        if (!show)
            setTimeout(() => {
                setMessage(null);
                setFio(null);
                setImage(null);
            }, 1000);
    }, [show]);

    return (
        <div
            className={classNames(s.notification, {
                [s.show]: show,
                [s.hide]: !show,
            })}
            onClick={() => {
                navigate(`/chats/${message?.chatId}`);
                handleClose();
            }}
        >
            <div className={s.notification_container}>
                <div
                    className={s.image}
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
                <div className={s.container}>
                    <div className={s.fio}>{fio}</div>
                    <div className={s.content}>{message?.content}</div>
                </div>
                <IoClose className={s.close} onClick={() => handleClose()} />
                <div />
            </div>
        </div>
    );
});
