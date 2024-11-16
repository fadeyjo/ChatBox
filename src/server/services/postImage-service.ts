import ApiError from "../exceptions/ApiError";
import postService from "./post-service";
import db from "../db";
import IPostImageFromDataBase from "../interfaces/IPostImageFromDataBase";
import PostImageDto from "../dtos/postImage-dto";

class PostImageService {
    async newPostImages(files: Express.Multer.File[], postId: number) {
        if (!(await postService.postIsExistsById(postId))) {
            throw ApiError.BadRequest("Post with this id isn't found");
        }
        const permittedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
        for (let i = 0; i < files.length; i++) {
            if (!permittedMimeTypes.includes(files[i].mimetype)) {
                throw ApiError.BadRequest("Incorrect file format");
            }
        }
        const imagesData: IPostImageFromDataBase[] = [];
        for (let i = 0; i < files.length; i++) {
            imagesData.push(
                (
                    await db.query(
                        "INSERT INTO post_images (image_data, mime_type, post_id) VALUES ($1, $2, $3) RETURNING *",
                        [files[i].buffer, files[i].mimetype, postId]
                    )
                ).rows[0]
            );
        }
        return imagesData.map((postImage) => new PostImageDto(postImage));
    }

    async getPostImages(postId: number) {
        if (!(await postService.postIsExistsById(postId))) {
            throw ApiError.BadRequest("Post isn't found");
        }
        const postImagesData: IPostImageFromDataBase[] = (
            await db.query("SELECT * FROM post_images WHERE post_id = $1", [
                postId,
            ])
        ).rows;
        return postImagesData.map((postImage) => {
            const data = postImage.image_data;
            const base64Image = data.toString("base64");
            return { base64Image, mimeType: postImage.mime_type };
        });
    }
}

export default new PostImageService();
