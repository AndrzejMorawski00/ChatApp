import { useQueryClient } from "@tanstack/react-query";
import useAppContext from "../../../hooks/useAppContextHook";
import { SignalRContext } from "../../../providers/SignalRContextProvider";
import { FriendAPIResponse } from "../../../types/Friends";
import { FriendshipRequestRecievedType } from "../../../types/siglalRSubscriptions";

// Constants
const FRIENDSHIP_REQUEST_RECEIVED = "FriendshipRequestRecieved";
const FRIENDSHIP_CANCELLED = "FriendshipCancelled";
const FRIENDSHIP_ACCEPTED = "FriendshipAccepted";
const MESSAGE_EVENT = "MessageEvent";

export type NewMessage = {
    message: string;
    messageType: "info" | "error";
};

const useSubscribeUsersEvents = () => {
    const connection = SignalRContext;
    const queryClient = useQueryClient();
    const { searchBarValue, handleMessagesChange } = useAppContext();

    const friendsQueryKeys = ["users", "friends"];
    const usersQueryKeys = ["users", "potentialFirends", searchBarValue];

    const subscribeToUserEvents = () => {
        connection.useSignalREffect(
            FRIENDSHIP_REQUEST_RECEIVED,
            (friendshipResponseReceived: FriendshipRequestRecievedType) => {
                const { users, friendships } = friendshipResponseReceived;

                //Users
                queryClient.setQueryData(usersQueryKeys, () =>
                    users.filter(
                        (u) =>
                            searchBarValue !== "" ||
                            u.firstName.includes(searchBarValue) ||
                            u.lastName.includes(searchBarValue)
                    )
                );
                //Friends
                queryClient.setQueryData(friendsQueryKeys, () => friendships);
            },
            []
        );

        connection.useSignalREffect(
            FRIENDSHIP_ACCEPTED,
            (friendshipRequestModel: FriendAPIResponse) => {
                // Friends
                queryClient.setQueryData(friendsQueryKeys, () => friendshipRequestModel);
            },
            []
        );
        connection.useSignalREffect(
            FRIENDSHIP_CANCELLED,
            (friendshipResponseReceived: FriendshipRequestRecievedType) => {
                const { users, friendships } = friendshipResponseReceived;

                //Users
                queryClient.setQueryData(usersQueryKeys, () =>
                    users.filter(
                        (u) =>
                            searchBarValue !== "" ||
                            u.firstName.includes(searchBarValue) ||
                            u.lastName.includes(searchBarValue)
                    )
                );
                //Friends
                queryClient.setQueryData(friendsQueryKeys, () => friendships);
            },
            []
        );

        connection.useSignalREffect(
            MESSAGE_EVENT,
            (messageData: NewMessage) => {
                console.log("API Message: ", messageData);
                const error = { id: Date.now(), message: messageData.message, messageType: messageData.messageType };
                handleMessagesChange(error);
            },
            []
        );
    };

    return { subscribeToUserEvents };
};

export default useSubscribeUsersEvents;
