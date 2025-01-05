import { GetMessageType, MessageType, PaginatedResponse } from "../../types/messages";

import axiosInstance from "./apiConfig";

// Constants
const FETCH_MESSAGES_ERROR_MESSAGE = "Failed to fetch messages";
export const fetchMessages = async (queryParams: GetMessageType): Promise<PaginatedResponse<MessageType>> => {
    try {
        const apiLink = `api/messages?pageNumber=${queryParams.pageNumber}&chatID=${queryParams.chatID}`;
        const response = await axiosInstance.get(apiLink);
        return response.data;
    } catch (error: any) {
        throw new Error(`${FETCH_MESSAGES_ERROR_MESSAGE}. ${error}`);
    }
};
