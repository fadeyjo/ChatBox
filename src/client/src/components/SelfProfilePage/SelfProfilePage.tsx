import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import s from "./SelfProfilePage.module.css";
import ProfileImageService from "../../services/profileImage-service";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { ModalWindow } from "../ModalWindow/ModalWindow";
import { FormButton } from "../UI/FormButton/FormButton";
import PostService from "../../services/post-service";
import IGetPost from "../../interfaces/IResponses/IGetPost";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import Post from "../Post/Post";
import { NewPostForm } from "../NewPostForm/NewPostForm";

const SelfProfilePage: React.FC = () => {
    const [error, setError] = useState("");
    const { store } = useContext(Context);
    const [imageSrc, setImageSrc] = useState<string>("");
    const [file, setFile] = useState<File>();
    const [isOpened, setIsOpened] = useState(false);
    const [posts, setPosts] = useState<IGetPost[]>([]);
    const [createPostIsOpened, setCreatePostIsOpened] = useState(false);

    useEffect(() => {
        ProfileImageService.getProfileImage(store.user.userId)
            .then((response) => response)
            .then((data) => setImageSrc(data.data.src));
    }, [file]);

    useEffect(() => {
        PostService.getPostsByUserId(store.user.userId)
            .then((response) => response)
            .then((data) =>
                setPosts(
                    data.data.posts.sort((first, second) => {
                        const dateFirst = new Date(first.publicationDateTime);
                        const dateSecond = new Date(second.publicationDateTime);
                        return dateSecond.getTime() - dateFirst.getTime();
                    })
                )
            );
    }, [posts]);

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
            <div className={s.profile}>
                <ProfileInfo
                    user={store.user}
                    setImage={setImage}
                    imageSrc={imageSrc}
                />
                <FormButton
                    onClick={() => setCreatePostIsOpened(true)}
                    className={s.create_post_button}
                    type="button"
                >
                    Create post
                </FormButton>
            </div>

            {posts.length !== 0 && (
                <div className={s.posts}>
                    {posts.map((post) => (
                        <Post
                        imageSrc={imageSrc}
                            isChild={false}
                            post={post}
                            key={post.postId}
                            setPosts={setPosts}
                        />
                    ))}
                </div>
            )}

            <ModalWindow
                isOpened={isOpened}
                setIsOpened={setIsOpened}
                header="Error to set profile image"
            >
                <div className={s.error}>{error}</div>
            </ModalWindow>
            <ModalWindow
                isOpened={createPostIsOpened}
                setIsOpened={setCreatePostIsOpened}
                header="New post"
            >
                <NewPostForm setIsOpened={setCreatePostIsOpened} setPosts={setPosts} />
            </ModalWindow>
        </>
    );
};

export default observer(SelfProfilePage);
