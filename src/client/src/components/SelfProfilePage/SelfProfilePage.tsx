import React, {
    ChangeEvent,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import s from "./SelfProfilePage.module.css";
import ProfileImageService from "../../services/profileImage-service";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { ModalWindow } from "../ModalWindow/ModalWindow";
import FriendshipService from "../../services/friendship-service";
import SubscribersPageOwnersService from "../../services/subscribersPageOwners-service";

const SelfProfilePage: React.FC = () => {
    const [error, setError] = useState("");
    const { store } = useContext(Context);
    const [imageSrc, setImageSrc] = useState<string>("");
    const [friendsAmount, setFriendsAmount] = useState(0);
    const [subscribersAmount, setSubscribersAmount] = useState(0);
    const [subscribesAmount, setSubscribesAmount] = useState(0);
    const [file, setFile] = useState<File>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isOpened, setIsOpened] = useState(false);

    useEffect(() => {
        const profileImageData = ProfileImageService.getProfileImage(
            store.user.userId
        )
            .then((response) => response)
            .then((data) => setImageSrc(data.data.src));
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
    }, [file]);

    const setImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            setError("Not files.");
            setIsOpened(true);
            return;
        }
        const file = files[0];
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
            setError(
                "Incorrect file format. Select jpg, jpeg or png format file."
            );
            setIsOpened(true);
            return;
        }
        const formData = new FormData();
        formData.append("image", file);
        await ProfileImageService.newProfileImage(formData);
        setFile(file);
    };

    return (
        <>
            <div className={s.profile_info}>
                <div
                    className={s.profile_image}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ backgroundImage: `url(${imageSrc})` }}
                ></div>
                <div className={s.fio_email}>
                    <div className={s.fio}>
                        {[
                            store.user.lastName,
                            store.user.firstName,
                            store.user.patronymic,
                        ].join(" ")}
                    </div>
                    <div className={s.email}>@{store.user.nickname}</div>
                    <div className={s.other_info}>
                        <div>{friendsAmount} friends</div>
                        <div>{subscribersAmount} subscribers</div>
                        <div>{subscribesAmount} subscribes</div>
                    </div>
                </div>
            </div>

            <input
                className={s.file_input}
                type="file"
                accept=".jpg, .jpeg, .png"
                ref={fileInputRef}
                onChange={setImage}
            />
            <ModalWindow
                isOpened={isOpened}
                setIsOpened={setIsOpened}
                header="Error to set profile image"
            >
                <div className={s.error}>{error}</div>
            </ModalWindow>
        </>
    );
};

export default observer(SelfProfilePage);
