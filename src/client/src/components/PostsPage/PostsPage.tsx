import React, { useEffect, useState } from "react";
import s from "./PostsPage.module.css";
import IGetPost from "../../interfaces/IResponses/IGetPost";
import PostService from "../../services/post-service";
import Post from "../Post/Post";
import { ModalWindow } from "../ModalWindow/ModalWindow";
import { NewPostForm } from "../NewPostForm/NewPostForm";
import { FormButton } from "../UI/FormButton/FormButton";

export const PostsPage: React.FC = () => {
    const [posts, setPosts] = useState<IGetPost[]>([]);
    const [createPostFormIsOpened, setCreatePostFormIsOpened] = useState(false);
    const [repost, setRepost] = useState<IGetPost | null>(null);

    const loadPosts = async () => {
        const postsData = (await PostService.getALlPosts()).data.posts;
        setPosts(
            postsData.sort((first, second) => {
                const dateFirst = new Date(first.publicationDateTime);
                const dateSecond = new Date(second.publicationDateTime);
                return dateSecond.getTime() - dateFirst.getTime();
            })
        );
    };

    useEffect(() => {
        loadPosts();
    }, []);

    return (
        <div>
            {posts.map((post) => (
                <Post
                    key={post.postId}
                    post={post}
                    isChild={false}
                    setRepost={setRepost}
                    setCreatePostFormIsOpened={setCreatePostFormIsOpened}
                    setPosts={setPosts}
                />
            ))}
            <FormButton
                className={s.new_post}
                type="button"
                onClick={() => setCreatePostFormIsOpened(true)}
            >
                New post
            </FormButton>
            <ModalWindow
                isOpened={createPostFormIsOpened}
                setIsOpened={setCreatePostFormIsOpened}
                header="New post"
            >
                <NewPostForm
                    setCreatePostFormIsOpened={setCreatePostFormIsOpened}
                    setPosts={setPosts}
                    repost={repost}
                    setRepost={setRepost}
                    isFromPostsPage={true}
                />
            </ModalWindow>
        </div>
    );
};
