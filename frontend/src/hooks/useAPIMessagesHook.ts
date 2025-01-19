import { ApiStatusMessage, NewApiStatusMessage } from "../types/ApiMessages";
import useAppContext from "./useAppContextHook";

const useAPIMessagesHook = () => {
    const { handleMessagesChange } = useAppContext();

    const updateMessages = (message: NewApiStatusMessage): void => {
        const newMessage: ApiStatusMessage = {
            id: Date.now(),
            message: message.content,
            messageType: message.type,
        };
        handleMessagesChange(newMessage);
    };

    return { updateMessages };
};

export default useAPIMessagesHook;
