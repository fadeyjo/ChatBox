import $api from "../http";
import IGetPostImage from "../interfaces/IResponses/IGetPostImage";

export default class PostImageService {
    static async newPostImages(files: File[], postId: number) {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images", file);
        });

        formData.append("postId", postId.toString());
        return await $api.post<{ postImages: IGetPostImage }>(
            "/postImage",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    }

    static async getPostImages(postId: number) {
        return await $api.get<{ postImages: string[] }>(`/postImage/${postId}`);
    }
}
