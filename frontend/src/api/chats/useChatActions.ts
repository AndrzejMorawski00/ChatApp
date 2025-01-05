import useGetRequest from "../useGetRequest/useGetRequest";
import { ChatObjectType } from "../../types/Chats";

// Constants
const CHAT_API_ENDPOINT = "api/Chat";
const INITIAL_CHAT_DATA: ChatObjectType[] = [];


const useChatActions = () => {
    const queryKeys: string[] = ["userChats"];
    const { data, isLoading, isError } = useGetRequest<ChatObjectType[]>({
        queryKeys: queryKeys,
        endpoint: CHAT_API_ENDPOINT,
        keepData: true,
        initialData: INITIAL_CHAT_DATA,
    });
    return { chats: data ? data : [], isLoadingChats: isLoading, isErrorChats: isError };
};

export default useChatActions;
