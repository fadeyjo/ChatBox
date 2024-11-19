import { Dispatch } from "react";
import IGetPost from "../IResponses/IGetPost";

export default interface IPost {
    post: IGetPost;
    isChild: boolean;
    setCreatePostFormIsOpened?: Dispatch<React.SetStateAction<boolean>>;
    setRepost?: Dispatch<React.SetStateAction<IGetPost | null>>;
    setPosts?: Dispatch<React.SetStateAction<IGetPost[]>>;
}
