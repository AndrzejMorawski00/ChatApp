import { Message } from "../../types/messages";
import { FetchInfiniteObject } from "../../types/useGetInfiniteQuery";
import axiosInstance from "./apiConfig";

export const fetchMessages : FetchInfiniteObject<Message> = async (pageParam : number) => {
    const response = await axiosInstance.get(`api/messages?pageNumber=${pageParam}`);
    return response.data;
};
