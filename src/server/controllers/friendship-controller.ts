import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError";
import friendshipService from "../services/friendship-service";
import INewFriendship from "../interfaces/INewFriendship";

class FriendshipController {
    async newFriendship(req: Request, res: Response, next: NextFunction) {
        try {
            const errros = validationResult(req);
            if (!errros.isEmpty()) {
                throw ApiError.BadRequest(
                    "Incorrect second friend id",
                    errros.array()
                );
            }
            const firstFriendId = Number(res.locals.userData.userId);
            const { secondFriendId }: INewFriendship = req.body;
            const friendship = await friendshipService.newFriendShip(
                firstFriendId,
                secondFriendId
            );
            res.json({ ...friendship });
        } catch (error) {
            next(error);
        }
    }

    async getFriendshipsByUserId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const errros = validationResult(req);
            if (!errros.isEmpty()) {
                throw ApiError.BadRequest(
                    "Incorrect first friend id",
                    errros.array()
                );
            }
            const firstFriendId = Number(req.params.firstFriendId);
            const friendships = await friendshipService.getFriendships(
                firstFriendId
            );
            res.json({ friendships });
        } catch (error) {
            next(error);
        }
    }

    async deleteFriendship(req: Request, res: Response, next: NextFunction) {
        try {
            const errros = validationResult(req);
            if (!errros.isEmpty()) {
                throw ApiError.BadRequest(
                    "Incorrect second friend id",
                    errros.array()
                );
            }
            const firstFriendId = Number(res.locals.userData.userId);
            const secondFriendId = Number(req.params.secondFriendId);
            const friendshipData = await friendshipService.deleteFriendship(
                firstFriendId,
                secondFriendId
            );
            res.json({ ...friendshipData });
        } catch (error) {
            next(error);
        }
    }
}

export default new FriendshipController();
