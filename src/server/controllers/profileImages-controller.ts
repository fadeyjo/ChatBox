import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError";
import profileImageService from "../services/profileImage-service";

class ProfileImagesController {
    async newProfileImage(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("", errors.array());
            }
            const file = req.file;
            if (!file) {
                throw ApiError.BadRequest("Not file downloaded");
            }
            const userId = Number(res.locals.userData.userId);
            const profileImageData = await profileImageService.newProfileImage(
                file,
                userId
            );
            res.json({ ...profileImageData });
        } catch (error) {
            next(error);
        }
    }

    async getProfileImage(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("", errors.array());
            }
            const userId = Number(req.params.userId);
            const base64Image = await profileImageService.getProfileImage(
                userId
            );
            res.json({
                src: `data:${base64Image.mimeType};base64,${base64Image.base64Image}`,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ProfileImagesController();
