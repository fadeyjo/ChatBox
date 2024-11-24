import React, { useContext, useEffect, useState } from "react";
import s from "./Comment.module.css";
import IComment from "../../interfaces/IProps/IComment";
import IUser from "../../interfaces/IResponses/IUser";
import UserService from "../../services/user-service";
import ProfileImageService from "../../services/profileImage-service";
import DateTimeService from "../../services/dateTime-service";
import { IoClose } from "react-icons/io5";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import CommentService from "../../services/comment-service";
import { useNavigate } from "react-router-dom";
import { globalSocket } from "../../globalSocket";
import io from "socket.io-client";
import { GrStatusGoodSmall } from "react-icons/gr";

const Comment: React.FC<IComment> = ({ comment, setComments, isMyPost }) => {
    const { store } = useContext(Context);

    const [commentAuthor, setCommentAuthor] = useState({} as IUser);
    const [commentAvatar, setCommentAvatar] = useState("");
    const [isOnline, setIsOnline] = useState(false);

    const navigate = useNavigate();

    const openPageByAvatar = () => {
        if (store.user.userId !== comment.commentAuthorId) {
            navigate(`/profile/${comment.commentAuthorId}`);
        }
    };

    const loadCommentAvatarImage = async () => {
        setCommentAvatar(
            (await ProfileImageService.getProfileImage(comment.commentAuthorId))
                .data.src
        );
    };

    const loadCommentAuthor = async () => {
        setCommentAuthor(
            (await UserService.getUserById(comment.commentAuthorId)).data
        );
    };

    const loadIsOnline = async () => {
        setIsOnline(
            (await UserService.getStatus(comment.commentAuthorId)).data.isOnline
        );
    };

    useEffect(() => {
        loadCommentAvatarImage();
        loadCommentAuthor();
        loadIsOnline();
        const socket = io(globalSocket);
        socket.emit("subscribe_online", { userId: comment.commentAuthorId });
        socket.on("set_status", ({ isOnline }: { isOnline: boolean }) => {
            setIsOnline(isOnline);
        });
        return () => {
            socket.off("set_status");
            socket.disconnect();
        };
    }, []);

    return (
        <div className={s.comment}>
            <div
                className={s.avatar}
                style={{ backgroundImage: `url(${commentAvatar})` }}
                onClick={openPageByAvatar}
            >
                {(isOnline) && (
                    <GrStatusGoodSmall className={s.online} />
                )}
            </div>
            <div className={s.fio_content_date_time}>
                <div>
                    <span className={s.fio}>
                        {[
                            commentAuthor.lastName,
                            commentAuthor.firstName,
                            commentAuthor.patronymic,
                        ].join(" ")}
                    </span>{" "}
                    <span className={s.date_time}>
                        {DateTimeService.formDate(comment.commentDateTime)}
                    </span>
                </div>
                <div>{comment.content}</div>
            </div>
            {comment.commentAuthorId === store.user.userId || isMyPost ? (
                <IoClose
                    className={s.close}
                    onClick={async () => {
                        {
                            await CommentService.deleteComment(
                                comment.commentId
                            );
                            setComments((prev) =>
                                prev.filter(
                                    (commentData) =>
                                        commentData.commentId !==
                                        comment.commentId
                                )
                            );
                        }
                    }}
                />
            ) : null}
        </div>
    );
};

export default observer(Comment);
