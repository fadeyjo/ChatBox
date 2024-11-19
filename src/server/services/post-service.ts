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
        if (
            newPost.childrenPostId &&
            !(await this.postIsExistsById(newPost.childrenPostId))
        ) {
            throw ApiError.BadRequest("Children post isn't found");
        }

        const nowFormattedDateTime = dateTimeService.getNowDate();

        const postFromDataBase: IPostFromDataBase = (
            await db.query(
                `INSERT INTO posts (content, publication_date_time, children_post_id, post_author_id) VALUES ($1, $2, $3, $4) RETURNING *`,
                [
                    newPost.content,
                    nowFormattedDateTime,
                    newPost.childrenPostId,
                    authorId,
                ]
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

    async getPostById(postId: number) {
        if (!(await this.postIsExistsById(postId))) {
            throw ApiError.ResourseNotFound();
        }
        const postData: IPostFromDataBase = (
            await db.query("SELECT * FROM posts WHERE post_id = $1", [postId])
        ).rows[0];
        postData.publication_date_time = dateTimeService.formatDateTime(
            postData.publication_date_time
        );
        return new PostDto(postData);
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

    async getPostsByChildrenPostId(childrenPostId: number) {
        if (!(await this.postIsExistsById(childrenPostId))) {
            throw ApiError.BadRequest("Children post isn't found");
        }
        const posts: IPostFromDataBase[] = (
            await db.query("SELECT * FROM posts WHERE children_post_id = $1", [
                childrenPostId,
            ])
        ).rows;
        return posts.map((post) => {
            post.publication_date_time = dateTimeService.formatDateTime(
                post.publication_date_time
            );
            return new PostDto(post);
        });
    }

    async getPostIdsByAuthorId(authorId: number) {
        if (!(await userService.userIsExistsById(authorId))) {
            throw ApiError.BadRequest("Author id isn't found");
        }
        const ids: number[] = (
            await db.query(
                "SELECT post_id FROM posts WHERE post_author_id = $1",
                [authorId]
            )
        ).rows;
        return ids;
    }
}

export default new PostService();
