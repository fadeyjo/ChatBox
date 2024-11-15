import $api from "../http";
import IGetSubscribers from "../interfaces/IResponses/IGetSubscribers";

export default class SubscribersPageOwnersService {
    static async getSubscribersByUserId(userId: number) {
        return await $api.get<{ subscribersPageOwners: IGetSubscribers[] }>(
            `/subscribersPageOwners/subscribers/${userId}`
        );
    }

    static async getSubscribesByUserId(userId: number) {
        return await $api.get<{ subscribersPageOwners: IGetSubscribers[] }>(
            `/subscribersPageOwners/subscribes/${userId}`
        );
    }
}
