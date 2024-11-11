export default interface IRegistration {
    lastName: string;
    firstName: string;
    patronymic: string | null;
    email: string;
    nickname: string;
    password: string;
    repeatPassword: string;
}