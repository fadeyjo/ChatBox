import $api from "../http";
import ILogin from "../interfaces/IRequests/ILogin";
import IRegistration from "../interfaces/IRequests/IRegistration";
import IToken from "../interfaces/IResponses/IToken";
import IUser from "../interfaces/IResponses/IUser";

export default class UserService {
    static async registration(newUser: IRegistration) {
        return await $api.post<IUser>("/user/registration", { ...newUser });
    }

    static async login(user: ILogin) {
        return await $api.post<IUser>("/user/login", { ...user });
    }

    static async logout() {
        return await $api.delete<IToken>("/user/logout");
    }

    static async getUserById(userId: number) {
        return await $api.get<IUser>(`/user/${userId}`);
    }

    static async getAllUsers() {
        return await $api.get<{ users: IUser[] }>("/user/all");
    }

    static async setStatus(isOnline: boolean) {
        return await $api.put<IUser>("/user", { isOnline });
    }

    static async getStatus(userId: number) {
        return await $api.get<{ isOnline: boolean }>(`/user/online/${userId}`);
    }
}
