import React, { ChangeEvent, useRef, useState } from "react";
import s from "./NewPostForm.module.css";
import { FormButton } from "../UI/FormButton/FormButton";
import { GoPaperclip } from "react-icons/go";
import PostService from "../../services/post-service";
import PostImageService from "../../services/postImage-service";
import INewPostForm from "../../interfaces/IProps/INewPostForm";
import io from "socket.io-client";
import { globalSocket } from "../../globalSocket";

export const NewPostForm: React.FC<INewPostForm> = ({
    setPosts,
    repost,
    setRepost,
    setCreatePostFormIsOpened,
    isFromPostsPage,
}) => {
    const [content, setContent] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [filesImages, setFilesImages] = useState<string[]>([]);

    const setImages = (event: ChangeEvent<HTMLInputElement>) => {
        const filesEvent = event.target.files;
        if (!filesEvent || filesEvent.length === 0) {
            return;
        }
        const permittedTypes = ["image/jpeg", "image/jpg", "image/png"];
        for (let i = 0; i < filesEvent.length; i++) {
            if (!permittedTypes.includes(filesEvent[i].type)) {
                return;
            }
        }
        const filesArray = Array.from(filesEvent);
        setFiles(filesArray);
        setFilesImages(
            filesArray.map(
                (fileData) => `url(${URL.createObjectURL(fileData)})`
            )
        );
    };

    return (
        <div className={s.new_post_form}>
            <div className={s.container}>
                <textarea
                    rows={8}
                    placeholder="Type post content here"
                    className={s.content}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                ></textarea>
                <div className={s.selected_images}>
                    <GoPaperclip
                        className={s.clip}
                        onClick={() => fileInputRef.current?.click()}
                    />
                    {filesImages.map((file) => (
                        <div
                            className={s.image}
                            style={{
                                backgroundImage: file,
                            }}
                        ></div>
                    ))}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={true}
                    accept=".jpg, .jpeg, .png"
                    onChange={setImages}
                    className={s.file_input}
                />
            </div>
            <FormButton
                onClick={
                    repost
                        ? async () => {
                              const post = (
                                  await PostService.newPost(
                                      content,
                                      repost.postId
                                  )
                              ).data;
                              await PostImageService.newPostImages(
                                  files,
                                  post.postId
                              );
                              setRepost(null);
                              setContent("");
                              setFiles([]);
                              setFilesImages([]);
                              setCreatePostFormIsOpened(false);
                              if (isFromPostsPage)
                                  setPosts((prev) => [post, ...prev]);
                              const socket = io(globalSocket);
                              socket.emit("new_post", { post });
                          }
                        : async () => {
                              const post = (await PostService.newPost(content))
                                  .data;
                              await PostImageService.newPostImages(
                                  files,
                                  post.postId
                              );
                              setContent("");
                              setFiles([]);
                              setFilesImages([]);
                              setCreatePostFormIsOpened(false);
                              setPosts((prev) => [post, ...prev]);
                              const socket = io(globalSocket);
                              socket.emit("new_post", { post });
                          }
                }
                type="button"
            >
                Create post
            </FormButton>
        </div>
    );
};
