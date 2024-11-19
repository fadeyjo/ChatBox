import React, { useEffect, useState } from "react";
import s from "./SubscribesPage.module.css";
import IUser from "../../interfaces/IResponses/IUser";
import UserService from "../../services/user-service";
import SubscribersPageOwnersService from "../../services/subscribersPageOwners-service";
import { UserCard } from "../UserCard/UserCard";

export const SubscribesPage: React.FC<{ userId: number }> = ({ userId }) => {
    const [subscribes, setSubscribes] = useState<IUser[]>([]);
    const [globalSearch, setGlobalSearch] = useState<IUser[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const [localSearch, setLocalSearch] = useState<IUser[]>([]);

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

    useEffect(() => {
        loadSubscribes();
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
                        No one has been found among your subscribes
                    </div>
                ) : (
                    <div className={s.block}>
                        <div className={s.text}>Your subscribes:</div>
                        {localSearch.map((subscriber) => (
                            <UserCard user={subscriber} />
                        ))}
                    </div>
                )
            ) : subscribes.length === 0 ? (
                <div className={s.empty}>You don't have any subscribes</div>
            ) : (
                <div className={s.block}>
                    <div className={s.text}>Your subscribes:</div>
                    {subscribes.map((subscriber) => (
                        <UserCard user={subscriber} />
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
