import ApiError from "../exceptions/ApiError";
import ISubscribersPageOwnersFromDataBase from "../interfaces/ISubscribersPageOwnersFromDataBase";
import userService from "./user-service";
import db from "../db";
import SubscribersPageOwnersDto from "../dtos/subscribersPageOwners-dto";

class SubscribersPageOwnersService {
    async newSubscribersPageOwners(subscriberId: number, pageOwnerId: number) {
        if (!(await userService.userIsExistsById(subscriberId))) {
            throw ApiError.BadRequest("Subscriber with this id isn't found");
        }
        if (!(await userService.userIsExistsById(pageOwnerId))) {
            throw ApiError.BadRequest("Page owner with this id isn't found");
        }
        if (
            await this.subscribersPageOwnersIsExist(subscriberId, pageOwnerId)
        ) {
            throw ApiError.BadRequest("Pair already exists");
        }
        const subscribersPageOwnersData: ISubscribersPageOwnersFromDataBase = (
            await db.query(
                "INSERT INTO subscribers_page_owners (subscriber_id, page_owner_id) VALUES ($1, $2) RETURNING *",
                [subscriberId, pageOwnerId]
            )
        ).rows[0];
        return new SubscribersPageOwnersDto(subscribersPageOwnersData);
    }

    async getSubscribersPageOwnersByPageOwnerId(pageOwnerId: number) {
        if (!(await userService.userIsExistsById(pageOwnerId))) {
            throw ApiError.BadRequest("Page owner with this id isn't found");
        }
        const subscribersPageOwners: ISubscribersPageOwnersFromDataBase[] = (
            await db.query(
                "SELECT * FROM subscribers_page_owners WHERE page_owner_id = $1",
                [pageOwnerId]
            )
        ).rows;
        return subscribersPageOwners.map(
            (subscribersPageOwners) =>
                new SubscribersPageOwnersDto(subscribersPageOwners)
        );
    }

    async deleteSubscribersPageOwners(
        subscriberId: number,
        pageOwnerId: number
    ) {
        if (!(await userService.userIsExistsById(subscriberId))) {
            throw ApiError.BadRequest("Subscriber with this id isn't found");
        }
        if (!(await userService.userIsExistsById(pageOwnerId))) {
            throw ApiError.BadRequest("Page owner with this id isn't found");
        }
        if (
            !(await this.subscribersPageOwnersIsExist(
                subscriberId,
                pageOwnerId
            ))
        ) {
            throw ApiError.BadRequest("Pair isn't found");
        }
        const subscribersPageOwnersData: ISubscribersPageOwnersFromDataBase = (
            await db.query(
                "DELETE FROM subscribers_page_owners WHERE subscriber_id = $1 AND page_owner_id = $2 RETURNING *",
                [subscriberId, pageOwnerId]
            )
        ).rows[0];
        return new SubscribersPageOwnersDto(subscribersPageOwnersData);
    }

    async getSubscribesBySubscriberId(subscriberId: number) {
        if (!(await userService.userIsExistsById(subscriberId))) {
            throw ApiError.BadRequest("Subscriber with this id isn't found");
        }
        const subscribesData: ISubscribersPageOwnersFromDataBase[] = (
            await db.query(
                "SELECT * FROM subscribers_page_owners WHERE subscriber_id = $1",
                [subscriberId]
            )
        ).rows;
        return subscribesData.map(
            (subscribersPageOwners) =>
                new SubscribersPageOwnersDto(subscribersPageOwners)
        );
    }

    async subscribersPageOwnersIsExist(
        subscriberId: number,
        pageOwnerId: number
    ) {
        const subscribersPageOwners: ISubscribersPageOwnersFromDataBase[] = (
            await db.query(
                "SELECT * FROM subscribers_page_owners WHERE subscriber_id = $1 AND page_owner_id = $2",
                [subscriberId, pageOwnerId]
            )
        ).rows;
        if (subscribersPageOwners.length == 0) {
            return false;
        }
        return true;
    }
}

export default new SubscribersPageOwnersService();
