import $api from "../http";
import IUserRefreshTokens from "../interfaces/IResponses/IUserRefreshTokens";

export default class CodeService {
    static async checkCode(email: string, code: number) {
        return await $api.post<IUserRefreshTokens>("/code", { email, code });
    }
}
