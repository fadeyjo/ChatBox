import { Dispatch } from "react";
import IGetComment from "../IResponses/IGetComment";

export default interface IComment {
    comment: IGetComment;
    isMyPost: boolean;
    setComments: Dispatch<React.SetStateAction<IGetComment[]>>;
}
