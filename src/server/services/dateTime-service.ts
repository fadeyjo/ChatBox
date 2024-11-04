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

        now.setHours(now.getHours() + 3);

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

export default new DateTimeService();
