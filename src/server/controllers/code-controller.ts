import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError";
import ICheckCode from "../interfaces/ICheckCode";
import activationCodeService from "../services/activationCode-service";
import tokensService from "../services/tokens-service";

class CodeController {
    async checkCode(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect input", errors.array());
            }
            const { email, code }: ICheckCode = req.body;
            const userData = await activationCodeService.checkCode(email, code);
            const tokens = tokensService.generateTokens({
                email,
                userId: userData.userId,
            });
            await tokensService.saveToken(userData.userId, tokens.refreshToken);
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                maxAge:
                    Number(process.env.LIVING_TIME_REFRESH_TOKEN_COOKIE) ||
                    2592000000,
            }).json({
                ...userData,
                ...tokens,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new CodeController();
