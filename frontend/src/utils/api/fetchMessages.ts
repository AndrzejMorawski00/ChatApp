import { GetMessageType, MessageType } from "../../types/messages";
import { FetchInfiniteObject } from "../../types/useGetInfiniteQuery";
import axiosInstance from "./apiConfig";

// export const fetchSimpleMessages : FetchInfiniteObject<SimpleMessage, number> = async (pageParam) => {
//     const response = await axiosInstance.get(`api/messages?pageNumber=${pageParam}`);
//     return response.data;
// };


export const fetchMessages : FetchInfiniteObject<MessageType, GetMessageType> = async (queryParams : GetMessageType) => {
    const response = await axiosInstance.get(`api/messages?pageNumber=${queryParams.pageNumber}&chatID=${queryParams.chatID}`);
    return response.data;
};
  