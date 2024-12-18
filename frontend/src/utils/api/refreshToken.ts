import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/auth";
import axiosInstance from "./apiConfig";

const REFRESH_TOKEN_ENDPOINT = "api/auth/token/refresh/";

export const refreshToken = async (): Promise<boolean> => {
    const token = localStorage.getItem(REFRESH_TOKEN);
    if (token) {
        try {
            const response = await axiosInstance.post(REFRESH_TOKEN_ENDPOINT, { refreshToken: token });
            const { accessToken } = response.data;
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            return true;
        } catch (error: any) {
            console.error(error);
            return false;
        }
    }
    return false;
};
