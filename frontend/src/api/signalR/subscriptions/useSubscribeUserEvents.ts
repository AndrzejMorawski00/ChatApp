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
import { useSelector } from "react-redux";
import { handleMessageReceived } from "../../../utils/SignalRAaction/handleMessageReceived";
import useAPIMessagesHook from "../../../hooks/useAPIMessagesHook";
import { RootState } from "../../../store/store";
import { apiSlice } from "../../../store/api/apiSlice";
import { useAppDispatch } from "../../../hooks/useReduxHook";

// Constants
const useSubscribeUsersEvents = () => {
    const connection = SignalRContext;
    const { searchBarValue } = useSelector((state: RootState) => state.searchBar);
    const { updateMessages } = useAPIMessagesHook();
    const dispatch = useAppDispatch();


    const updateFriendsData = (friendships: FriendshipAPIResponse): void => {
        dispatch(apiSlice.util.updateQueryData("getFriendships", undefined, () => friendships))
    };

    const updateUsersData = (users: UserData[]): void => {
        dispatch(apiSlice.util.updateQueryData("getUsers", {searchParams : searchBarValue}, () => {
            return users.filter(
                (u) =>
                    searchBarValue !== "" ||
                    u.firstName.includes(searchBarValue) ||
                    u.lastName.includes(searchBarValue)
            )}
        ))
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
