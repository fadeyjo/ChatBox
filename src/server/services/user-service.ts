import IRegistrationUserBody from "../interfaces/IRegistrationUserBody";
import IUserFromDataBase from "../interfaces/IUserFromDataBase";
import db from "../db";
import { compare, hash } from "bcrypt";
import UserDto from "../dtos/user-dto";
import ApiError from "../exceptions/ApiError";
import ILoginingUser from "../interfaces/ILoginingUser";

class UserService {
    async registration(newUser: IRegistrationUserBody) {
        const userByEmail = await this.getUserByEmail(newUser.email);
        if (userByEmail) {
            throw ApiError.BadRequest("User with this email already exists");
        }
        const userByNickname = await this.getUserByNickname(newUser.nickname);
        if (userByNickname) {
            throw ApiError.BadRequest("User with this nickname already exists");
        }
        const userData = await this.insertNewUser(newUser);
        return userData;
    }

    async login(loginingUser: ILoginingUser) {
        const userByEmail = await this.getUserByEmail(loginingUser.email);
        if (!userByEmail) {
            throw ApiError.BadRequest("No user with this email address");
        }
        if (
            !(await compare(loginingUser.password, userByEmail.hashed_password))
        ) {
            throw ApiError.BadRequest("Invalid password");
        }
        return new UserDto(userByEmail);
    }

    async getUserByEmail(email: string) {
        const userByEmail: IUserFromDataBase[] = (
            await db.query(`SELECT * FROM users WHERE email = $1`, [email])
        ).rows;
        if (userByEmail.length == 0) {
            return null;
        }
        return userByEmail[0];
    }

    async getUserByNickname(nickname: string) {
        const userByNickname: IUserFromDataBase[] = (
            await db.query(`SELECT * FROM users WHERE nickname = $1`, [
                nickname,
            ])
        ).rows;
        if (userByNickname.length == 0) {
            return null;
        }
        return userByNickname[0];
    }

    async getUserById(userId: number) {
        const userById: IUserFromDataBase[] = (
            await db.query(`SELECT * FROM users WHERE user_id = $1`, [userId])
        ).rows;
        if (userById.length == 0) {
            throw ApiError.ResourseNotFound();
        }
        return new UserDto(userById[0]);
    }

    async insertNewUser({
        lastName,
        firstName,
        patronymic,
        email,
        nickname,
        password,
    }: IRegistrationUserBody) {
        const userData: IUserFromDataBase = (
            await db.query(
                `INSERT INTO users (last_name, first_name, patronymic, email, nickname, hashed_password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [
                    lastName,
                    firstName,
                    patronymic,
                    email,
                    nickname,
                    await hash(password, Number(process.env.HASH_SALT)),
                ]
            )
        ).rows[0];
        return new UserDto(userData);
    }

    async userIsExistsById(userId: number) {
        const userById: IUserFromDataBase[] = (
            await db.query(`SELECT * FROM users WHERE user_id = $1`, [userId])
        ).rows;
        if (userById.length == 0) {
            return false;
        }
        return true;
    }

    async getAllUsers() {
        const users: IUserFromDataBase[] = (
            await db.query("SELECT * FROM users", [])
        ).rows;
        return users.map((user) => new UserDto(user));
    }

    async setStatus(isOnline: boolean, userId: number) {
        if (!(await this.userIsExistsById(userId))) {
            throw ApiError.BadRequest("User isn't found");
        }
        const userData: IUserFromDataBase = (
            await db.query(
                "UPDATE users SET is_online = $1 WHERE user_id = $2 RETURNING *",
                [isOnline, userId]
            )
        ).rows[0];
        return new UserDto(userData);
    }

    async getStatus(userId: number) {
        if (!(await this.userIsExistsById(userId))) {
            throw ApiError.BadRequest("User isn't found");
        }
        const { is_online }: { is_online: boolean | null } = (
            await db.query("SELECT is_online FROM users WHERE user_id = $1", [
                userId,
            ])
        ).rows[0];
        return { isOnline: is_online };
    }
}

export default new UserService();
