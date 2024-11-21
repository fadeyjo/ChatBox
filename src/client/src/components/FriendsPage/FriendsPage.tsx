import React, { useContext, useEffect, useState } from "react";
import s from "./FriendsPage.module.css";
import IUser from "../../interfaces/IResponses/IUser";
import FriendshipService from "../../services/friendship-service";
import UserService from "../../services/user-service";
import { UserCard } from "../UserCard/UserCard";
import { Context } from "../..";

export const FriendsPage: React.FC<{ userId: number }> = ({ userId }) => {
    const { store } = useContext(Context);

    const [friends, setFriends] = useState<IUser[]>([]);
    const [globalSearch, setGlobalSearch] = useState<IUser[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const [localSearch, setLocalSearch] = useState<IUser[]>([]);
    const [user, setUser] = useState<IUser>({} as IUser);

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

    const loadUser = async () => {
        setUser((await UserService.getUserById(userId)).data);
    };

    useEffect(() => {
        loadFriends();
        loadAllUsers();
        loadUser();
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
                        {userId === store.user.userId
                            ? "No one has been found among your friends:"
                            : `No one has been found among ${user.firstName} friends:`}
                    </div>
                ) : (
                    <div className={s.block}>
                        <div className={s.text}>Your friends:</div>
                        {localSearch.map((friend) => (
                            <UserCard key={friend.userId} user={friend} />
                        ))}
                    </div>
                )
            ) : friends.length === 0 ? (
                <div className={s.empty}>
                    {userId === store.user.userId
                        ? "You don't have any friends:"
                        : `${user.firstName} don't have any friends:`}
                </div>
            ) : (
                <div className={s.block}>
                    <div className={s.text}>
                        {userId === store.user.userId
                            ? "Your friends:"
                            : `${user.firstName} friends:`}
                    </div>
                    {friends.map((friend) => (
                        <UserCard key={friend.userId} user={friend} />
                    ))}
                </div>
            )}
            {inputValue !== "" && (
                <div className={s.block}>
                    <div className={s.text}>Global search:</div>
                    {globalSearch.length !== 0 ? (
                        globalSearch.map((userData) => (
                            <UserCard key={userData.userId} user={userData} />
                        ))
                    ) : (
                        <div className={s.no_one}>No one has been found</div>
                    )}
                </div>
            )}
        </div>
    );
};
