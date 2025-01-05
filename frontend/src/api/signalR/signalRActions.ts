import { SignalRContext } from "../../providers/SignalRContextProvider";

const useSignalRAction = () => {
    const signalRContext = SignalRContext;

    const handleSignalRAction = async (actionName: string, args?: any) => {
        await signalRContext.invoke(actionName, args);
    };

    return { handleSignalRAction };
};

export default useSignalRAction;
