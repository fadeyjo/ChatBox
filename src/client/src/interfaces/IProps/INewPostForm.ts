import { Dispatch } from "react";
import IGetPost from "../IResponses/IGetPost";

export default interface INewPostForm {
    setPosts: Dispatch<React.SetStateAction<IGetPost[]>>;
    setCreatePostIsOpened: Dispatch<React.SetStateAction<boolean>>;
    repost: IGetPost | null;
    setRepost: Dispatch<React.SetStateAction<IGetPost | null>>;
    setError: Dispatch<React.SetStateAction<string>>;
    setIsOpened: Dispatch<React.SetStateAction<boolean>>;
    setErrorHeader: Dispatch<React.SetStateAction<string>>;
}
