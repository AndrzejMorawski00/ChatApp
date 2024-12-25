import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/auth";
import axiosInstance from "../api/apiConfig";

export const refreshToken = async (): Promise<boolean> => {
    const token = localStorage.getItem(REFRESH_TOKEN);
    console.log('xD');
    if (token) {
        try {
            const response = await axiosInstance.post("/api/auth/token/refresh", { refreshToken: token });
            const { accessToken } = response.data;
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            return true;
        } catch (error) {
            console.error(`Failed to refresh token. ${error}`);
        }
    }
    return false
    
};
