import { NewApiStatusMessage } from "../../types/ApiMessages";
import { SignalRAPIResponseMessage,} from "../../types/siglalRSubscriptions";

export const handleMessageReceived = <T>(
    data: SignalRAPIResponseMessage<T>,
    payloadHandler: (payload: T) => void,
    messageHandler: (apiMessage: NewApiStatusMessage) => void
): void => {
    const { message, payload } = data;
    if (message) {
        messageHandler(message);
    }

    if (payload) {
        payloadHandler(payload);
    }
};
