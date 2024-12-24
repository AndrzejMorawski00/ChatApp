import axios from "axios";
import { ACCESS_TOKEN } from "../../constants/auth";
import { store } from "../../redux/store";
import { logout } from "../../redux/auth/authSlice";
import { refreshToken } from "../auth/refreshToken";

export const getBaseAPIUrl = (): string => {
    const isDevelopment = import.meta.env.MODE === "development";
    if (isDevelopment) {
        console.log(import.meta.env.VITE_API_BASE_URL_LOCAL);
        return import.meta.env.VITE_API_BASE_URL_LOCAL;
    }
    return import.meta.env.VITE_API_BASE_URL_PROD;
};

const axiosInstance = axios.create({
    baseURL: getBaseAPIUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalResponse = error.config;

        if (error.response?.status === 401) {
            const refreshSuccess = await refreshToken();
            if (refreshSuccess) {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (token) {
                    originalResponse.headers.Authorization = `Bearer ${token}`;
                }
                return axiosInstance(originalResponse);
            }
        }

        store.dispatch(logout());
        return Promise.reject(error);
    }
);
export default axiosInstance;
