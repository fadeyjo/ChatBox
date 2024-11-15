import React, { useContext, useEffect, useRef, useState } from "react";
import s from "./ProfileInfo.module.css";
import IProfileInfo from "../../interfaces/IProps/IProfileInfo";
import { Context } from "../..";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import FriendshipService from "../../services/friendship-service";
import SubscribersPageOwnersService from "../../services/subscribersPageOwners-service";

const ProfileInfo: React.FC<IProfileInfo> = ({
    user,
    imageSrc,
    setImage,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { store } = useContext(Context);
    const [friendsAmount, setFriendsAmount] = useState(0);
    const [subscribersAmount, setSubscribersAmount] = useState(0);
    const [subscribesAmount, setSubscribesAmount] = useState(0);

    useEffect(() => {
        FriendshipService.getFriendshipsByUserId(store.user.userId)
            .then((response) => response)
            .then((data) => setFriendsAmount(data.data.friendships.length));

        SubscribersPageOwnersService.getSubscribersByUserId(store.user.userId)
            .then((response) => response)
            .then((data) =>
                setSubscribersAmount(data.data.subscribersPageOwners.length)
            );

        SubscribersPageOwnersService.getSubscribesByUserId(store.user.userId)
            .then((response) => response)
            .then((data) =>
                setSubscribesAmount(data.data.subscribersPageOwners.length)
            );
    }, [])

    return (
        <div className={s.profile_info}>
            <div
                className={classNames({
                    [s.profile_image]: user.userId === store.user.userId,
                    [s.profile_image_other]: user.userId !== store.user.userId,
                })}
                onClick={
                    user.userId === store.user.userId
                        ? () => fileInputRef.current?.click()
                        : () => {}
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
            <input
                className={s.file_input}
                type="file"
                accept=".jpg, .jpeg, .png"
                ref={fileInputRef}
                onChange={
                    user.userId === store.user.userId ? setImage : () => {}
                }
            />
        </div>
    );
};

export default observer(ProfileInfo)
