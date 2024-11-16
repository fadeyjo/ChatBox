import React, { ChangeEvent, useRef, useState } from "react";
import s from "./NewPostForm.module.css";
import { FormButton } from "../UI/FormButton/FormButton";
import { GoPaperclip } from "react-icons/go";
import PostService from "../../services/post-service";
import PostImageService from "../../services/postImage-service";
import INewPostForm from "../../interfaces/IProps/INewPostForm";

export const NewPostForm: React.FC<INewPostForm> = ({
    setPosts,
    setIsOpened,
    repost,
    setRepost,
}) => {
    const [content, setContent] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);

    const setImages = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            return;
        }
        const permittedTypes = ["image/jpeg", "image/jpg", "image/png"];
        for (let i = 0; i < files.length; i++) {
            if (!permittedTypes.includes(files[i].type)) {
                return;
            }
        }
        setFiles(Array.from(files));
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
                    {files.map((file) => (
                        <div
                            className={s.image}
                            style={{
                                backgroundImage: `url(${URL.createObjectURL(
                                    file
                                )})`,
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
                              setRepost(null)
                              setContent("");
                              setFiles([]);
                              setIsOpened(false);
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
                              setIsOpened(false);
                              setPosts((prev) => [post, ...prev]);
                          }
                }
                type="button"
            >
                Create post
            </FormButton>
        </div>
    );
};
