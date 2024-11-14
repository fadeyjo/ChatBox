import { config } from "dotenv";

config();

class DateTimeService {
    formatDateTime(dateTime: any) {
        return dateTime
            .toISOString()
            .replace("T", " ")
            .replace("Z", "")
            .slice(0, -4);
    }

    getNowDate() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    tokenIsExpires(dateExpires: string) {
        const now = new Date();
        const expiresDate = new Date(dateExpires.replace(" ", "T"));
        if (now.getTime() > expiresDate.getTime()) {
            return true;
        }
        return false;
    }

    getExpiresDate() {
        const livingTimeRefreshTokenString =
            process.env.LIVING_TIME_REFRESH_TOKEN || "30d";
        if (!new RegExp("^[0-9]{1,}d$").test(livingTimeRefreshTokenString)) {
            throw new Error("Incorrect format LIVING_TIME_REFRESH_TOKEN");
        }
        const livingTimeRefreshToken =
            Number(livingTimeRefreshTokenString.slice(0, -1)) * 86400000;
        const now = new Date();
        const futureDate = new Date(
            now.getTime() + livingTimeRefreshToken + 10800000
        );

        const year = futureDate.getFullYear();
        const month = String(futureDate.getMonth() + 1).padStart(2, "0");
        const day = String(futureDate.getDate()).padStart(2, "0");

        const hours = String(futureDate.getHours()).padStart(2, "0");
        const minutes = String(futureDate.getMinutes()).padStart(2, "0");
        const seconds = String(futureDate.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

export default new DateTimeService();
