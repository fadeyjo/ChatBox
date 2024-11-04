import ApiError from "../exceptions/ApiError";
import userService from "./user-service";
import db from "../db";
import IFriendShipFromDataBase from "../interfaces/IFriendShipFromDataBase";
import FriendshipDto from "../dtos/friendship-dto";

class FriendshipService {
    async newFriendShip(firstFriendId: number, secondFriendId: number) {
        if (!(await userService.userIsExistsById(firstFriendId))) {
            throw ApiError.BadRequest("First friend id isn't found");
        }
        if (!(await userService.userIsExistsById(secondFriendId))) {
            throw ApiError.BadRequest("Second friend id isn't found");
        }
        if (await this.friendShipIsExist(firstFriendId, secondFriendId)) {
            throw ApiError.BadRequest("This friendship already exists");
        }
        const friendshipData: IFriendShipFromDataBase = (
            await db.query(
                "INSERT INTO friendships (first_friend_id, second_friend_id) VALUES ($1, $2) RETURNING *",
                [firstFriendId, secondFriendId]
            )
        ).rows[0];
        return new FriendshipDto(friendshipData);
    }

    async getFriendships(firstFriendId: number) {
        if (!(await userService.userIsExistsById(firstFriendId))) {
            throw ApiError.BadRequest("First friend id isn't found");
        }
        const friendships: IFriendShipFromDataBase[] = (
            await db.query(
                "SELECT * FROM friendships WHERE first_friend_id = $1 OR second_friend_id = $1",
                [firstFriendId]
            )
        ).rows;
        return friendships.map((friendship) => new FriendshipDto(friendship));
    }

    async deleteFriendship(firstFriendId: number, secondFriendId: number) {
        if (!(await userService.userIsExistsById(firstFriendId))) {
            throw ApiError.BadRequest("First friend id isn't found");
        }
        if (!(await userService.userIsExistsById(firstFriendId))) {
            throw ApiError.BadRequest("Second friend id isn't found");
        }
        if (!(await this.friendShipIsExist(firstFriendId, secondFriendId))) {
            throw ApiError.BadRequest("This friendship isn't found");
        }
        const friendshipData: IFriendShipFromDataBase = (
            await db.query(
                "DELETE FROM friendships WHERE (first_friend_id = $1 AND second_friend_id = $2) OR (first_friend_id = $2 AND second_friend_id = $1) RETURNING *",
                [firstFriendId, secondFriendId]
            )
        ).rows[0];
        return new FriendshipDto(friendshipData);
    }

    async friendShipIsExist(firstFriendId: number, secondFriendId: number) {
        const friendshipData: IFriendShipFromDataBase[] = (
            await db.query(
                "SELECT * FROM friendships WHERE (first_friend_id = $1 AND second_friend_id = $2) OR (first_friend_id = $2 AND second_friend_id = $1)",
                [firstFriendId, secondFriendId]
            )
        ).rows;
        if (friendshipData.length == 0) {
            return false;
        }
        return true;
    }
}

export default new FriendshipService();
