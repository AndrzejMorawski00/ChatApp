import { keepPreviousData, useQuery } from "@tanstack/react-query";

import axiosInstance from "../../utils/api/apiConfig";

interface Props<T> {
    queryKeys: string[];
    endpoint: string;
    keepData: boolean;
    initialData: T;
}

const useGetRequest = <T>({ queryKeys, endpoint, keepData, initialData }: Props<T>) => {
    return useQuery({
        queryKey: queryKeys,
        queryFn: async (): Promise<T> => {
            try {
                const response = await axiosInstance.get<T>(endpoint);
                return response.data;
            } catch (error: any) {
                const status = error.response?.status ? `Response status: ${error.response.status}` : "Unknown error";
                throw new Error(status);
            }
        },
        placeholderData: keepData ? keepPreviousData : undefined,
        initialData: initialData,
    });
};

export default useGetRequest;
