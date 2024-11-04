import ApiError from "../exceptions/ApiError";
import IReactionFromDatabase from "../interfaces/IReactionFromDatabase";
import postService from "./post-service";
import userService from "./user-service";
import db from "../db";
import ReactionDto from "../dtos/reaction-dto";

class ReactionService {
    async newReaction(postId: number, userId: number) {
        if (!(await postService.postIsExistsById(postId))) {
            throw ApiError.BadRequest("Post with this id aren't exist");
        }
        if (!(await userService.userIsExistsById(userId))) {
            throw ApiError.BadRequest("User with this id aren't exist");
        }
        if (await this.reactionIsExists(postId, userId)) {
            throw ApiError.BadRequest("Reaction already exists");
        }
        const reactionData: IReactionFromDatabase = (
            await db.query(
                `INSERT INTO reactions (post_id, reaction_author_id) VALUES ($1, $2) RETURNING *`,
                [postId, userId]
            )
        ).rows[0];
        return new ReactionDto(reactionData);
    }

    async getReactionsByPostId(postId: number) {
        if (await postService.postIsExistsById(postId)) {
            const reactions: IReactionFromDatabase[] = (
                await db.query("SELECT * FROM reactions WHERE post_id = $1", [
                    postId,
                ])
            ).rows;
            return reactions.map((reaction) => new ReactionDto(reaction));
        }
        throw ApiError.BadRequest("Post with this id aren't exist");
    }

    async deleteReaction(postId: number, userId: number) {
        if (!(await postService.postIsExistsById(postId))) {
            throw ApiError.BadRequest("Post with this id aren't exist");
        }
        if (!(await userService.userIsExistsById(userId))) {
            throw ApiError.BadRequest("User with this id aren't exist");
        }
        if (!(await this.reactionIsExists(postId, userId))) {
            throw ApiError.BadRequest("Reaction aren't exist");
        }
        const reactionData: IReactionFromDatabase = (
            await db.query(
                `DELETE FROM reactions WHERE post_id = $1 AND reaction_author_id = $2 RETURNING *`,
                [postId, userId]
            )
        ).rows[0];
        return new ReactionDto(reactionData);
    }

    async reactionIsExists(postId: number, userId: number) {
        const reactionData: IReactionFromDatabase[] = (
            await db.query(
                "SELECT * FROM reactions WHERE post_id = $1 AND reaction_author_id = $2",
                [postId, userId]
            )
        ).rows;
        if (reactionData.length == 0) {
            return false;
        }
        return true;
    }
}

export default new ReactionService();
