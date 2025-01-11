import { useQueryClient } from "@tanstack/react-query";
import { SignalRContext } from "../../../providers/SignalRContextProvider";
import { ChatDeletedResponse, ChatObjectType } from "../../../types/Chats";
import { useNavigate, useParams } from "react-router";
import { RouteParams } from "../../../components/Chats/ChatDetails";


// Constants
const CHAT_DELETED = "ChatDeleted";
const USER_REMOVED = "UserRemoved";
const CHAT_EDITED = "EditChat";
const USER_ADDED = "AddedToChat";
const HOME_ROUTE = "/home/"; 
const BASE_10 = 10; 

const useSubscribeChatEvents = () => {
    const connection = SignalRContext;
    const queryClient = useQueryClient();
    const params = useParams<RouteParams>();
    const navigate = useNavigate();
    const currChatID = parseInt(params.chatID || "", BASE_10);
    const chatsQueryKeys = ["userChats"];

    const subscribeToChatEvents = () => {
        connection.useSignalREffect(
            USER_ADDED,
            (chatList: ChatObjectType[]) => {
                queryClient.setQueryData(chatsQueryKeys, () => chatList);
            },
            []
        );

        connection.useSignalREffect(
            USER_REMOVED,
            (data: ChatDeletedResponse) => {
                const { chatID, userChatList } = data;
                queryClient.setQueryData(chatsQueryKeys, () => userChatList);
                if (chatID == currChatID) {
                    navigate(HOME_ROUTE);
                }
            },
            []
        );

        connection.useSignalREffect(
            CHAT_EDITED,
            (chatList: ChatObjectType[]) => {
                queryClient.setQueryData(chatsQueryKeys, () => chatList);
            },
            []
        );

        connection.useSignalREffect(
            CHAT_DELETED,
            (data: ChatDeletedResponse) => {
                const { chatID, userChatList } = data;
                console.log(chatID, userChatList);
                queryClient.setQueryData(chatsQueryKeys, () => userChatList);
                if (chatID == currChatID) {
                    navigate(HOME_ROUTE);
                }
            },
            []
        );
    };

    return { subscribeToChatEvents };
};

export default useSubscribeChatEvents;
