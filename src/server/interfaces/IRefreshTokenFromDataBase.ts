export default interface IRefreshTokenFromDataBase {
    refresh_token_id: number;
    refresh_token: string;
    expires_date: string;
    user_id: number;
}
