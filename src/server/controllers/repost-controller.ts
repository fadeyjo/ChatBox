import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError";
import repostService from "../services/repost-service";

class RepostController {
    async newRepost(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect post id", errors.array());
            }
            const authorId = Number(res.locals.userData.userId);
            const postId = Number(req.params.postId);
            const repostData = await repostService.newRepost(postId, authorId);
            res.json({ ...repostData });
        } catch (error) {
            next(error);
        }
    }

    async getRepostsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest(
                    "Incorrect author id",
                    errors.array()
                );
            }
            const authorId = Number(req.params.authorId);
            const reposts = await repostService.getRepostsByUserId(authorId);
            res.json({ reposts });
        } catch (error) {
            next(error);
        }
    }

    async deleteRepost(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest(
                    "Incorrect repost id",
                    errors.array()
                );
            }
            const repostId = Number(req.params.repostId);
            const repost = await repostService.deleteRepost(repostId);
            res.json({ ...repost });
        } catch (error) {
            next(error);
        }
    }
}

export default new RepostController();
