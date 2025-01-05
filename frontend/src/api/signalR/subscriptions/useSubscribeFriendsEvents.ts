import { useQueryClient } from "@tanstack/react-query";
import useAppContext from "../../../hooks/useAppContextHook";
import { SignalRContext } from "../../../providers/SignalRContextProvider";
import { FriendAPIResponse, Friendship } from "../../../types/Friends";
import { UserData } from "../../../types/Users";
import { FriendshipStatus } from "../../../types/enums";

// Constants
const FRIENDSHIP_REQUEST_RECEIVED = "FriendshipRequestRecieved";
const FRIENDSHIP_CANCELLED = "FriendshipCancelled";
const FRIENDSHIP_ACCEPTED = "FriendshipAccepted";

const useSubscribeUsersEvents = () => {
    const connection = SignalRContext;
    const queryClient = useQueryClient();
    const { searchBarValue } = useAppContext();

    const friendsQueryKeys = ["users", "friends"];
    const usersQueryKeys = ["users", "potentialFirends", searchBarValue];

    const subscribeToEvents = () => {
        connection.useSignalREffect(
            FRIENDSHIP_REQUEST_RECEIVED,
            (friendshipRequestModel: Friendship) => {
                const { isSender, receiverID } = friendshipRequestModel;
                //Users
                queryClient.setQueryData(usersQueryKeys, (oldUsers: UserData[]) => {
                    return oldUsers.filter((user) => user.id !== receiverID);
                });

                //Friends
                queryClient.setQueryData(friendsQueryKeys, (oldFriendships: FriendAPIResponse) => {
                    if (isSender) {
                        return { ...oldFriendships, sent: [...oldFriendships.sent, friendshipRequestModel] };
                    } else if (!isSender) {
                        return { ...oldFriendships, received: [...oldFriendships.received, friendshipRequestModel] };
                    } else {
                        return oldFriendships;
                    }
                });
            },
            []
        );

        connection.useSignalREffect(
            FRIENDSHIP_CANCELLED,
            (friendshipRequestModel: Friendship) => {
                const { status, isSender, id } = friendshipRequestModel;
                //Users
                queryClient.setQueryData(usersQueryKeys, (oldUsers: UserData[]) => {
                    if (friendshipRequestModel.isSender) {
                        return [...oldUsers, friendshipRequestModel.receiverData];
                    }
                    return [...oldUsers, friendshipRequestModel.senderData];
                });
                //Friends

                queryClient.setQueryData(friendsQueryKeys, (oldFriends: FriendAPIResponse): FriendAPIResponse => {
                    if (status === FriendshipStatus.Accepted) {
                        return {
                            ...oldFriends,
                            accepted: oldFriends.accepted.filter((f) => f.id !== id),
                        };
                    } else if (status === FriendshipStatus.Pending && isSender) {
                        return {
                            ...oldFriends,
                            sent: oldFriends.sent.filter((f) => f.id !== id),
                        };
                    } else if (friendshipRequestModel.status === FriendshipStatus.Pending && !isSender) {
                        return {
                            ...oldFriends,
                            received: oldFriends.received.filter((f) => f.id !== id),
                        };
                    } else {
                        return oldFriends;
                    }
                });
            },
            []
        );

        connection.useSignalREffect(
            FRIENDSHIP_ACCEPTED,
            (friendshipRequestModel: Friendship) => {
                queryClient.setQueryData(friendsQueryKeys, (oldFriends: FriendAPIResponse) => {
                    const { isSender, id } = friendshipRequestModel;
                    const updatedFriends: FriendAPIResponse = { ...oldFriends };

                    if (isSender) {
                        updatedFriends.sent = oldFriends.sent.filter((friend) => friend.id !== id);
                    } else {
                        updatedFriends.received = oldFriends.received.filter((friend) => friend.id !== id);
                    }
                    updatedFriends.accepted = [...updatedFriends.accepted, friendshipRequestModel];

                    return updatedFriends;
                });
            },
            []
        );
    };

    return { subscribeToEvents };
};

export default useSubscribeUsersEvents;
