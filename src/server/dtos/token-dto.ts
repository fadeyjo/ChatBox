import IRefreshTokenFromDataBase from "../interfaces/IRefreshTokenFromDataBase";

export default class TokenDto {
    refreshTokenId: number;
    refreshToken: string;
    expiresDate: string;
    userId: number;

    constructor(token: IRefreshTokenFromDataBase) {
        this.refreshTokenId = token.refresh_token_id;
        this.refreshToken = token.refresh_token;
        this.expiresDate = token.expires_date;
        this.userId = token.user_id;
    }
}
