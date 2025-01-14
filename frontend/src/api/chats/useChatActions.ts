import useGetRequest from "../useGetRequest/useGetRequest";
import { CHAT_API_ENDPOINT } from "../../constants/endpoints";
import { ChatData } from "../../types/Chats";

// Constants
const INITIAL_CHAT_DATA: ChatData[] = [];

const useChatActions = () => {
    const queryKeys: string[] = ["userChats"];
    const { data, isLoading, isError } = useGetRequest<ChatData[]>({
        queryKeys: queryKeys,
        endpoint: CHAT_API_ENDPOINT,
        keepData: true,
        initialData: INITIAL_CHAT_DATA,
    });
    return { chats: data ? data : [], isLoadingChats: isLoading, isErrorChats: isError };
};

export default useChatActions;
