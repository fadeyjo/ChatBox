export default interface IProfileImageFromDataBase {
    profile_image_id: number;
    date_time_publication: string;
    image_data: Buffer;
    mime_type: string;
    user_id: number;
}
