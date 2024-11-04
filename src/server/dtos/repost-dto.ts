import IRepostFromDataBase from "../interfaces/IRepostFromDataBase";

export default class RepostDto {
    repostId: number;
    repostDateTime: string;
    postId: number;
    repostAuthorId: number;

    constructor(repost: IRepostFromDataBase) {
        this.repostId = repost.repost_id;
        this.repostDateTime = repost.repost_date_time;
        this.postId = repost.post_id;
        this.repostAuthorId = repost.repost_author_id;
    }
}
