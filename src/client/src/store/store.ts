import { makeAutoObservable } from "mobx";
import IUser from "../interfaces/IResponses/IUser";
import IRegistration from "../interfaces/IRequests/IRegistration";
import UserService from "../services/user-service";
import { API_URL } from "../http";
import IRefreshTokens from "../interfaces/IResponses/IRefreshTokens";
import ILogin from "../interfaces/IRequests/ILogin";

export default class Store {
    user = {} as IUser;
    isAuth = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(isAuth: boolean) {
        this.isAuth = isAuth;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    async registration(newUser: IRegistration) {
        try {
            await UserService.registration(newUser);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }

    async login(user: ILogin) {
        try {
            await UserService.login(user);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }

    async logout() {
        try {
            await UserService.logout();
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }

    async checkAuthorization() {
        try {
            const response = await axios.get<IRefreshTokens>(
                `${API_URL}/api/user/refresh`,
                {
                    withCredentials: true,
                }
            );
            const data = response.data;
            localStorage.setItem("accessToken", data.accessToken);
            this.setAuth(true);
            this.setUser(data.user);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }
}
