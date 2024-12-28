import { FriendAPIResponse } from "../../types/Friends";
import useGetRequest from "../useGetRequest/useGetRequest";
import useSignalRConnection from "./useSignalRConnection";

import { useEffect } from "react";

export const useFriendActions = () => {
    const connection = useSignalRConnection();

    const {
        data: friendsData,
        isLoading: isLoadingFriends,
        isError: isErrorFriends,
        refetch: refetchFriends,
    } = useGetRequest<FriendAPIResponse>({ queryKeys: ["users", "friends"], endpoint: "/api/Friends", keepData: true });

    useEffect(() => {
        if (connection) {
            const handleFriendsRefetch = async () => {
                await refetchFriends();
            };

            connection.on("FriendshipRequestRecieved", handleFriendsRefetch);
            connection.on("FriendshipAccepted", handleFriendsRefetch);
            connection.on("FriendshipCancelled", handleFriendsRefetch);
        }
    }, [connection, refetchFriends]);

    return {
        friendsData: friendsData ? friendsData : { accepted: [], sent: [], received: [] },
        isLoadingFriends,
        isErrorFriends,
    };
};
