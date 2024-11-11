import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import userService from "../services/user-service";
import IRegistrationUserBody from "../interfaces/IRegistrationUserBody";
import ApiError from "../exceptions/ApiError";
import mailService from "../services/mail-service";
import ILoginingUser from "../interfaces/ILoginingUser";
import tokensService from "../services/tokens-service";

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Ivalid input", errors.array());
            }
            const newUser: IRegistrationUserBody = req.body;
            if (newUser.password != newUser.repeatPassword) {
                throw ApiError.BadRequest(
                    "Passwords aren't equal",
                    errors.array()
                );
            }
            const newUserResponse = await userService.insertNewUser(newUser);
            await mailService.sendCode(
                newUserResponse.email,
                newUserResponse.userId
            );
            res.json({ ...newUserResponse });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect input", errors.array());
            }
            const loginingUser: ILoginingUser = req.body;
            const loginingUserResponse = await userService.login(loginingUser);
            await mailService.sendCode(
                loginingUserResponse.email,
                loginingUserResponse.userId
            );
            res.json({ ...loginingUserResponse });
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest(
                    "Refresh token is required in cookies",
                    errors.array()
                );
            }
            const refreshToken = String(req.cookies.refreshToken);
            const refreshTokenData = await tokensService.logout(refreshToken);
            res.clearCookie("refreshToken").json({ ...refreshTokenData });
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect userId", errors.array());
            }
            const userId = Number(req.params.userId);
            const userData = await userService.getUserById(userId);
            res.json({ ...userData });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.UnauthorizedError();
            }
            const refreshToken = String(req.cookies.refreshToken);
            const userData = await tokensService.refresh(refreshToken);
            res.cookie("refreshToken", userData.refreshToken).json({
                ...userData,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
