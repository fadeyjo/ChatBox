export default interface IGetPost {
    postId: number;
    content: string;
    publicationDateTime: string;
    childrenPostId: number | null;
    postAuthorId: number;
}
