import { FRIENDS_API_ENDPOINT } from "../../constants/endpoints";
import { FriendshipAPIResponse } from "../../types/Friends";
import useGetRequest from "../useGetRequest/useGetRequest";


const INITIAL_FRIENDS_DATA: FriendshipAPIResponse = { accepted: [], sent: [], received: [] };

export const useFriendsActions = () => {
    const queryKeys: string[] = ["users", "friends"];
    const {
        data: friendshipData,
        isLoading: isLoadingFriends,
        isError: isErrorFriends,
    } = useGetRequest<FriendshipAPIResponse>({
        queryKeys: queryKeys,
        endpoint: FRIENDS_API_ENDPOINT,
        keepData: true,
        initialData: INITIAL_FRIENDS_DATA,
    });

    return {
        friendshipData: friendshipData ? friendshipData : { accepted: [], sent: [], received: [] },
        isLoadingFriends,
        isErrorFriends,
    };
};
