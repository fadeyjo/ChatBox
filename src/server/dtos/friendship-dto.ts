import IFriendShipFromDataBase from "../interfaces/IFriendShipFromDataBase";

export default class FriendshipDto {
    friendshipId: number;
    firstFriendId: number;
    secondFriendId: number;

    constructor(friendship: IFriendShipFromDataBase) {
        this.friendshipId = friendship.friendship_id;
        this.firstFriendId = friendship.first_friend_id;
        this.secondFriendId = friendship.second_friend_id;
    }
}
