import ISubscribersPageOwnersFromDataBase from "../interfaces/ISubscribersPageOwnersFromDataBase";

export default class SubscribersPageOwnersDto {
    subscriberPageOwnerId: number;
    subscriberId: number;
    pageOwnerId: number;

    constructor(subscribersPageOwners: ISubscribersPageOwnersFromDataBase) {
        this.subscriberPageOwnerId =
            subscribersPageOwners.subscriber_page_owner_id;
        this.subscriberId = subscribersPageOwners.subscriber_id;
        this.pageOwnerId = subscribersPageOwners.page_owner_id;
    }
}
