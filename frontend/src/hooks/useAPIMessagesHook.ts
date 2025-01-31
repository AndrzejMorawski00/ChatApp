import { ApiStatusMessage, NewApiStatusMessage } from "../types/ApiMessages";
import { handleMessages } from "../store/messages/messagesSlice";
import { useAppDispatch } from "./useReduxHook";

const useAPIMessagesHook = () => {
    const dispatch = useAppDispatch();

    const updateMessages = (message: NewApiStatusMessage): void => {
        const newMessageID = Date.now();
        const newMessage: ApiStatusMessage = {
            id: newMessageID,
            message: message.content,
            messageType: message.type,
        };
        dispatch(handleMessages(newMessage));
    };

    return { updateMessages };
};

export default useAPIMessagesHook;
