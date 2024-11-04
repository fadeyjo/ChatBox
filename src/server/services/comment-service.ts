import ApiError from "../exceptions/ApiError";
import ICommentFromDataBase from "../interfaces/ICommentFromDataBase";
import postService from "./post-service";
import userService from "./user-service";
import db from "../db";
import CommentDto from "../dtos/comment-dto";
import dateTimeService from "./dateTime-service";

class CommentService {
    async newComment(content: string, postId: number, authorId: number) {
        if (!(await userService.userIsExistsById(authorId))) {
            throw ApiError.BadRequest("User with this id aren't found");
        }
        if (!(await postService.postIsExistsById(postId))) {
            throw ApiError.BadRequest("Post with this id aren't found");
        }
        
        const nowFormattedDateTime = dateTimeService.getNowDate();

        const commentData: ICommentFromDataBase = (
            await db.query(
                `INSERT INTO comments (content, comment_date_time, post_id, comment_author_id) VALUES ($1, $2, $3, $4) RETURNING *`,
                [content, nowFormattedDateTime, postId, authorId]
            )
        ).rows[0];
        commentData.comment_date_time = dateTimeService.formatDateTime(
            commentData.comment_date_time
        );
        return new CommentDto(commentData);
    }

    async getCommentsByPostId(postId: number) {
        if (!(await postService.postIsExistsById(postId))) {
            throw ApiError.BadRequest("Post with this id aren't found");
        }
        const comments: ICommentFromDataBase[] = (
            await db.query("SELECT * FROM comments WHERE post_id = $1", [
                postId,
            ])
        ).rows;
        return comments.map((comment) => {
            comment.comment_date_time = dateTimeService.formatDateTime(
                comment.comment_date_time
            );
            return new CommentDto(comment);
        });
    }

    async deleteComment(commentId: number) {
        if (!(await this.commentIsExistById(commentId))) {
            throw ApiError.BadRequest("Comment with this id aren't found");
        }
        const commentData: ICommentFromDataBase = (
            await db.query(
                "DELETE FROM comments WHERE comment_id = $1 RETURNING *",
                [commentId]
            )
        ).rows[0];
        commentData.comment_date_time = dateTimeService.formatDateTime(
            commentData.comment_date_time
        );
        return new CommentDto(commentData);
    }

    async commentIsExistById(commentId: number) {
        const comment: ICommentFromDataBase[] = (
            await db.query("SELECT * FROM comments WHERE comment_id = $1", [
                commentId,
            ])
        ).rows;
        if (comment.length == 0) {
            return false;
        }
        return true;
    }
}

export default new CommentService();
