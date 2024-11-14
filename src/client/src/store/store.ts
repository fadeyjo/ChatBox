import { makeAutoObservable } from "mobx";
import IUser from "../interfaces/IResponses/IUser";
import IRegistration from "../interfaces/IRequests/IRegistration";
import UserService from "../services/user-service";
import { API_URL } from "../http";
import ILogin from "../interfaces/IRequests/ILogin";
import CodeService from "../services/code-service";
import { Dispatch } from "react";
import IRefresh from "../interfaces/IResponses/IRefresh";
import axios from "axios";

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

    async registration(
        newUser: IRegistration,
        setError: (error: string) => void,
        setIsOpened: (isOpened: boolean) => void,
        setEmail: (email: string) => void
    ) {
        try {
            const response = await UserService.registration(newUser);
            setIsOpened(true);
            setEmail(response.data.email);
            setError("");
        } catch (error: any) {
            const errorsData = error.response.data.errors;
            if (errorsData.length != 0) {
                const path = errorsData[0].path;
                if (path == "lastName") {
                    setError("Incorrect last name format");
                } else if (path == "firstName") {
                    setError("Incorrect first name format");
                } else if (path == "patronymic") {
                    setError("Incorrect patronymic format");
                } else if (path == "email") {
                    setError("Incorrect email format");
                } else if (path == "nickname") {
                    setError("Incorrect nickname format");
                } else if (path == "password") {
                    setError("Incorrect password format");
                } else {
                    setError("Incorrect repeat password format");
                }
                return;
            }
            setError(error.response.data.message);
        }
    }

    async login(
        user: ILogin,
        setError: (error: string) => void,
        setIsOpened: (isOpened: boolean) => void,
        setEmail: (email: string) => void
    ) {
        try {
            const response = await UserService.login(user);
            setIsOpened(true);
            setEmail(response.data.email);
            setError("");
        } catch (error: any) {
            const errorsData = error.response.data.errors;
            if (errorsData.length != 0) {
                const path = errorsData[0].path;
                if (path == "email") {
                    setError("Incorrect email format");
                } else {
                    setError("Incorrect password format");
                }
                return;
            }
            setError(error.response.data.message);
        }
    }

    async logout() {
        try {
            const response = await UserService.logout();
            localStorage.removeItem("accessToken");
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }

    async checkCode(
        email: string,
        code: number,
        refs: (HTMLInputElement | null)[],
        setError: (error: string) => void,
        clearInputs: () => void
    ) {
        try {
            const response = await CodeService.checkCode(email, code);
            const data = response.data;
            this.setAuth(true);
            this.setUser({
                userId: data.userId,
                lastName: data.lastName,
                firstName: data.firstName,
                patronymic: data.patronymic,
                email: data.email,
                nickname: data.nickname,
                hashedPassword: data.hashedPassword,
            });
            localStorage.setItem("accessToken", data.accessToken);
        } catch (error: any) {
            for (let i = 0; i < refs.length; i++) {
                if (refs[i]) {
                    clearInputs();
                }
            }
            if (refs[0]) {
                refs[0].focus();
            }

            if (error.response.data.errors.length != 0) {
                const errorData = error.response.data.errors[0].path;
                if (errorData == "email") {
                    setError("Incorrect email format");
                } else {
                    setError("Incorrect code format");
                }
                return;
            }
            setError(error.response.data.message);
        }
    }

    async checkAuthorization() {
        try {
            const response = await axios.get<IRefresh>(
                `${API_URL}/api/user/refresh`,
                {
                    withCredentials: true,
                }
            );
            const data = response.data;
            localStorage.setItem("accessToken", data.accessToken);
            this.setAuth(true);
            this.setUser({
                userId: data.userData.userId,
                lastName: data.userData.lastName,
                firstName: data.userData.firstName,
                patronymic: data.userData.patronymic,
                email: data.userData.email,
                nickname: data.userData.nickname,
                hashedPassword: data.userData.hashedPassword,
            });
        } catch (error: any) {
            console.log(error);
        }
    }
}
