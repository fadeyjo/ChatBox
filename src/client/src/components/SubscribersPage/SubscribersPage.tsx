import React, { useContext, useEffect, useState } from "react";
import s from "./SubscribersPage.module.css";
import IUser from "../../interfaces/IResponses/IUser";
import UserService from "../../services/user-service";
import { UserCard } from "../UserCard/UserCard";
import SubscribersPageOwnersService from "../../services/subscribersPageOwners-service";
import { Context } from "../..";

export const SubscribersPage: React.FC<{ userId: number }> = ({ userId }) => {
    const { store } = useContext(Context);

    const [subscribers, setSubscribers] = useState<IUser[]>([]);
    const [globalSearch, setGlobalSearch] = useState<IUser[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const [localSearch, setLocalSearch] = useState<IUser[]>([]);
    const [user, setUser] = useState<IUser>({} as IUser);

    const loadSubscribers = async () => {
        const subscribersData = (
            await SubscribersPageOwnersService.getSubscribersByUserId(userId)
        ).data.subscribersPageOwners;
        const subscribersDataUsers: IUser[] = [];
        for (let i = 0; i < subscribersData.length; i++) {
            subscribersDataUsers.push(
                (await UserService.getUserById(subscribersData[i].subscriberId))
                    .data
            );
        }
        setSubscribers(subscribersDataUsers);
    };

    const loadAllUsers = async () => {
        setAllUsers((await UserService.getAllUsers()).data.users);
    };

    const loadUser = async () => {
        setUser((await UserService.getUserById(userId)).data);
    };

    useEffect(() => {
        loadSubscribers();
        loadAllUsers();
        loadUser()
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
            for (let i = 0; i < subscribers.length; i++) {
                if (subscribers[i].nickname.includes(inputValue.slice(1))) {
                    setLocalSearch((prev) => [...prev, subscribers[i]]);
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
        for (let i = 0; i < subscribers.length; i++) {
            if (
                [
                    subscribers[i].lastName,
                    subscribers[i].firstName,
                    subscribers[i].patronymic,
                ]
                    .join("")
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
            ) {
                setLocalSearch((prev) => [...prev, subscribers[i]]);
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
                            ? "No one has been found among your subscribers:"
                            : `No one has been found among ${user.firstName} subscribers:`}
                    </div>
                ) : (
                    <div className={s.block}>
                        <div className={s.text}>
                            {userId === store.user.userId
                                ? "Your friends:"
                                : `${user.firstName} subscribers:`}
                        </div>
                        {localSearch.map((subscriber) => (
                            <UserCard
                                key={subscriber.userId}
                                user={subscriber}
                            />
                        ))}
                    </div>
                )
            ) : subscribers.length === 0 ? (
                <div className={s.empty}>
                    {userId === store.user.userId
                        ? "You don't have any subscribers:"
                        : `${user.firstName} don't have any subscribers:`}
                </div>
            ) : (
                <div className={s.block}>
                    <div className={s.text}>Your subscribers:</div>
                    {subscribers.map((subscriber) => (
                        <UserCard key={subscriber.userId} user={subscriber} />
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
