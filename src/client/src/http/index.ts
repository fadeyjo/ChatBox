import axios from "axios";
import IRefreshTokens from "../interfaces/IResponses/IUserRefreshTokens";

export const API_URL = "http://192.168.136.176:8080/api";

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        return config;
    }
    if (!config.headers) {
        throw new Error("Config is null or undefined in request interceptor");
    }
    config.headers.Authorization = `Bearer ${localStorage.getItem(
        "accessToken"
    )}`;
    return config;
});

$api.interceptors.response.use(
    (config) => config,
    async (error) => {
        if (
            error.response.status === 401 &&
            error.config &&
            !error.config._isRetry
        ) {
            const originalRequest = error.config;
            originalRequest._isRetry = true;
            try {
                const response = await axios.get<IRefreshTokens>(
                    `${API_URL}/user/refresh`,
                    {
                        withCredentials: true,
                    }
                );
                localStorage.setItem("accessToken", response.data.accessToken);
                return $api.request(originalRequest);
            } catch (error) {
                console.log("User not auth");
            }
        }
        throw error;
    }
);

export default $api;