export default interface IGetPostImage {
    postImageId: number;
    imageData: Buffer;
    mimeType: string;
    postId: number;
}
