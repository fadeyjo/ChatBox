import React from "react";
import s from "./ChatHeader.module.css";
import { GrStatusGoodSmall } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import IUser from "../../interfaces/IResponses/IUser";

export const ChatHeader: React.FC<{isOnline: boolean, user: IUser, image: string}> = ({isOnline, user, image}) => {
   const navigate = useNavigate()

    return (
        <div className={s.header}>
            <div
                onClick={() => navigate(`/profile/${user.userId}`)}
                className={s.image}
                style={{ backgroundImage: `url(${image})` }}
            >
                {isOnline && <GrStatusGoodSmall className={s.online} />}
            </div>
            <div
                className={s.fio}
                onClick={() => navigate(`/profile/${user.userId}`)}
            >
                {[user.lastName, user.firstName, user.patronymic].join(" ")}
            </div>
            <div className={s.back} onClick={() => navigate(-1)}>
                Back
            </div>
        </div>
    );
};
