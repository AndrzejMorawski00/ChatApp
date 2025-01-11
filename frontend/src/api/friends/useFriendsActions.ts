import { FriendAPIResponse } from "../../types/Friends";
import useGetRequest from "../useGetRequest/useGetRequest";

const FRIENDS_API_ENDPOINT = "api/Friends";
const INITIAL_FRIENDS_DATA: FriendAPIResponse = { accepted: [], sent: [], received: [] };

export const useFriendsActions = () => {
    const queryKeys: string[] = ["users", "friends"];
    const {
        data: friendshipData,
        isLoading: isLoadingFriends,
        isError: isErrorFriends,
    } = useGetRequest<FriendAPIResponse>({
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
