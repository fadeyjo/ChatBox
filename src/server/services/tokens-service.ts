import { sign, verify } from "jsonwebtoken";
import IUserJWTPayload from "../interfaces/IUserJWTPayload";
import db from "../db";
import IRefreshTokenFromDataBase from "../interfaces/IRefreshTokenFromDataBase";
import dateTimeService from "./dateTime-service";
import ApiError from "../exceptions/ApiError";
import TokenDto from "../dtos/token-dto";
import userService from "./user-service";
import UserDto from "../dtos/user-dto";

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
        const expiresDate = dateTimeService.getExpiresDate();
        if (refreshTokenFromDb) {
            await db.query(
                `UPDATE refresh_tokens SET refresh_token = $1, expires_date = $2 WHERE user_id = $3`,
                [refreshToken, expiresDate, userId]
            );
        } else {
            await db.query(
                `INSERT INTO refresh_tokens (refresh_token, expires_date, user_id) VALUES ($1, $2, $3)`,
                [refreshToken, expiresDate, userId]
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

    validateRefreshToken(refreshToken: string) {
        try {
            const userData = verify(
                refreshToken,
                String(process.env.SECRET_REFRESH_KEY)
            );
            return userData;
        } catch (error) {
            return null;
        }
    }

    async sheduleToken() {
        const refreshTokens = await this.getAllTokensFromDataBase();
        for (const token of refreshTokens) {
            if (
                dateTimeService.tokenIsExpires(
                    dateTimeService.formatDateTime(token.expires_date)
                )
            ) {
                await this.deleteTokenById(token.refresh_token_id);
            }
        }
    }

    async deleteTokenById(tokenId: number) {
        await db.query(
            "DELETE FROM refresh_tokens WHERE refresh_token_id = $1",
            [tokenId]
        );
    }

    async deleteToken(refreshToken: string) {
        const refreshTokenData: IRefreshTokenFromDataBase = (
            await db.query(
                "DELETE FROM refresh_tokens WHERE refresh_token = $1 RETURNING *",
                [refreshToken]
            )
        ).rows[0];
        return refreshTokenData;
    }

    async getAllTokensFromDataBase() {
        const tokens: IRefreshTokenFromDataBase[] = (
            await db.query("SELECT * FROM refresh_tokens", [])
        ).rows;
        return tokens;
    }

    async tokenIsExists(refreshToken: string) {
        const refreshTokenData: IRefreshTokenFromDataBase[] = (
            await db.query(
                "SELECT * FROM refresh_tokens WHERE refresh_token = $1",
                [refreshToken]
            )
        ).rows;
        if (refreshTokenData.length == 0) {
            return false;
        }
        return true;
    }

    async logout(refreshToken: string) {
        if (!(await this.tokenIsExists(refreshToken))) {
            throw ApiError.BadRequest("Token isn't found");
        }
        const tokeData = await this.deleteToken(refreshToken);
        return new TokenDto(tokeData);
    }

    async getRefreshTokenFromDb(refreshToken: string) {
        const refreshTokenData: IRefreshTokenFromDataBase[] = (
            await db.query(
                "SELECT * FROM refresh_tokens WHERE refresh_token = $1",
                [refreshToken]
            )
        ).rows;
        if (refreshTokenData.length == 0) {
            return null;
        }
        return new TokenDto(refreshTokenData[0]);
    }

    async refresh(refreshToken: string) {
        const userData = this.validateRefreshToken(refreshToken);
        const refreshTokenFromDb = await this.getRefreshTokenFromDb(
            refreshToken
        );
        if (!userData || !refreshTokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const userByRefresh = await userService.getUserById(
            refreshTokenFromDb.userId
        );
        const newTokens = this.generateTokens({
            userId: userByRefresh.userId,
            email: userByRefresh.email,
        });
        await this.saveToken(userByRefresh.userId, newTokens.refreshToken);
        return {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            userData: userByRefresh,
        };
    }
}

export default new TokenService();
