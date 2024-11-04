import ApiError from "../exceptions/ApiError";
import postService from "./post-service";
import userService from "./user-service";
import db from "../db";
import dateTimeService from "./dateTime-service";
import IRepostFromDataBase from "../interfaces/IRepostFromDataBase";
import RepostDto from "../dtos/repost-dto";

class RepostService {
    async newRepost(postId: number, repostAuthorId: number) {
        if (!(await postService.postIsExistsById(postId))) {
            throw ApiError.BadRequest("Author with this id isn't found");
        }
        if (!(await userService.userIsExistsById(repostAuthorId))) {
            throw ApiError.BadRequest("Post with this id isn't found");
        }

        const nowFormattedDateTime = dateTimeService.getNowDate();

        const repostData: IRepostFromDataBase = (
            await db.query(
                "INSERT INTO reposts (repost_date_time, post_id, repost_author_id) VALUES ($1, $2, $3) RETURNING *",
                [nowFormattedDateTime, postId, repostAuthorId]
            )
        ).rows[0];
        repostData.repost_date_time = dateTimeService.formatDateTime(
            repostData.repost_date_time
        );
        return new RepostDto(repostData);
    }

    async getRepostsByUserId(authorId: number) {
        if (!(await userService.userIsExistsById(authorId))) {
            throw ApiError.BadRequest("Author with this id isn't found");
        }
        const reposts: IRepostFromDataBase[] = (
            await db.query(
                "SELECT * FROM reposts WHERE repost_author_id = $1",
                [authorId]
            )
        ).rows;
        return reposts.map((repost) => {
            repost.repost_date_time = dateTimeService.formatDateTime(
                repost.repost_date_time
            );
            return new RepostDto(repost);
        });
    }

    async deleteRepost(repostId: number) {
        if (!(await this.repostIsExistById(repostId))) {
            throw ApiError.BadRequest("Repost with this id isn't found");
        }
        const repostData: IRepostFromDataBase = (
            await db.query("DELETE FROM reposts WHERE repost_id = $1", [
                repostId,
            ])
        ).rows[0];
        return new RepostDto(repostData);
    }

    async repostIsExistById(repostId: number) {
        const repostData: IRepostFromDataBase[] = (
            await db.query("SELECT * FROM reposts WHERE repost_id = $1", [
                repostId,
            ])
        ).rows;
        if (repostData.length == 0) {
            return false;
        }
        return true;
    }
}

export default new RepostService();
