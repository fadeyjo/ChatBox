import IUser from "./IUser";

export default interface IRefresh {
    accessToken: string;
    refreshToken: string;
    userData: IUser;
}
