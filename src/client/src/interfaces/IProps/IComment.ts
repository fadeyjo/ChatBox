import { Dispatch } from "react";
import IGetComment from "../IResponses/IGetComment";

export default interface IComment {
    isMyPost: boolean;
    comment: IGetComment;
    setComments: Dispatch<React.SetStateAction<IGetComment[]>>;
}
