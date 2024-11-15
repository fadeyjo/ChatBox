import { ChangeEvent } from "react";
import IUser from "../IResponses/IUser";

export default interface IProfileInfo {
    user: IUser;
    imageSrc: string;
    setImage: (event: ChangeEvent<HTMLInputElement>) => void;
}
