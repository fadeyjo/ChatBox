export default class DateTimeService {
    static formDate(publicationDateTime: string) {
        const [pubDate, time] = publicationDateTime.split(" ");
        const pubTime = time.slice(0, -3);
        const [pubYear, pubMonth, pubDay] = pubDate
            .split("-")
            .map((value) => Number(value));

        const now = new Date();
        const nowYear = now.getFullYear();
        const nowMonth = now.getMonth() + 1;
        const nowDay = now.getDate();

        if (pubYear === nowYear && pubMonth === nowMonth) {
            if (nowDay === pubDay) {
                return `today in ${pubTime}`;
            }
            if (nowDay - pubDay == 1) {
                return `yestarday in ${pubTime}`;
            }
        }

        let stringMonth = "dec";

        switch (pubMonth) {
            case 1:
                stringMonth = "jan";
                break;
            case 2:
                stringMonth = "feb";
                break;
            case 3:
                stringMonth = "mar";
                break;
            case 4:
                stringMonth = "apr";
                break;
            case 5:
                stringMonth = "may";
                break;
            case 6:
                stringMonth = "jun";
                break;
            case 7:
                stringMonth = "jul";
                break;
            case 8:
                stringMonth = "aug";
                break;
            case 9:
                stringMonth = "sep";
                break;
            case 10:
                stringMonth = "oct";
                break;
            case 11:
                stringMonth = "nov";
                break;
            default:
        }
        if (pubYear !== nowYear) return `${pubDay} ${stringMonth} in ${pubYear}`;
        return `${pubDay} ${stringMonth}`;
    }
}
