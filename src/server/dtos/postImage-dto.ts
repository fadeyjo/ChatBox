import IPostImageFromDataBase from "../interfaces/IPostImageFromDataBase";

export default class PostImageDto {
    postImageId: number;
    imageData: Buffer;
    mimeType: string;
    postId: number;

    constructor(postImages: IPostImageFromDataBase) {
        this.postImageId = postImages.post_image_id;
        this.imageData = postImages.image_data;
        this.mimeType = postImages.mime_type;
        this.postId = postImages.post_id;
    }
}
