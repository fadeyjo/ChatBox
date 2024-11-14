import $api from "../http";
import IGetFriendship from "../interfaces/IResponses/IGetFriendship";

export default class FriendshipService {
    static async getFriendshipsByUserId(userId: number) {
        return await $api.get<{ friendships: IGetFriendship[] }>(`/friendship/${userId}`);
    }
}
