import { HubConnectionState } from "@microsoft/signalr";
import { SignalRContext } from "../../providers/SignalRContextProvider";

const useSignalRAction = () => {
    const signalRContext = SignalRContext;

    const handleSignalRAction = async (actionName: string, args?: any) => {
        const waitForConnection = async () => {
            if (signalRContext.connection?.state === HubConnectionState.Connected) {
                return;
            }

            await new Promise<void>((resolve, reject) => {
                const interval = setInterval(() => {
                    if (signalRContext.connection?.state === HubConnectionState.Connected) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);

               
                setTimeout(() => {
                    clearInterval(interval);
                    reject(new Error("Connection not established within timeout"));
                }, 10000); 
            });
        };

        try {
            await waitForConnection();
            await signalRContext.connection?.invoke(actionName, args);
        } catch (error) {
            console.error(`Failed to perform SignalR action "${actionName}":`, error);
        }
    };

    return { handleSignalRAction };
};

export default useSignalRAction;