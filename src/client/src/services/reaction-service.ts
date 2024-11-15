import $api from "../http";
import IGetReaction from "../interfaces/IResponses/IGetReaction";

export default class ReactionService {
    static async getReactionsByPostId(postId: number) {
        return await $api.get<{ reactions: IGetReaction[] }>(
            `/reaction/${postId}`
        );
    }

    static async newReaction(postId: number) {
        return await $api.post<IGetReaction>("/reaction", { postId });
    }

    static async deleteReaction(postId: number) {
        return await $api.delete<IGetReaction>(`/reaction/${postId}`);
    }
}
