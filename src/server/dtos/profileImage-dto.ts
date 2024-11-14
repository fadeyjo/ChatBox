import IProfileImageFromDataBase from "../interfaces/IProfileImageFromDataBase";

export default class ProfileImageDto {
    profileImageId: number;
    dateTimePublication: string;
    imageData: Buffer;
    mimeType: string;
    userId: number;

    constructor(profileImage: IProfileImageFromDataBase) {
        this.profileImageId = profileImage.profile_image_id;
        this.dateTimePublication = profileImage.date_time_publication;
        this.imageData = profileImage.image_data;
        this.mimeType = profileImage.mime_type;
        this.userId = profileImage.user_id;
    }
}
