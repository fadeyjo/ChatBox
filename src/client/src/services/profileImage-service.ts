import $api from "../http";
import INewProfileImage from "../interfaces/IResponses/INewProfileImage";
import IGetProfileImage from "../interfaces/IResponses/IGetProfileImage";

export default class ProfileImageService {
    static async getProfileImage(userId: number) {
        return await $api.get<IGetProfileImage>(`/profileImage/${userId}`);
    }

    static async newProfileImage(formData: FormData) {
        return await $api.post<INewProfileImage>(`/profileImage`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
}
