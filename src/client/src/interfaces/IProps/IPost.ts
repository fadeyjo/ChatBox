import { Dispatch } from "react";
import IGetPost from "../IResponses/IGetPost";

export default interface IPost {
    post: IGetPost;
    isChild: boolean;
    setPosts?: Dispatch<React.SetStateAction<IGetPost[]>>;
}
