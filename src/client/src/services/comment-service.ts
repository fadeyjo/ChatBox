import $api from "../http";
import IGetComment from "../interfaces/IResponses/IGetComment";

export default class CommentService {
    static async getCommentsByPostId(postId: number) {
        return await $api.get<{ comments: IGetComment[] }>(
            `/comment/${postId}`
        );
    }

    static async newComment(content: string, postId: number) {
        return await $api.post<IGetComment>("/comment", { postId, content });
    }
}
