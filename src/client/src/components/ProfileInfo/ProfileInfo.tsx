import React, { useContext, useEffect, useRef, useState } from "react";
import s from "./ProfileInfo.module.css";
import IProfileInfo from "../../interfaces/IProps/IProfileInfo";
import classNames from "classnames";
import FriendshipService from "../../services/friendship-service";
import SubscribersPageOwnersService from "../../services/subscribersPageOwners-service";
import IUser from "../../interfaces/IResponses/IUser";
import UserService from "../../services/user-service";

const ProfileInfo: React.FC<IProfileInfo> = ({
    userId,
    imageSrc,
    setImage,
    isSelfPage,
    isFriend,
    isSubscriber,
    isSubscribes,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [friendsAmount, setFriendsAmount] = useState(0);
    const [subscribersAmount, setSubscribersAmount] = useState(0);
    const [subscribesAmount, setSubscribesAmount] = useState(0);
    const [user, setUser] = useState({} as IUser);

    useEffect(() => {
        FriendshipService.getFriendshipsByUserId(userId)
            .then((response) => response)
            .then((data) => setFriendsAmount(data.data.friendships.length))
            .catch((error) => {});

        SubscribersPageOwnersService.getSubscribersByUserId(userId)
            .then((response) => response)
            .then((data) =>
                setSubscribersAmount(data.data.subscribersPageOwners.length)
            )
            .catch((error) => {});

        SubscribersPageOwnersService.getSubscribesByUserId(userId)
            .then((response) => response)
            .then((data) =>
                setSubscribesAmount(data.data.subscribersPageOwners.length)
            )
            .catch((error) => {});
    }, [isFriend, isSubscriber, isSubscribes]);

    useEffect(() => {
        UserService.getUserById(userId)
            .then((response) => response.data)
            .then((data) => setUser(data));
    }, []);

    return (
        <div className={s.profile_info}>
            <div
                className={classNames({
                    [s.profile_image]: isSelfPage,
                    [s.profile_image_other]: !isSelfPage,
                })}
                onClick={
                    isSelfPage ? () => fileInputRef.current?.click() : () => {}
                }
                style={{ backgroundImage: `url(${imageSrc})` }}
            ></div>
            <div className={s.fio_email}>
                <div className={s.fio}>
                    {[user.lastName, user.firstName, user.patronymic].join(" ")}
                </div>
                <div className={s.email}>@{user.nickname}</div>
                <div className={s.other_info}>
                    <div>{friendsAmount} friends</div>
                    <div>{subscribersAmount} subscribers</div>
                    <div>{subscribesAmount} subscribes</div>
                </div>
            </div>
            {isSelfPage ? (
                <input
                    className={s.file_input}
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    ref={fileInputRef}
                    onChange={setImage}
                />
            ) : null}
        </div>
    );
};

export default ProfileInfo;
