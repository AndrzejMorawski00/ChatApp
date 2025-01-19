import { useQueryClient } from "@tanstack/react-query";
import { SignalRContext } from "../../../providers/SignalRContextProvider";
import { ChatDeletionResponse, ChatData, ChatRouteParams } from "../../../types/Chats";
import { useNavigate, useParams } from "react-router";
import { CHAT_DELETED, CHAT_EDITED, USER_ADDED, USER_REMOVED } from "../../../constants/signalRActions";
import useAPIMessagesHook from "../../../hooks/useApiMessagesHook";
import { handleMessageReceived } from "../../../utils/SignalRAaction/handleMessageReceived";
import { SignalRAPIResponseMessage } from "../../../types/siglalRSubscriptions";

// Constants

const HOME_ROUTE = "/home/";
const BASE_10 = 10;

const useSubscribeChatEvents = () => {
    const connection = SignalRContext;
    const queryClient = useQueryClient();
    const { updateMessages } = useAPIMessagesHook();

    const params = useParams<ChatRouteParams>();
    const navigate = useNavigate();
    const currChatID = parseInt(params.chatID || "", BASE_10);
    const chatsQueryKeys = ["userChats"];

    const updateUserChatList = (userChatList: ChatData[]): void => {
        queryClient.setQueryData(chatsQueryKeys, () => userChatList);
    };

    const handleChatDeletion = (data: ChatDeletionResponse): void => {
        const { chatID, userChatList } = data;
        queryClient.setQueryData(chatsQueryKeys, () => userChatList);
        if (chatID == currChatID) {
            navigate(HOME_ROUTE);
        }
    };

    const subscribeToChatEvents = () => {
        connection.useSignalREffect(
            USER_ADDED,
            (data: SignalRAPIResponseMessage<ChatData[]>) => {
                console.log(data);
                handleMessageReceived(data, updateUserChatList, updateMessages);
            },
            []
        );

        connection.useSignalREffect(
            USER_REMOVED,
            (data: SignalRAPIResponseMessage<ChatData[]>) => {
                console.log(data);
                handleMessageReceived(data, updateUserChatList, updateMessages);
            },
            []
        );

        connection.useSignalREffect(
            CHAT_EDITED,
            (data: SignalRAPIResponseMessage<ChatData[]>) => {
                console.log(data);
                handleMessageReceived(data, updateUserChatList, updateMessages);
            },
            []
        );

        connection.useSignalREffect(
            CHAT_DELETED,
            (data: SignalRAPIResponseMessage<ChatDeletionResponse>) => {
                console.log(data);
                handleMessageReceived(data, handleChatDeletion, updateMessages);
            },
            []
        );
    };

    return { subscribeToChatEvents };
};

export default useSubscribeChatEvents;
