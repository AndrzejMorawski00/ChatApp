import { HubConnectionState } from "@microsoft/signalr";
import { SignalRContext } from "../../providers/SignalRContextProvider";
import { SignalRActionHandler } from "../../types/signalRActions";

// Constants
const INTERVAL_DELAY = 100;
const TIMEOUT_DURATION = 10000;
const TIMEOUT_ERROR_MESSAGE = "Connection not established within timeout";
const ACTION_ERROR_MESSAGE = "Failed to perform SignalR action";

const useSignalRAction = () => {
    const signalRContext = SignalRContext;

    const handleSignalRAction: SignalRActionHandler = async (actionName, args) => {
        const waitForConnection = async (): Promise<void> => {
            if (signalRContext.connection?.state === HubConnectionState.Connected) {
                return;
            }

            await new Promise<void>((resolve, reject) => {
                const interval = setInterval(() => {
                    if (signalRContext.connection?.state === HubConnectionState.Connected) {
                        clearInterval(interval);
                        resolve();
                    }
                }, INTERVAL_DELAY);

                setTimeout(() => {
                    clearInterval(interval);
                    reject(new Error(TIMEOUT_ERROR_MESSAGE));
                }, TIMEOUT_DURATION);
            });
        };

        try {
            await waitForConnection();
            await signalRContext.connection?.invoke(actionName, args);
        } catch (error) {
            console.error(`${ACTION_ERROR_MESSAGE} "${actionName}":`, error);
        }
    };

    return { handleSignalRAction };
};

export default useSignalRAction;
