import { ChangeEvent } from "react";

export default interface IProfileInfo {
    userId: number;
    imageSrc: string;
    setImage: (event: ChangeEvent<HTMLInputElement>) => void;
    isSelfPage: boolean;
    isFriend: boolean;
    isSubscriber: boolean;
    isSubscribes: boolean;
}
