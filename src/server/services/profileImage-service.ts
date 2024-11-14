import dateTimeService from "./dateTime-service";
import db from "../db";
import IProfileImageFromDataBase from "../interfaces/IProfileImageFromDataBase";
import ProfileImageDto from "../dtos/profileImage-dto";
import ApiError from "../exceptions/ApiError";

class ProfileImageService {
    async newProfileImage(file: Express.Multer.File, userId: number) {
        const mimeType = file.mimetype;
        if (!["image/jpeg", "image/jpg", "image/png"].includes(mimeType)) {
            throw ApiError.BadRequest("Incorrect file format");
        }
        const imageBuffer = file.buffer;

        const nowFormattedDateTime = dateTimeService.getNowDate();

        const profileImageData: IProfileImageFromDataBase =
            !(await this.profileImageExistsByUserId(userId))
                ? (
                      await db.query(
                          "INSERT INTO profile_images (date_time_publication, image_data, mime_type, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
                          [nowFormattedDateTime, imageBuffer, mimeType, userId]
                      )
                  ).rows[0]
                : await db.query(
                      "UPDATE profile_images SET date_time_publication = $1, image_data = $2, mime_type = $3 WHERE user_id = $4 RETURNING *",
                      [nowFormattedDateTime, imageBuffer, mimeType, userId]
                  );
        return new ProfileImageDto(profileImageData);
    }

    async getProfileImage(userId: number) {
        if (!(await this.profileImageExistsByUserId(userId))) {
            throw ApiError.ResourseNotFound();
        }
        const profileImageData: IProfileImageFromDataBase = (
            await db.query("SELECT * FROM profile_images WHERE user_id = $1", [
                userId,
            ])
        ).rows[0];
        const data = profileImageData.image_data;
        const base64Image = data.toString("base64");
        return { base64Image, mimeType: profileImageData.mime_type };
    }

    async profileImageExistsByUserId(userId: number) {
        const profileImage: IProfileImageFromDataBase[] = (
            await db.query("SELECT * FROM profile_images WHERE user_id = $1", [
                userId,
            ])
        ).rows;
        if (profileImage.length === 0) {
            return false;
        }
        return true;
    }
}

export default new ProfileImageService();
