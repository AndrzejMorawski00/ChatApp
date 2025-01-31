import { useNavigate, useParams } from "react-router";
import { apiSlice } from "../../../store/api/apiSlice";
import { useAppDispatch } from "../../../hooks/useReduxHook";
import useAPIMessagesHook from "../../../hooks/useAPIMessagesHook";
import { SignalRContext } from "../../../providers/SignalRContextProvider";
import { SignalRAPIResponseMessage } from "../../../types/siglalRSubscriptions";
import { ChatData, ChatRouteParams, APIChatResponse } from "../../../types/Chats";
import { handleMessageReceived } from "../../../utils/SignalRAaction/handleMessageReceived";
import { CHAT_DELETED, CHAT_EDITED, USER_ADDED, USER_REMOVED } from "../../../constants/signalRActions";

// Constants
const HOME_ROUTE = "/home/";
const BASE_10 = 10;

const useSubscribeChatEvents = () => {
    const connection = SignalRContext;
    const params = useParams<ChatRouteParams>();
    const { updateMessages } = useAPIMessagesHook();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currChatID = parseInt(params.chatID || "", BASE_10);

    const updateUserChatList = (userChatList: ChatData[]): void => {
        dispatch(apiSlice.util.updateQueryData("getChats", undefined, () => userChatList));
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
