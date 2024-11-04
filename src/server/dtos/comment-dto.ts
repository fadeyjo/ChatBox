import ICommentFromDataBase from "../interfaces/ICommentFromDataBase";

export default class CommentDto {
    commentId: number;
    content: string;
    commentDateTime: string;
    postId: number;
    commentAuthorId: number;

    constructor(comment: ICommentFromDataBase) {
        this.commentId = comment.comment_id;
        this.content = comment.content;
        this.commentDateTime = comment.comment_date_time;
        this.postId = comment.post_id;
        this.commentAuthorId = comment.comment_author_id;
    }
}
