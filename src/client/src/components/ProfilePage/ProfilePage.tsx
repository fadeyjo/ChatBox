import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import s from "./ProfilePage.module.css";
import ProfileImageService from "../../services/profileImage-service";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { ModalWindow } from "../ModalWindow/ModalWindow";
import { FormButton } from "../UI/FormButton/FormButton";
import PostService from "../../services/post-service";
import IGetPost from "../../interfaces/IResponses/IGetPost";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import Post from "../Post/Post";
import { NewPostForm } from "../NewPostForm/NewPostForm";
import IUser from "../../interfaces/IResponses/IUser";
import UserService from "../../services/user-service";
import FriendshipService from "../../services/friendship-service";
import SubscribersPageOwnersService from "../../services/subscribersPageOwners-service";
import { globalSocket } from "../../globalSocket";
import io from "socket.io-client";

const ProfilePage: React.FC<{ userId: number }> = ({ userId }) => {
    const { store } = useContext(Context);

    const isSelfPage = userId === store.user.userId;

    const [user, setUser] = useState<IUser>({} as IUser);
    const [socket, setSocket] = useState<any>(null);
    const [friendsAmount, setFriendsAmount] = useState(0);
    const [subscribersAmount, setSubscribersAmount] = useState(0);
    const [subscribesAmount, setSubscribesAmount] = useState(0);
    const [posts, setPosts] = useState<IGetPost[]>([]);
    const [createPostFormIsOpened, setCreatePostFormIsOpened] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [isSubscribes, setIsSubscribes] = useState(false);
    const [repost, setRepost] = useState<IGetPost | null>(null);

    const setRelationships = async () => {
        setFriendsAmount(
            await (
                await FriendshipService.getFriendshipsByUserId(userId)
            ).data.friendships.length
        );

        setSubscribersAmount(
            (await SubscribersPageOwnersService.getSubscribersByUserId(userId))
                .data.subscribersPageOwners.length
        );

        setSubscribesAmount(
            (await SubscribersPageOwnersService.getSubscribesByUserId(userId))
                .data.subscribersPageOwners.length
        );
    };

    const loadPosts = async () => {
        setPosts(
            (await PostService.getPostsByUserId(userId)).data.posts.sort(
                (first, second) => {
                    const dateFirst = new Date(first.publicationDateTime);
                    const dateSecond = new Date(second.publicationDateTime);
                    return dateSecond.getTime() - dateFirst.getTime();
                }
            )
        );
    };

    const setSelfRelationship = async () => {
        if (isSelfPage) return;
        const friendshipsByUserId = (
            await FriendshipService.getFriendshipsByUserId(userId)
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
            await SubscribersPageOwnersService.getSubscribersByUserId(userId)
        ).data.subscribersPageOwners;
        for (let i = 0; i < subscribersByUserId.length; i++) {
            if (subscribersByUserId[i].subscriberId === store.user.userId) {
                setIsSubscribes(true);
                return;
            }
        }
        const subscribesByUserId = (
            await SubscribersPageOwnersService.getSubscribesByUserId(userId)
        ).data.subscribersPageOwners;
        for (let i = 0; i < subscribesByUserId.length; i++) {
            if (subscribesByUserId[i].pageOwnerId === store.user.userId) {
                setIsSubscriber(true);
                return;
            }
        }
    };

    useEffect(() => {
        setSelfRelationship();
        setRelationships();
        loadPosts();
        UserService.getUserById(userId)
            .then((response) => response.data)
            .then((data) => setUser(data));
        const newSocket = io(globalSocket);
        setSocket(newSocket);
        newSocket.emit("subscribe_profile", {
            userId,
            subscriberId: store.user.userId,
        });
        newSocket.on("receive_self_relationship", () => setSelfRelationship());
        newSocket.on("receive_relationship", () => setRelationships());
        newSocket.on("receive_posts", () => loadPosts()); ///!!!!!!
        return () => {
            newSocket.off("receive_self_relationship");
            newSocket.off("receive_posts");
            newSocket.off("receive_profile_image");
            newSocket.off("receive_relationship");
            newSocket.disconnect();
        };
    }, [userId]);

    return (
        <>
            <div className={s.profile}>
                <ProfileInfo
                    userId={userId}
                    lastName={user.lastName}
                    firstName={user.firstName}
                    patronymic={user.patronymic}
                    friendsAmount={friendsAmount}
                    subscribersAmount={subscribersAmount}
                    subscribesAmount={subscribesAmount}
                    isSelfPage={isSelfPage}
                    socket={socket}
                    nickname={user.nickname}
                />
                {isSelfPage ? (
                    <FormButton
                        onClick={() => {
                            setCreatePostFormIsOpened(true);
                        }}
                        className={s.create_post_button}
                        type="button"
                    >
                        Create post
                    </FormButton>
                ) : isFriend ? (
                    <FormButton
                        onClick={async () => {
                            await FriendshipService.deleteFriend(userId);
                            await SubscribersPageOwnersService.newSubscribersPageOwners(
                                userId,
                                store.user.userId
                            );
                            setIsFriend(false);
                            setIsSubscriber(true);
                            if (socket) {
                                socket.emit("change_relationship", {
                                    userId,
                                });
                                socket.emit("change_self_relationship", {
                                    userId,
                                    selfUserId: store.user.userId,
                                });
                            }
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
                                userId,
                                store.user.userId
                            );
                            await FriendshipService.newFriendShip(userId);
                            setIsFriend(true);
                            setIsSubscriber(false);
                            if (socket) {
                                socket.emit("change_relationship", {
                                    userId,
                                });
                                socket.emit("change_self_relationship", {
                                    userId,
                                    selfUserId: store.user.userId,
                                });
                            }
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
                                userId
                            );
                            setIsSubscribes(false);
                            if (socket) {
                                socket.emit("change_relationship", {
                                    userId,
                                });
                                socket.emit("change_self_relationship", {
                                    userId,
                                    selfUserId: store.user.userId,
                                });
                            }
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
                                userId
                            );
                            setIsSubscribes(true);
                            if (socket) {
                                socket.emit("change_relationship", {
                                    userId,
                                });
                                socket.emit("change_self_relationship", {
                                    userId,
                                    selfUserId: store.user.userId,
                                });
                            }
                        }}
                        className={s.create_post_button}
                        type="button"
                    >
                        Subscribe
                    </FormButton>
                )}
            </div>
            {posts.length !== 0 && (
                <div className={s.posts}>
                    {posts.map((post) => (
                        <Post
                            isChild={false}
                            post={post}
                            key={post.postId}
                            setCreatePostFormIsOpened={
                                setCreatePostFormIsOpened
                            }
                            setRepost={setRepost}
                            setPosts={setPosts}
                        />
                    ))}
                </div>
            )}
            <ModalWindow
                isOpened={createPostFormIsOpened}
                setIsOpened={setCreatePostFormIsOpened}
                header="New post"
            >
                <NewPostForm
                    setCreatePostFormIsOpened={setCreatePostFormIsOpened}
                    setPosts={setPosts}
                    repost={repost}
                    setRepost={setRepost}
                />
            </ModalWindow>
        </>
    );
};

export default observer(ProfilePage);
