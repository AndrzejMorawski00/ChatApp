import { keepPreviousData, useQuery } from "@tanstack/react-query";

import axiosInstance from "../../utils/api/apiConfig";

interface Props {
    queryKeys: string[];
    endpoint: string;
    keepData: boolean;
}

const useGetRequest = <T>({ queryKeys, endpoint, keepData }: Props) => {
    return useQuery({
        queryKey: queryKeys,
        queryFn: async (): Promise<T> => {
            try {
                const response = await axiosInstance.get<T>(endpoint);
                return response.data;
            } catch (error: any) {
                throw new Error(`${error.response?.status ? `Response status: ${error.response.status}` : ""}`);
            }
        },
        placeholderData: keepData ? keepPreviousData : undefined,
        refetchInterval: 1000,
    });
};

export default useGetRequest;
