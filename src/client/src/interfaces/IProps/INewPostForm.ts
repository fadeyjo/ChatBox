import { Dispatch } from "react";
import IGetPost from "../IResponses/IGetPost";

export default interface INewPostForm {
    setPosts: Dispatch<React.SetStateAction<IGetPost[]>>;
    setIsOpened: Dispatch<React.SetStateAction<boolean>>;
    repost: IGetPost | null;
    setRepost: Dispatch<React.SetStateAction<IGetPost | null>>;
}
