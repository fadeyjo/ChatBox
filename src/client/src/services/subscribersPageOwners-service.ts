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

    static async newSubscribersPageOwners(
        subscriberId: number,
        pageOwnerId: number
    ) {
        return await $api.post<IGetSubscribers>("/subscribersPageOwners/", {
            subscriberId,
            pageOwnerId,
        });
    }

    static async deleteSubscribersPageOwners(
        subscriberId: number,
        pageOwnerId: number
    ) {
        return await $api.delete<IGetSubscribers>(
            `/subscribersPageOwners/${subscriberId}/${pageOwnerId}`
        );
    }
}
