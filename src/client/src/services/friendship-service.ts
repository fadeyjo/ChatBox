import $api from "../http";
import IGetFriendship from "../interfaces/IResponses/IGetFriendship";

export default class FriendshipService {
    static async getFriendshipsByUserId(userId: number) {
        return await $api.get<{ friendships: IGetFriendship[] }>(
            `/friendship/${userId}`
        );
    }

    static async newFriendShip(secondFriendId: number) {
        return await $api.post<IGetFriendship>("/friendship", {
            secondFriendId,
        });
    }

    static async deleteFriend(friendId: number) {
        return await $api.delete<IGetFriendship>(`/friendship/${friendId}`);
    }
}
