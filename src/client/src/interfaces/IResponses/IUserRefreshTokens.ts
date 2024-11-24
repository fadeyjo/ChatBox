export default interface IUserRefreshTokens {
    accessToken: string;
    refreshToken: string;
    userId: number;
    lastName: string;
    firstName: string;
    patronymic: string | null;
    email: string;
    nickname: string;
    hashedPassword: string;
    isOnline: boolean | null;
}
