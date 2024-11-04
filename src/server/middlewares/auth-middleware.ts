import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";
import tokensService from "../services/tokens-service";

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw ApiError.UnauthorizedError();
        }
        const splitAuthorizationHeader = authorizationHeader.split(" ");
        if (splitAuthorizationHeader.length != 2) {
            throw ApiError.UnauthorizedError();
        }
        if (splitAuthorizationHeader[0] != "Bearer") {
            throw ApiError.UnauthorizedError();
        }
        const accessToken = splitAuthorizationHeader[1];
        const userData = tokensService.validateAccessToken(accessToken);
        if (!userData) {
            throw ApiError.UnauthorizedError();
        }
        res.locals.userData = userData;
        next();
    } catch (error) {
        next(error);
    }
};
