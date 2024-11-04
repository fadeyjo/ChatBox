import { NextFunction, Request, Response } from "express";
import INewPost from "../interfaces/INewPost";
import postService from "../services/post-service";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError";

class PostController {
    async newPost(req: Request, res: Response, next: NextFunction) {
        try {
            const newPost: INewPost = req.body;
            const authorId = res.locals.userData.userId;
            const newPostData = await postService.newPost(newPost, authorId);
            res.json({ ...newPostData });
        } catch (error) {
            next(error);
        }
    }

    async getPostsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect userId", errors.array());
            }
            const userId = Number(req.params.userId);
            const posts = await postService.getPostsByUserId(userId);
            res.json({ posts });
        } catch (error) {
            next(error);
        }
    }

    async deletePost(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect postId", errors.array());
            }
            const postId = Number(req.params.postId);
            const post = await postService.deletePostById(postId);
            res.json({ ...post });
        } catch (error) {
            next(error);
        }
    }
}

export default new PostController();
