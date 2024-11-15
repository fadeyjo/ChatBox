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
import { Comment } from "../Comment/Comment";
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

const Post: React.FC<IPost> = ({ post, isChild, setPosts }) => {
    const [childrenPost, setChildrenPost] = useState<JSX.Element | null>(null);
    const [authorProfileImage, setAuthorProfileImage] = useState("");
    const [comments, setComments] = useState<IGetComment[]>([]);
    const [author, setAuthor] = useState({} as IUser);
    const [allComments, setAllComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isReaction, setIsReaction] = useState(false);
    const [reactions, setReactions] = useState<IGetReaction[]>([]);
    const { store } = useContext(Context);
    const [reposts, setReposts] = useState<IGetPost[]>([]);

    const asyncEffect = async () => {
        const authorData = (await UserService.getUserById(post.postAuthorId))
            .data;
        setAuthor(authorData);

        if (post.childrenPostId) {
            const childPost: IGetPost = (
                await PostService.getPostById(post.childrenPostId)
            ).data;
            setChildrenPost(<Post isChild={true} post={childPost} />);
        }

        setAuthorProfileImage(
            (await ProfileImageService.getProfileImage(authorData.userId)).data
                .src
        );

        if (!isChild) {
            setComments(
                (
                    await CommentService.getCommentsByPostId(post.postId)
                ).data.comments.sort((first, second) => {
                    const dateFirst = new Date(first.commentDateTime);
                    const dateSecond = new Date(second.commentDateTime);
                    return dateSecond.getTime() - dateFirst.getTime();
                })
            );
            const reactionsOnPost = await (
                await ReactionService.getReactionsByPostId(post.postId)
            ).data.reactions;
            for (let i = 0; i < reactionsOnPost.length; i++) {
                if (reactionsOnPost[i].reactionAuthorId === store.user.userId) {
                    setIsReaction(true);
                    break;
                }
            }
            setReactions(reactionsOnPost);
            setReposts(
                (await PostService.getPostsByChildrenPostId(post.postId)).data
                    .posts
            );
        }
    };

    useEffect(() => {
        asyncEffect();
    }, []);

    return (
        <div className={classNames(s.post, { [s.left_border]: isChild })}>
            <div className={s.post_header}>
                <div
                    className={s.profile_post_image}
                    style={{
                        backgroundImage: `url(${authorProfileImage})`,
                    }}
                ></div>
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
            {childrenPost}
            {isChild
                ? null
                : comments.map((comment, index) => {
                      if (allComments || comments.length <= 2)
                          return (
                              <Comment
                                  comment={comment}
                                  key={comment.commentId}
                              />
                          );
                      if (index <= 1)
                          return (
                              <Comment
                                  comment={comment}
                                  key={comment.commentId}
                              />
                          );
                      return null;
                  })}
            {comments.length > 2 ? (
                allComments ? (
                    <span
                        className={s.manage_comments}
                        onClick={() => setAllComments(false)}
                    >
                        Close comments
                    </span>
                ) : (
                    <span
                        className={s.manage_comments}
                        onClick={() => setAllComments(true)}
                    >
                        View all commets...
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
                                          .then((data) =>
                                              setReactions((prev) =>
                                                  prev.filter(
                                                      (reactionData) =>
                                                          reactionData.reactionId !==
                                                          data.reactionId
                                                  )
                                              )
                                          );
                                      setIsReaction(false);
                                  }
                                : () => {
                                      ReactionService.newReaction(post.postId)
                                          .then((response) => response.data)
                                          .then((data) =>
                                              setReactions((prev) => [
                                                  ...prev,
                                                  data,
                                              ])
                                          );
                                      setIsReaction(true);
                                  }
                        }
                    >
                        {isReaction ? (
                            <FcLike className={s.reaction_button} />
                        ) : (
                            <FcLikePlaceholder className={s.reaction_button} />
                        )}{" "}
                        {reactions.length}{" "}
                    </div>
                    <div
                        className={s.reposts_amount}
                        onClick={() => {
                            PostService.newPost("Пися", post.postId)
                                .then((response) => response.data)
                                .then((data) => {
                                    if (setPosts) {
                                        setPosts((prev) => [data, ...prev]);
                                        setReposts((prev) => [data, ...prev]);
                                    }
                                });
                        }}
                    >
                        <FaDirections className={s.repost_button} />{" "}
                        {reposts.length}
                    </div>
                </div>
            )}
            {isChild ? null : (
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
                                                postData.postId !== data.postId
                                        )
                                    );
                            });
                    }}
                />
            )}
        </div>
    );
};

export default observer(Post);