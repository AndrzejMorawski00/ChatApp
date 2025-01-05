import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/auth";
import axiosInstance from "../api/apiConfig";

// Constants
const REFRESH_TOKEN_ENDPOINT = "/api/auth/token/refresh";
const REFRESH_TOKEN_ERROR_MESSAGE = "Failed to refresh token";
export const refreshToken = async (): Promise<boolean> => {
    const token = localStorage.getItem(REFRESH_TOKEN);
    if (token) {
        try {
            const response = await axiosInstance.post(REFRESH_TOKEN_ENDPOINT, { refreshToken: token });
            const { accessToken } = response.data;
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            return true;
        } catch (error) {
            console.error(`${REFRESH_TOKEN_ERROR_MESSAGE}. ${error}`);
            return false;
        }
    }
    return false;
};
