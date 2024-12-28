import { useEffect } from "react";
import useSignalRConnection from "./useSignalRConnection";
import useGetRequest from "../useGetRequest/useGetRequest";
import { UserData } from "../../types/Users";
import { useSelector } from "react-redux";
import { StoreState } from "../../redux/store";

export const useUsersActions = () => {
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

    useEffect(() => {
        if (connection) {
            const handleUserRefetch = async () => {
                await refetchUsers();
            };

            connection.on("FriendshipRequestRecieved", handleUserRefetch);
            connection.on("FriendshipCancelled", handleUserRefetch);
        }
    }, [connection, refetchUsers]);

    return {usersData : usersData? usersData : [], isLoadingUsers, isErrorUsers};
};
