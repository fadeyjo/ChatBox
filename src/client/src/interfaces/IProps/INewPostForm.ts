import { Dispatch } from "react";
import IGetPost from "../IResponses/IGetPost";

export default interface INewPostForm {
    setPosts: Dispatch<React.SetStateAction<IGetPost[]>>;
    repost: IGetPost | null;
    setRepost: Dispatch<React.SetStateAction<IGetPost | null>>;
    setCreatePostFormIsOpened: Dispatch<React.SetStateAction<boolean>>;
    isFromPostsPage: boolean;
}
