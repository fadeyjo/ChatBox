import { Dispatch } from "react";
import IGetPost from "../IResponses/IGetPost";

export default interface IPost {
    post: IGetPost;
    isChild: boolean;
    setPosts?: Dispatch<React.SetStateAction<IGetPost[]>>;
    imageSrc?: string;
    setCreatePostIsOpened?: Dispatch<React.SetStateAction<boolean>>;
    setRepost?: Dispatch<React.SetStateAction<IGetPost | null>>;
    setIsOpened?: Dispatch<React.SetStateAction<boolean>>;
    setError?: Dispatch<React.SetStateAction<string>>;
    setErrorHeader?: Dispatch<React.SetStateAction<string>>;
}
