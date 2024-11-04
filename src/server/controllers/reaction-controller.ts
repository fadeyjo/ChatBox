import { NextFunction, Request, Response } from "express";
import INewReaction from "../interfaces/INewReaction";
import reactionService from "../services/reaction-service";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError";

class ReactionController {
    async newReaction(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect post id", errors.array());
            }
            const userId = Number(res.locals.userData.userId);
            const { postId }: INewReaction = req.body;
            const reactionData = await reactionService.newReaction(
                postId,
                userId
            );
            res.json({ ...reactionData });
        } catch (error) {
            next(error);
        }
    }

    async getReactionsByPostId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect post id", errors.array());
            }
            const postId = Number(req.params.postId);
            const reactions = await reactionService.getReactionsByPostId(
                postId
            );
            res.json({ reactions });
        } catch (error) {
            next(error);
        }
    }

    async deleteReactionByUserId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect post id", errors.array());
            }
            const userId = Number(res.locals.userData.userId);
            const postId = Number(req.params.postId);
            const reaction = await reactionService.deleteReaction(
                postId,
                userId
            );
            res.json({ ...reaction });
        } catch (error) {
            next(error);
        }
    }
}

export default new ReactionController();
