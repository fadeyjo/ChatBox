import React, { useContext, useEffect, useState } from "react";
import s from "./SubscribesPage.module.css";
import IUser from "../../interfaces/IResponses/IUser";
import UserService from "../../services/user-service";
import SubscribersPageOwnersService from "../../services/subscribersPageOwners-service";
import { UserCard } from "../UserCard/UserCard";
import { Context } from "../..";

export const SubscribesPage: React.FC<{ userId: number }> = ({ userId }) => {
    const { store } = useContext(Context);

    const [subscribes, setSubscribes] = useState<IUser[]>([]);
    const [globalSearch, setGlobalSearch] = useState<IUser[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const [localSearch, setLocalSearch] = useState<IUser[]>([]);
    const [user, setUser] = useState<IUser>({} as IUser);

    const loadSubscribes = async () => {
        const subscribesData = (
            await SubscribersPageOwnersService.getSubscribesByUserId(userId)
        ).data.subscribersPageOwners;
        const subscribersDataUsers: IUser[] = [];
        for (let i = 0; i < subscribesData.length; i++) {
            subscribersDataUsers.push(
                (await UserService.getUserById(subscribesData[i].pageOwnerId))
                    .data
            );
        }
        setSubscribes(subscribersDataUsers);
    };

    const loadAllUsers = async () => {
        setAllUsers((await UserService.getAllUsers()).data.users);
    };

    const loadUser = async () => {
        setUser((await UserService.getUserById(userId)).data);
    };

    useEffect(() => {
        loadSubscribes();
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
            for (let i = 0; i < subscribes.length; i++) {
                if (subscribes[i].nickname.includes(inputValue.slice(1))) {
                    setLocalSearch((prev) => [...prev, subscribes[i]]);
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
        for (let i = 0; i < subscribes.length; i++) {
            if (
                [
                    subscribes[i].lastName,
                    subscribes[i].firstName,
                    subscribes[i].patronymic,
                ]
                    .join("")
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
            ) {
                setLocalSearch((prev) => [...prev, subscribes[i]]);
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
                            ? "No one has been found among your subscribes:"
                            : `No one has been found among ${user.firstName} subscribes:`}
                    </div>
                ) : (
                    <div className={s.block}>
                        <div className={s.text}>
                            {userId === store.user.userId
                                ? "Your friends:"
                                : `${user.firstName} subscribes:`}
                        </div>
                        {localSearch.map((subscriber) => (
                            <UserCard
                                key={subscriber.userId}
                                user={subscriber}
                            />
                        ))}
                    </div>
                )
            ) : subscribes.length === 0 ? (
                <div className={s.empty}>
                    {userId === store.user.userId
                        ? "You don't have any subscribes:"
                        : `${user.firstName} don't have any subscribes:`}
                </div>
            ) : (
                <div className={s.block}>
                    <div className={s.text}>Your subscribes:</div>
                    {subscribes.map((subscriber) => (
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
