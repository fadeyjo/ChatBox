import IPostFromDataBase from "../interfaces/IPostFromDataBase";

export default class PostDto {
    postId: number;
    content: string;
    publicationDateTime: string;
    childrenPostId: number | null;
    postAuthorId: number;

    constructor(post: IPostFromDataBase) {
        this.postId = post.post_id;
        this.content = post.content;
        this.publicationDateTime = post.publication_date_time;
        this.childrenPostId = post.children_post_id;
        this.postAuthorId = post.post_author_id;
    }
}
