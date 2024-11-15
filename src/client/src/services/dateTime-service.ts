export default class DateTimeService {
    static formDate(publicationDateTime: string) {
        console.log(publicationDateTime)
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
                return `сегодня в ${pubTime}`;
            }
            if (nowDay - pubDay == 1) {
                return `вчера в ${pubTime}`;
            }
        }

        let stringMonth = "дек";

        switch (pubMonth) {
            case 1:
                stringMonth = "янв";
                break;
            case 2:
                stringMonth = "фев";
                break;
            case 3:
                stringMonth = "мар";
                break;
            case 4:
                stringMonth = "апр";
                break;
            case 5:
                stringMonth = "мая";
                break;
            case 6:
                stringMonth = "июю";
                break;
            case 7:
                stringMonth = "июл";
                break;
            case 8:
                stringMonth = "авг";
                break;
            case 9:
                stringMonth = "сен";
                break;
            case 10:
                stringMonth = "окт";
                break;
            case 11:
                stringMonth = "ноя";
                break;
            default:
        }
        if (pubYear !== nowYear) return `${pubDay} ${stringMonth} в ${pubYear}`;
        return `${pubDay} ${stringMonth}`;
    }
}
