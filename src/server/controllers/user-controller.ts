import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import userService from "../services/user-service";
import IRegistrationUserBody from "../interfaces/IRegistrationUserBody";
import ApiError from "../exceptions/ApiError";
import mailService from "../services/mail-service";
import ILoginingUser from "../interfaces/ILoginingUser";
import tokensService from "../services/tokens-service";
import { config } from "dotenv";
import profileImageService from "../services/profileImage-service";
import { basename, dirname, extname, join } from "path";
import { createReadStream, readFileSync } from "fs";

config();

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
                    "Different passwords have been entered"
                );
            }
            const newUserResponse = await userService.registration(newUser);
            await mailService.sendCode(
                newUserResponse.email,
                newUserResponse.userId
            );

            const filePath = join(__dirname, "../public/defaultProfileImage.png");

            const fileBuffer = readFileSync(filePath);

            const ext = extname(filePath).toLowerCase();
            let mimeType = "";
            if (ext === ".jpg") {
                mimeType = "image/jpg";
            } else if (ext === ".png") {
                mimeType = "image/png";
            } else if (ext === ".jpeg") {
                mimeType = "image/jpeg";
            } else {
                throw ApiError.BadRequest("Unsupported file type");
            }

            const file: Express.Multer.File = {
                fieldname: "image",
                originalname: basename(filePath),
                encoding: "7bit",
                mimetype: mimeType,
                buffer: fileBuffer,
                size: fileBuffer.length,
                stream: createReadStream(filePath),
                destination: dirname(filePath),
                filename: basename(filePath),
                path: filePath,
            };
            await profileImageService.newProfileImage(
                file,
                newUserResponse.userId
            );

            res.json({ ...newUserResponse });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("login")
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

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers();
            res.json({ users });
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
            res.cookie("refreshToken", userData.refreshToken, {
                httpOnly: true,
                // secure: true,
                // sameSite: "none",
                maxAge:
                    Number(process.env.LIVING_TIME_REFRESH_TOKEN_COOKIE) ||
                    2592000000,
            }).json({
                ...userData,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
