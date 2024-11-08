import db from "../db";
import UserDto from "../dtos/user-dto";
import ApiError from "../exceptions/ApiError";
import ICodeFromDataBase from "../interfaces/ICodeFromDataBase";
import userService from "./user-service";

class ActivationCodeService {
    generateCode() {
        return Math.floor(Math.random() * 900000 + 100000);
    }

    static async findActivationCodeByUserId(userId: number) {
        const code: ICodeFromDataBase[] = (
            await db.query(
                `SELECT * FROM activation_codes WHERE user_id = $1`,
                [userId]
            )
        ).rows;
        if (code.length == 0) {
            return null;
        }
        return code[0];
    }

    async saveCode(code: number, userId: number) {
        const codeFromDb =
            await ActivationCodeService.findActivationCodeByUserId(userId);
        if (!codeFromDb) {
            await db.query(
                `INSERT INTO activation_codes (activation_code, user_id) VALUES ($1, $2)`,
                [code, userId]
            );
        } else {
            await db.query(
                `UPDATE activation_codes SET activation_code = $1 WHERE user_id = $2`,
                [code, userId]
            );
        }
    }

    async checkCode(email: string, code: number) {
        const userByEmail = await userService.getUserByEmail(email);
        if (!userByEmail) {
            throw ApiError.BadRequest("User with this email aren't exist");
        }
        if (code != (await this.getCodeByUserId(userByEmail.user_id))) {
            throw ApiError.BadRequest("Wrong code");
        }
        return new UserDto(userByEmail)
    }

    async getCodeByUserId(userId: number) {
        const codeFromDatabase: ICodeFromDataBase = (
            await db.query(
                `SELECT * FROM activation_codes WHERE user_id = $1`,
                [userId]
            )
        ).rows[0];
        return codeFromDatabase.activation_code;
    }
}

export default new ActivationCodeService();
