import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError";
import INewSubscribersPageOwners from "../interfaces/INewSubscribersPageOwners";
import subscribersPageOwnersService from "../services/subscribersPageOwners-service";

class SubscribersPageOwnersController {
    async newSubscribersPageOwners(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect body", errors.array());
            }
            const { subscriberId, pageOwnerId }: INewSubscribersPageOwners = req.body;
            const subscribersPageOwnersData =
                await subscribersPageOwnersService.newSubscribersPageOwners(
                    subscriberId,
                    pageOwnerId
                );
            res.json({ ...subscribersPageOwnersData });
        } catch (error) {
            next(error);
        }
    }

    async getSubscribersPageOwnersByPageOwnerId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest(
                    "Incorrect page owner id",
                    errors.array()
                );
            }
            const pageOwnerId = Number(req.params.pageOwnerId);
            const subscribersPageOwners =
                await subscribersPageOwnersService.getSubscribersPageOwnersByPageOwnerId(
                    pageOwnerId
                );
            res.json({ subscribersPageOwners });
        } catch (error) {
            next(error);
        }
    }

    async deleteSubscibersPageOwnersByPageOwnerId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest(
                    "Incorrect page owner id",
                    errors.array()
                );
            }
            const subscriberId = Number(req.params.subscriberId);
            const pageOwnerId = Number(req.params.pageOwnerId);
            const subscribersPageOwnersData =
                await subscribersPageOwnersService.deleteSubscribersPageOwners(
                    subscriberId,
                    pageOwnerId
                );
            res.json({ ...subscribersPageOwnersData });
        } catch (error) {
            next(error);
        }
    }
}

export default new SubscribersPageOwnersController();
