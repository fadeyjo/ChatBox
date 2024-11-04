import IPostFromDataBase from "../interfaces/IPostFromDataBase";

export default class PostDto {
    postId: number;
    content: string;
    publicationDateTime: string;
    postAuthorId: number;

    constructor(post: IPostFromDataBase) {
        this.postId = post.post_id;
        this.content = post.content;
        this.publicationDateTime = post.publication_date_time;
        this.postAuthorId = post.post_author_id;
    }
}
