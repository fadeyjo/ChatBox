import IUser from "./IUser";

export default interface IRefreshTokens {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}
