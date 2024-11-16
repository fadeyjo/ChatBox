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

const ProfilePage: React.FC<{ userId: number }> = ({ userId }) => {
    const { store } = useContext(Context);

    const isSelfPage = userId === store.user.userId;

    const [error, setError] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const [file, setFile] = useState<File>();
    const [isOpened, setIsOpened] = useState(false);
    const [posts, setPosts] = useState<IGetPost[]>([]);
    const [createPostIsOpened, setCreatePostIsOpened] = useState(false);
    const [user, setUser] = useState<IUser>({} as IUser);
    const [isFriend, setIsFriend] = useState(false);
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [isSubscribes, setIsSubscribes] = useState(false);
    const [repost, setRepost] = useState<IGetPost | null>(null);

    useEffect(() => {
        ProfileImageService.getProfileImage(userId)
            .then((response) => response.data)
            .then((data) => setImageSrc(data.src));
    }, [file]);

    const setStatus = async () => {
        if (isSelfPage) return;
        console.log(userId);
        const friendships = (
            await FriendshipService.getFriendshipsByUserId(userId)
        ).data.friendships;
        for (let i = 0; i < friendships.length; i++) {
            if (
                friendships[i].firstFriendId === store.user.userId ||
                friendships[i].secondFriendId === store.user.userId
            ) {
                setIsFriend(true);
                return;
            }
        }
        const subscribers = (
            await SubscribersPageOwnersService.getSubscribersByUserId(userId)
        ).data.subscribersPageOwners;
        for (let i = 0; i < subscribers.length; i++) {
            if (subscribers[i].subscriberId === store.user.userId) {
                setIsSubscribes(true);
                return;
            }
            if (subscribers[i].pageOwnerId === store.user.userId) {
                setIsSubscriber(true);
                return;
            }
        }
    };

    useEffect(() => {
        UserService.getUserById(userId)
            .then((response) => response.data)
            .then((data) => setUser(data));
        PostService.getPostsByUserId(userId)
            .then((response) => response.data)
            .then((data) =>
                setPosts(
                    data.posts.sort((first, second) => {
                        const dateFirst = new Date(first.publicationDateTime);
                        const dateSecond = new Date(second.publicationDateTime);
                        return dateSecond.getTime() - dateFirst.getTime();
                    })
                )
            );
        setStatus();
    }, []);

    const setImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            setError("Not files.");
            setIsOpened(true);
            return;
        }
        const file = files[0];
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
            setError(
                "Incorrect file format. Select jpg, jpeg or png format file."
            );
            setIsOpened(true);
            return;
        }
        const formData = new FormData();
        formData.append("image", file);
        await ProfileImageService.newProfileImage(formData);
        setFile(file);
    };

    return (
        <>
            <div className={s.profile}>
                <ProfileInfo
                    isSelfPage={isSelfPage}
                    userId={userId}
                    setImage={setImage}
                    imageSrc={imageSrc}
                    isFriend={isFriend}
                    isSubscriber={isSubscriber}
                    isSubscribes={isSubscribes}
                />
                {isSelfPage ? (
                    <FormButton
                        onClick={() => {
                            setCreatePostIsOpened(true);
                            setRepost(null);
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
                            imageSrc={imageSrc}
                            isChild={false}
                            post={post}
                            key={post.postId}
                            setPosts={setPosts}
                            setRepost={setRepost}
                            setCreatePostIsOpened={setCreatePostIsOpened}
                        />
                    ))}
                </div>
            )}

            <ModalWindow
                isOpened={isOpened}
                setIsOpened={setIsOpened}
                header="Error to set profile image"
            >
                <div className={s.error}>{error}</div>
            </ModalWindow>
            <ModalWindow
                isOpened={createPostIsOpened}
                setIsOpened={setCreatePostIsOpened}
                header="New post"
            >
                <NewPostForm
                    setIsOpened={setCreatePostIsOpened}
                    setPosts={setPosts}
                    repost={repost}
                    setRepost={setRepost}
                />
            </ModalWindow>
        </>
    );
};

export default observer(ProfilePage);
