import axios from "axios";
import { ACCESS_TOKEN } from "../../constants/auth";
import { logout } from "../../redux/auth/isAuthenticatedSlice";
import { EnhancedStore } from "@reduxjs/toolkit/react";

import { refreshToken } from "./refreshToken";

let store: EnhancedStore;

export const injectDispatch = (_store: any) => {
    store = _store;
};

export const getBaseAPIUrl = (): string => {
    const isDevelopment = import.meta.env.MODE === "development";
    if (isDevelopment) {
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

        if (error.response.status === 401) {
            const refreshTokenresult = await refreshToken();
            if (refreshTokenresult) {
                return axiosInstance(originalResponse);
            }
        }

        store.dispatch(logout());
        return Promise.reject(error);
    }
);

export default axiosInstance;
