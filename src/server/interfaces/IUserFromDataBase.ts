export default interface IUserFromDataBase {
    user_id: number;
    last_name: string;
    first_name: string;
    patronymic: string | null;
    email: string;
    nickname: string;
    hashed_password: string;
    is_online: boolean | null;
}
