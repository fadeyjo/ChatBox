import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import s from "./Post.module.css";
import IPost from "../../interfaces/IProps/IPost";
import DateTimeService from "../../services/dateTime-service";
import PostService from "../../services/post-service";
import IGetPost from "../../interfaces/IResponses/IGetPost";
import IUser from "../../interfaces/IResponses/IUser";
import UserService from "../../services/user-service";
import ProfileImageService from "../../services/profileImage-service";
import classNames from "classnames";
import IGetComment from "../../interfaces/IResponses/IGetComment";
import Comment from "../Comment/Comment";
import CommentService from "../../services/comment-service";
import { BiSend } from "react-icons/bi";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import ReactionService from "../../services/reaction-service";
import IGetReaction from "../../interfaces/IResponses/IGetReaction";
import { Context } from "../..";
import { FaDirections } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import { IoClose } from "react-icons/io5";
import PostImageService from "../../services/postImage-service";
import ImageSlider from "../ImageSlider/ImageSlider";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { globalSocket } from "../../globalSocket";
import { GrStatusGoodSmall } from "react-icons/gr";

const Post: React.FC<IPost> = ({
    post,
    isChild,
    setCreatePostFormIsOpened,
    setRepost,
    setPosts,
}) => {
    const { store } = useContext(Context);

    const [postAvatarImage, setPostAvatarImage] = useState("");
    const [author, setAuthor] = useState({} as IUser);
    const [postImages, setPostImages] = useState<string[]>([]);
    const [comments, setComments] = useState<IGetComment[]>([]);
    const [childPost, setChildPost] = useState<JSX.Element | null>(null);
    const [showAllComments, setShowAllComments] = useState<boolean>(false);
    const [newComment, setNewComment] = useState("");
    const [isReaction, setIsReaction] = useState(false);
    const [reactionsAmount, setReactionsAmount] = useState(0);
    const [repostsAmount, setRepostsAmount] = useState(0);
    const [isOnline, setIsOnline] = useState(false)

    const navigate = useNavigate();

    const openPageByAvatar = () => {
        if (store.user.userId !== post.postAuthorId) {
            navigate(`/profile/${post.postAuthorId}`);
        }
    };

    const loadPostAvatarImage = async () => {
        setPostAvatarImage(
            (await ProfileImageService.getProfileImage(post.postAuthorId)).data
                .src
        );
    };

    const loadAuthor = async () => {
        setAuthor((await UserService.getUserById(post.postAuthorId)).data);
    };

    const loadPostImages = async () => {
        setPostImages(
            (await PostImageService.getPostImages(post.postId)).data.postImages
        );
    };

    const loadComments = async () => {
        setComments(
            (
                await CommentService.getCommentsByPostId(post.postId)
            ).data.comments.sort((first, second) => {
                const dateFirst = new Date(first.commentDateTime);
                const dateSecond = new Date(second.commentDateTime);
                return dateSecond.getTime() - dateFirst.getTime();
            })
        );
    };

    const loadChildPost = async () => {
        if (post.childrenPostId) {
            const childPostData = (
                await PostService.getPostById(post.childrenPostId)
            ).data;
            setChildPost(<Post post={childPostData} isChild={true} />);
        }
    };

    const laodReactions = async () => {
        const reactionsData = (
            await ReactionService.getReactionsByPostId(post.postId)
        ).data.reactions;
        setReactionsAmount(reactionsData.length);
        for (let i = 0; i < reactionsData.length; i++) {
            if (reactionsData[i].reactionAuthorId === store.user.userId) {
                setIsReaction(true);
                return;
            }
        }
    };

    const loadReposts = async () => {
        setRepostsAmount(
            (await PostService.getPostsByChildrenPostId(post.postId)).data.posts
                .length
        );
    };

    const loadIsOnline = async () => {
        setIsOnline((await UserService.getStatus(post.postAuthorId)).data.isOnline)
    }

    useEffect(() => {
        loadAuthor();
        loadPostImages();
        loadChildPost();
        loadPostAvatarImage();
        laodReactions();
        loadReposts();
        loadIsOnline()
        if (!isChild) {
            loadComments();
        }
        const socket = io(globalSocket);
        socket.emit("subscribe_image", {
            userId: post.postAuthorId,
        });
        socket.emit("subscribe_like", {
            postId: post.postId,
            authorId: store.user.userId,
        });
        socket.emit("subscribe_online", {userId: post.postAuthorId });
        socket.on("set_image", () => {
            loadPostAvatarImage();
        });
        socket.on("set_like", ({ operation }: { operation: number }) => {
            console.log(operation)
            setReactionsAmount((prev) => prev + operation);
        });
        socket.on("set_status", ({ isOnline }: { isOnline: boolean }) => {
            setIsOnline(isOnline);
        });
        return () => {
            socket.off("set_status");
            socket.off("set_like");
            socket.off("set_image");
            socket.disconnect();
        };
    }, []);

    return (
        <div className={classNames(s.post, { [s.left_border]: isChild })}>
            <div className={s.post_header}>
                <div
                    className={s.profile_post_image}
                    onClick={openPageByAvatar}
                    style={{
                        backgroundImage: `url(${postAvatarImage})`,
                    }}
                >
                {isOnline && (
                    <GrStatusGoodSmall className={s.online} />
                )}</div>
                <div className={s.date_time_fio}>
                    <div className={s.post_fio}>
                        {[
                            author.lastName,
                            author.firstName,
                            author.patronymic,
                        ].join(" ")}
                    </div>
                    <div className={s.pub_post_date_time}>
                        {DateTimeService.formDate(post.publicationDateTime)}
                    </div>
                </div>
            </div>
            <div className={s.post_content}>{post.content}</div>
            <ImageSlider images={postImages} />
            {childPost}
            {comments.length !== 0 &&
                comments.map((comment, index) => {
                    if (showAllComments || comments.length <= 2)
                        return (
                            <Comment
                                isMyPost={
                                    store.user.userId === post.postAuthorId
                                }
                                comment={comment}
                                key={comment.commentId}
                                setComments={setComments}
                            />
                        );
                    if (index <= 1)
                        return (
                            <Comment
                                isMyPost={
                                    store.user.userId === post.postAuthorId
                                }
                                comment={comment}
                                key={comment.commentId}
                                setComments={setComments}
                            />
                        );
                    return null;
                })}
            {comments.length > 2 ? (
                showAllComments ? (
                    <span
                        className={s.manage_comments}
                        onClick={() => setShowAllComments(false)}
                    >
                        Hide comments
                    </span>
                ) : (
                    <span
                        className={s.manage_comments}
                        onClick={() => setShowAllComments(true)}
                    >
                        Show all commets...
                    </span>
                )
            ) : null}
            {!isChild ? (
                <div className={s.new_comment}>
                    <textarea
                        placeholder="Type your comment"
                        className={s.comment_area}
                        rows={1}
                        value={newComment}
                        onChange={(event) => {
                            const textarea = event.target;

                            textarea.style.height = "auto";

                            textarea.style.height =
                                textarea.scrollHeight + "px";
                            setNewComment(event.target.value);
                        }}
                    ></textarea>
                    <BiSend
                        onClick={() => {
                            CommentService.newComment(newComment, post.postId)
                                .then((response) => response.data)
                                .then((data) =>
                                    setComments((prev) => [data, ...prev])
                                );
                            setNewComment("");
                        }}
                        className={s.send_comment}
                    />
                </div>
            ) : null}
            {isChild ? null : (
                <div className={s.reaction_repost}>
                    <div
                        className={s.reactions_amount}
                        onClick={
                            isReaction
                                ? () => {
                                      ReactionService.deleteReaction(
                                          post.postId
                                      )
                                          .then((response) => response.data)
                                          .then((data) => {
                                              setReactionsAmount(
                                                  (prev) => prev - 1
                                              );
                                              setIsReaction(false);
                                          });
                                      const socket = io(globalSocket);
                                      socket.emit("change_like", {
                                          postId: post.postId,
                                          operation: -1,
                                          authorId: store.user.userId,
                                      });
                                  }
                                : () => {
                                      ReactionService.newReaction(post.postId)
                                          .then((response) => response.data)
                                          .then((data) => {
                                              setReactionsAmount(
                                                  (prev) => prev + 1
                                              );
                                              setIsReaction(true);
                                          });
                                      const socket = io(globalSocket);
                                      socket.emit("change_like", {
                                          postId: post.postId,
                                          operation: 1,
                                          authorId: store.user.userId,
                                      });
                                  }
                        }
                    >
                        {isReaction ? (
                            <FcLike className={s.reaction_button} />
                        ) : (
                            <FcLikePlaceholder className={s.reaction_button} />
                        )}{" "}
                        {reactionsAmount}{" "}
                    </div>
                    <div
                        className={classNames({
                            [s.reposts_amount]:
                                post.postAuthorId !== store.user.userId,
                            [s.repost_amount_unself]:
                                post.postAuthorId === store.user.userId,
                        })}
                        onClick={
                            post.postAuthorId === store.user.userId
                                ? () => {}
                                : () => {
                                      if (
                                          setCreatePostFormIsOpened &&
                                          setRepost
                                      ) {
                                          setCreatePostFormIsOpened(true);
                                          setRepost(post);
                                      }
                                  }
                        }
                    >
                        <FaDirections className={s.repost_button} />{" "}
                        {repostsAmount}
                    </div>
                </div>
            )}
            {isChild || post.postAuthorId !== store.user.userId ? null : (
                <IoClose
                    className={s.close}
                    onClick={() => {
                        PostService.deletePost(post.postId)
                            .then((response) => response.data)
                            .then((data) => {
                                if (setPosts)
                                    setPosts((prev) =>
                                        prev.filter(
                                            (postData) =>
                                                postData.postId !== post.postId
                                        )
                                    );
                                const socket = io(globalSocket);
                                socket.emit("delete_post", {
                                    postId: data.postId,
                                    authorId: data.postAuthorId,
                                });
                            });
                    }}
                />
            )}
        </div>
    );
};

export default observer(Post);
