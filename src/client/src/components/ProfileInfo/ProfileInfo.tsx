import React, {
    ChangeEvent,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import s from "./ProfileInfo.module.css";
import IProfileInfo from "../../interfaces/IProps/IProfileInfo";
import classNames from "classnames";
import { globalSocket } from "../../globalSocket";
import io from "socket.io-client";
import ProfileImageService from "../../services/profileImage-service";
import { Context } from "../..";

const ProfileInfo: React.FC<IProfileInfo> = ({
    userId,
    lastName,
    firstName,
    patronymic,
    friendsAmount,
    subscribersAmount,
    subscribesAmount,
    isSelfPage,
    nickname,
}) => {
    const { store } = useContext(Context);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageSrc, setImageSrc] = useState("");

    const setNewImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            return;
        }
        const file = files[0];
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
            return;
        }
        const formData = new FormData();
        formData.append("image", file);
        await ProfileImageService.newProfileImage(formData);
        const newSrc = (await ProfileImageService.getProfileImage(userId)).data
            .src;
        setImageSrc(newSrc);
        const newSocket = io(globalSocket);
        newSocket.emit("change_image", { userId });
    };

    const setImage = async () => {
        const newSrc = (await ProfileImageService.getProfileImage(userId)).data
            .src;
        setImageSrc(newSrc);
    };

    useEffect(() => {
        setImage();
        const socket = io(globalSocket);
        if (!isSelfPage) {
            socket.emit("subscribe_image", {
                userId: userId,
            });
            socket.on("set_image", () => {
                setImage();
            });
        }

        return () => {
            if (isSelfPage) return;
            socket.off("set_image");
            socket.disconnect();
        };
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
                    {[lastName, firstName, patronymic].join(" ")}
                </div>
                <div className={s.email}>@{nickname}</div>
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
                    onChange={setNewImage}
                />
            ) : null}
        </div>
    );
};

export default ProfileInfo;
