import INewPost from "../interfaces/INewPost";
import db from "../db";
import IPostFromDataBase from "../interfaces/IPostFromDataBase";
import PostDto from "../dtos/post-dto";
import userService from "./user-service";
import ApiError from "../exceptions/ApiError";
import dateTimeService from "./dateTime-service";

class PostService {
    async newPost(newPost: INewPost, authorId: number) {
        if (!(await userService.userIsExistsById(authorId))) {
            throw ApiError.BadRequest("User with this id aren't exist");
        }

        const nowFormattedDateTime = dateTimeService.getNowDate();

        const postFromDataBase: IPostFromDataBase = (
            await db.query(
                `INSERT INTO posts (content, publication_date_time, post_author_id) VALUES ($1, $2, $3) RETURNING *`,
                [newPost.content, nowFormattedDateTime, authorId]
            )
        ).rows[0];

        postFromDataBase.publication_date_time = dateTimeService.formatDateTime(
            postFromDataBase.publication_date_time
        );

        return new PostDto(postFromDataBase);
    }

    async getPostsByUserId(userId: number) {
        if (!(await userService.userIsExistsById(userId))) {
            throw ApiError.BadRequest("User with this id aren't exist");
        }
        if (await userService.userIsExistsById(userId)) {
            const posts: IPostFromDataBase[] = (
                await db.query(
                    `SELECT * FROM posts WHERE post_author_id = $1`,
                    [userId]
                )
            ).rows;
            return posts.map((post) => {
                post.publication_date_time = dateTimeService.formatDateTime(
                    post.publication_date_time
                );
                return new PostDto(post);
            });
        }
        throw ApiError.BadRequest("User with this id aren't exists");
    }

    async deletePostById(postId: number) {
        if (await this.postIsExistsById(postId)) {
            const post: IPostFromDataBase = (
                await db.query(
                    "DELETE FROM posts WHERE post_id = $1 RETURNING *",
                    [postId]
                )
            ).rows[0];
            post.publication_date_time = dateTimeService.formatDateTime(
                post.publication_date_time
            );
            return new PostDto(post);
        }
        throw ApiError.BadRequest("Post with this id aren't found");
    }

    async postIsExistsById(postId: number) {
        const postById: IPostFromDataBase[] = (
            await db.query(`SELECT * FROM posts WHERE post_id = $1`, [postId])
        ).rows;
        if (postById.length == 0) {
            return false;
        }
        return true;
    }
}

export default new PostService();
