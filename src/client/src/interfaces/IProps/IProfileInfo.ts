export default interface IProfileInfo {
    userId: number;
    lastName: string;
    firstName: string;
    patronymic: string | null;
    friendsAmount: number;
    subscribersAmount: number;
    subscribesAmount: number;
    isSelfPage: boolean;
    nickname: string;
}
