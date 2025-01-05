import { useQueryClient } from "@tanstack/react-query";
import useAppContext from "../../../hooks/useAppContextHook";
import { SignalRContext } from "../../../providers/SignalRContextProvider";

// Constants
const MESSAGE_SENT = "MessageSent";

const useSubscribeUsersEvents = () => {
    const connection = SignalRContext;
    const { currActiveChat } = useAppContext();
    const queryClient = useQueryClient();
    const messagesQueryKey = ["users", "potentialFirends", currActiveChat];

    const subscribeToEvents = () => {
        connection.useSignalREffect(
            MESSAGE_SENT,
            () => {
                queryClient.invalidateQueries({
                    queryKey: messagesQueryKey,
                });
            },
            []
        );
    };

    return { subscribeToEvents };
};

export default useSubscribeUsersEvents;
