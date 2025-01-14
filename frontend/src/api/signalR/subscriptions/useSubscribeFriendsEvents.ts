import { useQueryClient } from "@tanstack/react-query";
import useAppContext from "../../../hooks/useAppContextHook";
import { SignalRContext } from "../../../providers/SignalRContextProvider";
import { FriendshipAPIResponse } from "../../../types/Friends";
import { FriendshipRequestRecieved } from "../../../types/siglalRSubscriptions";
import {
    FRIENDSHIP_ACCEPTED,
    FRIENDSHIP_CANCELLED,
    FRIENDSHIP_REQUEST_RECEIVED,
    MESSAGE_EVENT,
} from "../../../constants/signalRActions";
import { UserData } from "../../../types/Users";
import { ApiStatusMessage, NewApiStatusMessage } from "../../../types/ApiMessages";

// Constants

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

    const updateFriendsData = (friendships: FriendshipAPIResponse): void => {
        queryClient.setQueryData(friendsQueryKeys, () => friendships);
    };

    const updateUsersData = (users: UserData[]): void => {
        queryClient.setQueryData(usersQueryKeys, () => {
            users.filter(
                (u) =>
                    searchBarValue !== "" || u.firstName.includes(searchBarValue) || u.lastName.includes(searchBarValue)
            );
        });
    };

    const handleFriendshipEvent = (data: FriendshipRequestRecieved): void => {
        const { users, friendships } = data;
        updateUsersData(users);
        updateFriendsData(friendships);
    };

    const subscribeToUserEvents = () => {
        connection.useSignalREffect(
            FRIENDSHIP_REQUEST_RECEIVED,
            (friendshipResponseReceived: FriendshipRequestRecieved) => {
                handleFriendshipEvent(friendshipResponseReceived);
            },
            []
        );

        connection.useSignalREffect(
            FRIENDSHIP_ACCEPTED,
            (friendshipRequestModel: FriendshipAPIResponse) => {
                updateFriendsData(friendshipRequestModel);
            },
            []
        );
        connection.useSignalREffect(
            FRIENDSHIP_CANCELLED,
            (friendshipResponseReceived: FriendshipRequestRecieved) => {
                handleFriendshipEvent(friendshipResponseReceived);
            },
            []
        );

        connection.useSignalREffect(
            MESSAGE_EVENT,
            (data: NewApiStatusMessage) => {
                const error: ApiStatusMessage = { id: Date.now(), message: data.message, messageType: data.messageType };
                handleMessagesChange(error);
            },
            []
        );
    };

    return { subscribeToUserEvents };
};

export default useSubscribeUsersEvents;
