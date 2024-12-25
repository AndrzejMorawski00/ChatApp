import { useSelector } from "react-redux";
import { Friend } from "../../types/Friends";
import { UserData } from "../../types/Users";
import useGetRequest from "../useGetRequest/useGetRequest";
import useSignalRConnection from "./useSignalRConnection";
import { StoreState } from "../../redux/store";
import { useEffect } from "react";

export const useFriendActions = () => {
    const connection = useSignalRConnection();

    const { searchBarValue } = useSelector((store: StoreState) => store.friendsSearch);

    useEffect(() => {
        if (connection) {
            const handleUsersAndFriendsRefetch = async () => {
                await refetchUsers();
                await refetchFriends();
            };

            const handleFriendsRefetch = async () => {
                await refetchFriends();
            };

            connection.on("FriendshipRequestRecieved", handleUsersAndFriendsRefetch);
            connection.on("FriendshipAccepted", handleFriendsRefetch);
            connection.on("FriendshiCanceled", handleUsersAndFriendsRefetch);
        }
    }, []);

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
    } = useGetRequest<Friend[]>({ queryKeys: ["users", "friends"], endpoint: "/api/Friends", keepData: true });

    const handleAddFriend = async (friendEmail: string) => {
        console.log('Add Friend', connection);
        if (connection) {
            try {
                console.log(`Friend Email: ${friendEmail}`);
                await connection.invoke("AddFriend", friendEmail);
                console.log("Friend request sent.");
            } catch (error) {
                console.error("Error sending friendship request", error);
            }
        }
    };

    const handleAcceptFriend = async (friendshipId: number) => {
        if (connection) {
            try {
                await connection.invoke("AcceptFriend", friendshipId);
                console.log("Friendship accepted.");
            } catch (error) {
                console.error("Error accepting friendship request", error);
            }
        }
    };

    const handleRemoveFriend = async (friendshipId: number) => {
        if (connection) {
            try {
                await connection.invoke("RemoveFriend", friendshipId);
                console.log("Friendship Cancelled.");
            } catch (error) {
                console.error("Error cancelling request", error);
            }
        }
    };

    return {
        usersData,
        isLoadingUsers,
        isErrorUsers,
        friendsData,
        isLoadingFriends,
        isErrorFriends,
        handleAddFriend,
        handleAcceptFriend,
        handleRemoveFriend,
    };
};
