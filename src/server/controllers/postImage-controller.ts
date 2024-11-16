import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError";
import postImageService from "../services/postImage-service";
import INewPostImage from "../interfaces/INewPostImage";

class PostImageController {
    async newPostImages(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("");
            }
            const { postId }: INewPostImage = req.body;
            const files = req.files as Express.Multer.File[];
            const postImages = await postImageService.newPostImages(
                files,
                postId
            );
            res.json({ postImages });
        } catch (error) {
            next(error);
        }
    }

    async getPostImages(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Incorrect post id format");
            }
            const postId = Number(req.params.postId);
            const postImages = (
                await postImageService.getPostImages(postId)
            ).map(
                (postImage) =>
                    `data:${postImage.mimeType};base64,${postImage.base64Image}`
            );
            res.json({
                postImages,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new PostImageController();
