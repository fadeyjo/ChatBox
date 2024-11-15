import React, { useEffect, useState } from "react";
import s from "./Comment.module.css";
import IComment from "../../interfaces/IProps/IComment";
import IUser from "../../interfaces/IResponses/IUser";
import UserService from "../../services/user-service";
import ProfileImageService from "../../services/profileImage-service";
import DateTimeService from "../../services/dateTime-service";

export const Comment: React.FC<IComment> = ({ comment }) => {
    const [user, setUser] = useState<IUser>({} as IUser);
    const [avatar, setAvatar] = useState("");

    const loadInfo = async () => {
        const userData = (
            await UserService.getUserById(comment.commentAuthorId)
        ).data;
        setUser(userData);
        const imageSrc = (
            await ProfileImageService.getProfileImage(userData.userId)
        ).data.src;
        return imageSrc;
    };

    useEffect(() => {
        loadInfo().then((response) => setAvatar(response));
    }, []);

    return (
        <div className={s.comment}>
            <div
                className={s.avatar}
                style={{ backgroundImage: `url(${avatar})` }}
            ></div>
            <div className={s.fio_content_date_time}>
                <div>
                    <span className={s.fio}>
                        {[user.lastName, user.firstName, user.patronymic].join(
                            " "
                        )}
                    </span>{" "}
                    <span className={s.date_time}>
                        {DateTimeService.formDate(comment.commentDateTime)}
                    </span>
                </div>
                <div>{comment.content}</div>
            </div>
        </div>
    );
};
