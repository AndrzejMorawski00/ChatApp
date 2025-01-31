import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axiosInstance from "./apiConfig";

const axiosBaseQuery: BaseQueryFn<{ url: string }, unknown, unknown> = async ({ url }) => {
    try {
        const response = await axiosInstance.get(url);
        return { data: response.data };
    } catch (error: any) {
        return { error: error.response?.data || error.message };
    }
};

export default axiosBaseQuery