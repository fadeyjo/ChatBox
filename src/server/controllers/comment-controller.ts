import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError";
import INewComment from "../interfaces/INewComment";
import commentService from "../services/comment-service";

class CommentController {
    async newComment(req: Request, res: Response, next: NextFunction) {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                throw ApiError.BadRequest("Incorrect body", error.array());
            }
            const authorId = Number(res.locals.userData.userId);
            const { content, postId }: INewComment = req.body;
            const commentData = await commentService.newComment(
                content,
                postId,
                authorId
            );
            res.json({ ...commentData });
        } catch (error) {
            next(error);
        }
    }

    async getCommentsByPostId(req: Request, res: Response, next: NextFunction) {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                throw ApiError.BadRequest("Incorrect post id", error.array());
            }
            const postId = Number(req.params.postId);
            const comments = await commentService.getCommentsByPostId(postId);
            res.json({ comments });
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                throw ApiError.BadRequest(
                    "Incorrect comment id",
                    error.array()
                );
            }
            const commentId = Number(req.params.commentId);
            const comment = await commentService.deleteComment(commentId);
            res.json({ ...comment });
        } catch (error) {
            next(error);
        }
    }
}

export default new CommentController();
