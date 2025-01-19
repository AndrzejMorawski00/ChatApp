import { useQueryClient } from "@tanstack/react-query";
import useAppContext from "../../../hooks/useAppContextHook";
import { SignalRContext } from "../../../providers/SignalRContextProvider";
import { FriendshipAPIResponse } from "../../../types/Friends";
import { FriendshipRequestRecieved, SignalRAPIResponseMessage } from "../../../types/siglalRSubscriptions";
import {
    FRIENDSHIP_ACCEPTED,
    FRIENDSHIP_CANCELLED,
    FRIENDSHIP_REQUEST_RECEIVED,
    MESSAGE_EVENT,
} from "../../../constants/signalRActions";
import { UserData } from "../../../types/Users";
import { NewApiStatusMessage } from "../../../types/ApiMessages";
import { handleMessageReceived } from "../../../utils/SignalRAaction/handleMessageReceived";
import useAPIMessagesHook from "../../../hooks/useAPIMessagesHook";



// Constants
const useSubscribeUsersEvents = () => {
    const connection = SignalRContext;
    const queryClient = useQueryClient();
    const { searchBarValue } = useAppContext();
    const { updateMessages } = useAPIMessagesHook();
    const friendsQueryKeys = ["users", "friends"];
    const usersQueryKeys = ["users", "potentialFirends", searchBarValue];

    const updateFriendsData = (friendships: FriendshipAPIResponse): void => {
        queryClient.setQueryData(friendsQueryKeys, () => friendships);
    };

    const updateUsersData = (users: UserData[]): void => {
        queryClient.setQueryData(usersQueryKeys, () => {
            return users.filter(
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
            (data: SignalRAPIResponseMessage<FriendshipRequestRecieved>) => {
                handleMessageReceived(data, handleFriendshipEvent, updateMessages);
            },
            []
        );

        connection.useSignalREffect(
            FRIENDSHIP_ACCEPTED,
            (data: SignalRAPIResponseMessage<FriendshipAPIResponse>) => {
                handleMessageReceived(data, updateFriendsData, updateMessages);
            },
            []
        );

        connection.useSignalREffect(
            FRIENDSHIP_CANCELLED,
            (data: SignalRAPIResponseMessage<FriendshipRequestRecieved>) => {
                handleMessageReceived(data, handleFriendshipEvent, updateMessages);
            },
            []
        );

        connection.useSignalREffect(
            MESSAGE_EVENT,
            (data: SignalRAPIResponseMessage<NewApiStatusMessage>) => {
                const { message } = data;
                if (message) {
                    updateMessages(message);
                }
            },
            []
        );
    };

    return { subscribeToUserEvents };
};

export default useSubscribeUsersEvents;
