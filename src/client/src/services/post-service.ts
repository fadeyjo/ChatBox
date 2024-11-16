import $api from "../http";
import IGetPost from "../interfaces/IResponses/IGetPost";

export default class PostService {
    static async getPostsByUserId(userId: number) {
        return await $api.get<{ posts: IGetPost[] }>(`/post/posts/${userId}`);
    }

    static async getPostById(postId: number) {
        return await $api.get<IGetPost>(`/post/${postId}`);
    }

    static async getPostsByChildrenPostId(childrenPostId: number) {
        return await $api.get<{ posts: IGetPost[] }>(
            `/post/repost/${childrenPostId}`
        );
    }

    static async newPost(
        content: string,
        childrenPostId: number | null = null
    ) {
        return await $api.post<IGetPost>("/post", { content, childrenPostId });
    }

    static async deletePost(postId: number) {
        return await $api.delete<IGetPost>(`/post/${postId}`);
    }
}
