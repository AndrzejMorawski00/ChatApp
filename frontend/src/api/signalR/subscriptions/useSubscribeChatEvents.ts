import { useQueryClient } from "@tanstack/react-query";
import { SignalRContext } from "../../../providers/SignalRContextProvider";
import { ChatData, ChatRouteParams, APIChatResponse } from "../../../types/Chats";
import { useNavigate, useParams } from "react-router";
import { CHAT_DELETED, CHAT_EDITED, USER_ADDED, USER_REMOVED } from "../../../constants/signalRActions";
import { handleMessageReceived } from "../../../utils/SignalRAaction/handleMessageReceived";
import { SignalRAPIResponseMessage } from "../../../types/siglalRSubscriptions";
import useAPIMessagesHook from "../../../hooks/useAPIMessagesHook";

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

    const handleChatChange = (data: APIChatResponse): void => {
        const { chatID, chatList } = data;
        updateUserChatList(chatList);
        if (chatID == currChatID) {
            navigate(HOME_ROUTE);
        }
    };

    const subscribeToChatEvents = () => {
        connection.useSignalREffect(
            USER_ADDED,
            (data: SignalRAPIResponseMessage<APIChatResponse>) => {
                handleMessageReceived(data, handleChatChange, updateMessages);
            },
            []
        );

        connection.useSignalREffect(
            USER_REMOVED,
            (data: SignalRAPIResponseMessage<APIChatResponse>) => {
                handleMessageReceived(data, handleChatChange, updateMessages);
            },
            []
        );

        connection.useSignalREffect(
            CHAT_EDITED,
            (data: SignalRAPIResponseMessage<APIChatResponse>) => {
                handleMessageReceived(data, handleChatChange, updateMessages);
            },
            []
        );

        connection.useSignalREffect(
            CHAT_DELETED,
            (data: SignalRAPIResponseMessage<APIChatResponse>) => {
                handleMessageReceived(data, handleChatChange, updateMessages);
            },
            []
        );
    };

    return { subscribeToChatEvents };
};

export default useSubscribeChatEvents;
