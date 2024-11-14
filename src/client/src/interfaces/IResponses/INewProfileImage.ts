export default interface INewProfileImage {
    profileImageId: number;
    dateTimePublication: string;
    imageData: Buffer;
    mimeType: string;
    userId: number;
}
