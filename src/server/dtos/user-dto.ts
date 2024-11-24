import IUserFromDataBase from "../interfaces/IUserFromDataBase";

export default class UserDto {
    userId: number;
    lastName: string;
    firstName: string;
    patronymic: string | null;
    email: string;
    nickname: string;
    hashedPassword: string;
    isOnline: boolean | null;

    constructor(user: IUserFromDataBase) {
        this.userId = user.user_id;
        this.lastName = user.last_name;
        this.firstName = user.first_name;
        this.patronymic = user.patronymic;
        this.email = user.email;
        this.nickname = user.nickname;
        this.hashedPassword = user.hashed_password;
        this.isOnline = user.is_online;
    }
}
