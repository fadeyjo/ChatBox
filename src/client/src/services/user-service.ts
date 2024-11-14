import $api from "../http";
import ILogin from "../interfaces/IRequests/ILogin";
import IRegistration from "../interfaces/IRequests/IRegistration";
import IToken from "../interfaces/IResponses/IToken";
import IUser from "../interfaces/IResponses/IUser";

export default class UserService {
    static async registration(newUser: IRegistration) {
        return $api.post<IUser>("/user/registration", { ...newUser });
    }

    static async login(user: ILogin) {
        return $api.post<IUser>("/user/login", { ...user });
    }

    static async logout() {
        return $api.delete<IToken>("/user/logout");
    }
}
