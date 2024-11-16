export default interface IPostImageFromDataBase {
    post_image_id: number;
    image_data: Buffer;
    mime_type: string;
    post_id: number;
}
