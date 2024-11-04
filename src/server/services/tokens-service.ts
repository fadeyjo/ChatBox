import { sign, verify } from "jsonwebtoken";
import IUserJWTPayload from "../interfaces/IUserJWTPayload";
import db from "../db";
import IRefreshTokenFromDataBase from "../interfaces/IRefreshTokenFromDataBase";

class TokenService {
    generateTokens(payload: IUserJWTPayload): {
        accessToken: string;
        refreshToken: string;
    } {
        const accessToken = sign(
            payload,
            String(process.env.SECRET_ACCESS_KEY),
            {
                expiresIn: process.env.LIVING_TIME_ACCESS_TOKEN,
            }
        );
        const refreshToken = sign(
            payload,
            String(process.env.SECRET_REFRESH_KEY),
            {
                expiresIn: process.env.LIVING_TIME_REFRESH_TOKEN,
            }
        );
        return { accessToken, refreshToken };
    }

    async saveToken(userId: number, refreshToken: string) {
        const refreshTokenFromDb = await this.getRefreshTokenByUserId(userId);
        if (refreshTokenFromDb) {
            await db.query(
                `UPDATE refresh_tokens SET refresh_token = $1 WHERE user_id = $2`,
                [refreshToken, userId]
            );
        } else {
            await db.query(
                `INSERT INTO refresh_tokens (refresh_token, user_id) VALUES ($1, $2)`,
                [refreshToken, userId]
            );
        }
    }

    async getRefreshTokenByUserId(userId: number) {
        const refreshToken: IRefreshTokenFromDataBase[] = (
            await db.query(`SELECT * FROM refresh_tokens WHERE user_id = $1`, [
                userId,
            ])
        ).rows;
        if (refreshToken.length == 0) {
            return null;
        }
        return refreshToken[0];
    }

    validateAccessToken(accessToken: string) {
        try {
          const userData = verify(
            accessToken,
            String(process.env.SECRET_ACCESS_KEY)
          );
          return userData;
        } catch (error) {
          return null;
        }
      }

    // async refresh(refreshToken: string): Promise<{
    //     accessToken: string;
    //     refreshToken: string;
    //     userData: UserDto;
    // }> {
    //     const userData = this.#validateRefreshToken(refreshToken);
    //     const refreshTokenFromDb = await this.#getRefreshTokenFromDb(
    //         refreshToken
    //     );
    //     if (!userData || !refreshTokenFromDb) {
    //         throw ApiError.UnauthorizedError();
    //     }
    //     const userByRefresh = await userService.getUserById(
    //         refreshTokenFromDb.user_id
    //     );
    //     if (!userByRefresh) {
    //         throw ApiError.UnauthorizedError();
    //     }
    //     const newTokens = this.generateTokens({
    //         userId: userByRefresh.user_id,
    //         email: userByRefresh.email,
    //     });
    //     await this.saveToken(userByRefresh.user_id, newTokens.refreshToken);
    //     return {
    //         accessToken: newTokens.accessToken,
    //         refreshToken: newTokens.refreshToken,
    //         userData: new UserDto({ ...userByRefresh }),
    //     };
    // }
}

export default new TokenService();
