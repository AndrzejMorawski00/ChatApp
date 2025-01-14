import { NewChatRequestType } from "../../types/Chats";
import axiosInstance from "./apiConfig";

// Constants
const NEW_CHAT_API_ENDPOINT = "/api/chat";

export const createNewChat = async (newChat: NewChatRequestType): Promise<boolean> => {
    try {
        const response = await axiosInstance.post(NEW_CHAT_API_ENDPOINT, newChat);
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
};
