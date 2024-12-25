import { useSelector } from "react-redux";
import { FriendAPIResponse } from "../../types/Friends";
import { UserData } from "../../types/Users";
import useGetRequest from "../useGetRequest/useGetRequest";
import useSignalRConnection from "./useSignalRConnection";
import { StoreState } from "../../redux/store";
import { useEffect } from "react";

export const useFriendActions = () => {
    const connection = useSignalRConnection();

    const { searchBarValue } = useSelector((store: StoreState) => store.friendsSearch);

    const {
        data: usersData,
        isLoading: isLoadingUsers,
        isError: isErrorUsers,
        refetch: refetchUsers,
    } = useGetRequest<UserData[]>({
        queryKeys: ["users", "potentialFirends", searchBarValue],
        endpoint: `/api/UserData/GetAll?searchParameter=${searchBarValue}`,
        keepData: true,
    });
    const {
        data: friendsData,
        isLoading: isLoadingFriends,
        isError: isErrorFriends,
        refetch: refetchFriends,
    } = useGetRequest<FriendAPIResponse>({ queryKeys: ["users", "friends"], endpoint: "/api/Friends", keepData: true });

    useEffect(() => {
        if (connection) {
            const handleUsersAndFriendsRefetch = async () => {
                await refetchUsers();
                await refetchFriends();
            };

            const handleFriendsRefetch = async () => {
                console.log('xD');
                await refetchFriends();
            };

            connection.on("FriendshipRequestRecieved", handleUsersAndFriendsRefetch);
            connection.on("FriendshipAccepted", handleFriendsRefetch);
            connection.on("FriendshiCanceled", handleUsersAndFriendsRefetch);
        }
    }, [connection, refetchFriends, refetchUsers]);


    return {
        usersData,
        isLoadingUsers,
        isErrorUsers,
        friendsData,
        isLoadingFriends,
        isErrorFriends,
    };
};
