import React, { useContext, useEffect, useState } from "react";
import s from "./UserCard.module.css";
import IUser from "../../interfaces/IResponses/IUser";
import ProfileImageService from "../../services/profileImage-service";
import { Context } from "../..";
import FriendshipService from "../../services/friendship-service";
import SubscribersPageOwnersService from "../../services/subscribersPageOwners-service";
import { FormButton } from "../UI/FormButton/FormButton";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { globalSocket } from "../../globalSocket";
import ChatService from "../../services/chat-service";
import UserService from "../../services/user-service";
import { GrStatusGoodSmall } from "react-icons/gr";

export const UserCard: React.FC<{ user: IUser }> = ({ user }) => {
    const { store } = useContext(Context);

    const isSelf = user.userId === store.user.userId;

    const [image, setImage] = useState("");
    const [isFriend, setIsFriend] = useState(false);
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [isSubscribes, setIsSubscribes] = useState(false);
    const [isOnline, setIsOnline] = useState(false);

    const navigate = useNavigate();

    const redirectToProfile = () => {
        navigate(`/profile/${user.userId}`);
    };

    const setSelfRelationship = async () => {
        if (isSelf) return;
        const friendshipsByUserId = (
            await FriendshipService.getFriendshipsByUserId(user.userId)
        ).data.friendships;
        for (let i = 0; i < friendshipsByUserId.length; i++) {
            if (
                friendshipsByUserId[i].firstFriendId === store.user.userId ||
                friendshipsByUserId[i].secondFriendId === store.user.userId
            ) {
                setIsFriend(true);
                return;
            }
        }
        const subscribersByUserId = (
            await SubscribersPageOwnersService.getSubscribersByUserId(
                user.userId
            )
        ).data.subscribersPageOwners;
        for (let i = 0; i < subscribersByUserId.length; i++) {
            if (subscribersByUserId[i].subscriberId === store.user.userId) {
                setIsSubscribes(true);
                return;
            }
        }
        const subscribesByUserId = (
            await SubscribersPageOwnersService.getSubscribesByUserId(
                user.userId
            )
        ).data.subscribersPageOwners;
        for (let i = 0; i < subscribesByUserId.length; i++) {
            if (subscribesByUserId[i].pageOwnerId === store.user.userId) {
                setIsSubscriber(true);
                return;
            }
        }
    };

    const loadImage = async () => {
        setImage(
            (await ProfileImageService.getProfileImage(user.userId)).data.src
        );
    };

    const loadIsOnline = async () => {
        setIsOnline((await UserService.getStatus(user.userId)).data.isOnline);
    };

    useEffect(() => {
        setSelfRelationship();
        loadImage();
        loadIsOnline();
        const newSocket = io(globalSocket);
        newSocket.emit("subscribe_image", {
            userId: user.userId,
        });
        newSocket.emit("subscribe_online", { userId: user.userId });
        newSocket.on("set_status", ({ isOnline }: { isOnline: boolean }) => {
            setIsOnline(isOnline);
        });
        newSocket.on("set_image", () => loadImage());
        return () => {
            newSocket.off("set_status");
            newSocket.off("set_image");
            newSocket.disconnect();
        };
    });

    return (
        <div className={s.container}>
            <div
                onClick={redirectToProfile}
                className={s.image}
                style={{ backgroundImage: `url(${image})` }}
            >
                {(isOnline) && (
                    <GrStatusGoodSmall className={s.online} />
                )}
            </div>
            <div className={s.user_info}>
                <div className={s.fio}>
                    {[user.lastName, user.firstName, user.patronymic].join(" ")}
                </div>
                <div className={s.nick}>@{user.nickname}</div>
                {!isSelf && (
                    <div
                        className={s.write_mes}
                        onClick={async () => {
                            const chats = (await ChatService.getChatsByUser())
                                .data.chats;
                            let chatId = 0;
                            let isExists = false;
                            for (let i = 0; i < chats.length; i++) {
                                if (
                                    chats[i].firstUserId === user.userId ||
                                    chats[i].secondUserId === user.userId
                                ) {
                                    chatId = chats[i].chatId;
                                    isExists = true;
                                    break;
                                }
                            }
                            if (!isExists) {
                                chatId = (
                                    await ChatService.newChat(user.userId)
                                ).data.chatId;
                            }
                            navigate(`/chats/${chatId}`);
                        }}
                    >
                        Send message
                    </div>
                )}
            </div>
            {isSelf ? (
                <div className={s.you}>It's you!!!</div>
            ) : isFriend ? (
                <FormButton
                    onClick={async () => {
                        await FriendshipService.deleteFriend(user.userId);
                        await SubscribersPageOwnersService.newSubscribersPageOwners(
                            user.userId,
                            store.user.userId
                        );
                        setIsFriend(false);
                        setIsSubscriber(true);
                    }}
                    className={s.create_post_button}
                    type="button"
                >
                    Delete friend
                </FormButton>
            ) : isSubscriber ? (
                <FormButton
                    onClick={async () => {
                        await SubscribersPageOwnersService.deleteSubscribersPageOwners(
                            user.userId,
                            store.user.userId
                        );
                        await FriendshipService.newFriendShip(user.userId);
                        setIsFriend(true);
                        setIsSubscriber(false);
                    }}
                    className={s.create_post_button}
                    type="button"
                >
                    Add friend
                </FormButton>
            ) : isSubscribes ? (
                <FormButton
                    onClick={async () => {
                        await SubscribersPageOwnersService.deleteSubscribersPageOwners(
                            store.user.userId,
                            user.userId
                        );
                        setIsSubscribes(false);
                    }}
                    className={s.create_post_button}
                    type="button"
                >
                    Unsubscribe
                </FormButton>
            ) : (
                <FormButton
                    onClick={async () => {
                        await SubscribersPageOwnersService.newSubscribersPageOwners(
                            store.user.userId,
                            user.userId
                        );
                        setIsSubscribes(true);
                    }}
                    className={s.create_post_button}
                    type="button"
                >
                    Subscribe
                </FormButton>
            )}
        </div>
    );
};
