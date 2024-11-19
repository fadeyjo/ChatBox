import React, { useEffect, useState } from "react";
import s from "./FriendsPage.module.css";
import IUser from "../../interfaces/IResponses/IUser";
import FriendshipService from "../../services/friendship-service";
import UserService from "../../services/user-service";
import { UserCard } from "../UserCard/UserCard";

export const FriendsPage: React.FC<{ userId: number }> = ({ userId }) => {
    const [friends, setFriends] = useState<IUser[]>([]);
    const [globalSearch, setGlobalSearch] = useState<IUser[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const [localSearch, setLocalSearch] = useState<IUser[]>([]);

    const loadFriends = async () => {
        const friendshipsData = (
            await FriendshipService.getFriendshipsByUserId(userId)
        ).data.friendships;
        const friendsData: IUser[] = [];
        for (let i = 0; i < friendshipsData.length; i++) {
            if (friendshipsData[i].firstFriendId === userId) {
                friendsData.push(
                    (
                        await UserService.getUserById(
                            friendshipsData[i].secondFriendId
                        )
                    ).data
                );
                continue;
            }
            friendsData.push(
                (
                    await UserService.getUserById(
                        friendshipsData[i].firstFriendId
                    )
                ).data
            );
        }
        setFriends(friendsData);
    };

    const loadAllUsers = async () => {
        setAllUsers((await UserService.getAllUsers()).data.users);
    };

    useEffect(() => {
        loadFriends();
        loadAllUsers();
    }, []);

    useEffect(() => {
        setGlobalSearch([]);
        setLocalSearch([]);
        if (inputValue === "") {
            return;
        }
        if (inputValue[0] === "@") {
            for (let i = 0; i < allUsers.length; i++) {
                if (allUsers[i].nickname.includes(inputValue.slice(1))) {
                    setGlobalSearch((prev) => [...prev, allUsers[i]]);
                }
            }
            for (let i = 0; i < friends.length; i++) {
                if (friends[i].nickname.includes(inputValue.slice(1))) {
                    setLocalSearch((prev) => [...prev, friends[i]]);
                }
            }
            return;
        }
        for (let i = 0; i < allUsers.length; i++) {
            if (
                [
                    allUsers[i].lastName,
                    allUsers[i].firstName,
                    allUsers[i].patronymic,
                ]
                    .join("")
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
            ) {
                setGlobalSearch((prev) => [...prev, allUsers[i]]);
            }
        }
        for (let i = 0; i < friends.length; i++) {
            if (
                [
                    friends[i].lastName,
                    friends[i].firstName,
                    friends[i].patronymic,
                ]
                    .join("")
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
            ) {
                setLocalSearch((prev) => [...prev, friends[i]]);
            }
        }
    }, [inputValue]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search a user"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                className={s.input_search}
            />
            {inputValue !== "" ? (
                localSearch.length === 0 ? (
                    <div className={s.empty}>
                        No one has been found among your friends
                    </div>
                ) : (
                    <div className={s.block}>
                        <div className={s.text}>Your friends:</div>
                        {localSearch.map((friend) => (
                            <UserCard user={friend} />
                        ))}
                    </div>
                )
            ) : friends.length === 0 ? (
                <div className={s.empty}>You don't have any friends</div>
            ) : (
                <div className={s.block}>
                    <div className={s.text}>Your friends:</div>
                    {friends.map((friend) => (
                        <UserCard user={friend} />
                    ))}
                </div>
            )}
            {inputValue !== "" && (
                <div className={s.block}>
                    <div className={s.text}>Global search:</div>
                    {globalSearch.length !== 0 ? (
                        globalSearch.map((userData) => (
                            <UserCard user={userData} />
                        ))
                    ) : (
                        <div className={s.no_one}>No one has been found</div>
                    )}
                </div>
            )}
        </div>
    );
};
