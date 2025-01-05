import axios from "axios";
import { ACCESS_TOKEN } from "../../constants/auth";
import { refreshToken } from "../auth/refreshToken";

// Constants
const DEVELOPMENT_MODE = "development";
const CONTENT_TYPE_JSON = "application/json";
const BEARER_PREFIX = "Bearer ";
const HTTP_STATUS_UNAUTHORIZED = 401;

export const getBaseAPIUrl = (): string => {
    const isDevelopment = import.meta.env.MODE === DEVELOPMENT_MODE;
    if (isDevelopment) {
        return import.meta.env.VITE_API_BASE_URL_LOCAL;
    }
    return import.meta.env.VITE_API_BASE_URL_PROD;
};

const axiosInstance = axios.create({
    baseURL: getBaseAPIUrl(),
    headers: {
        "Content-Type": CONTENT_TYPE_JSON,
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `${BEARER_PREFIX} ${token}`;
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
        const originalRequest = error.config;

        if (error.response?.status === HTTP_STATUS_UNAUTHORIZED && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshSuccess = await refreshToken();
            if (refreshSuccess) {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (token) {
                    originalRequest.headers.Authorization = `${BEARER_PREFIX} ${token}`;
                }
                return axiosInstance(originalRequest);
            }
        }
        localStorage.clear();
        return Promise.reject(error);
    }
);
export default axiosInstance;
