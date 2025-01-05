import useGetRequest from "../../api/useGetRequest/useGetRequest";
import useAppContext from "../../hooks/useAppContextHook";
import { UserData } from "../../types/Users";
import UserItem from "./UserItem";
// Constants
export const USER_API_ENDPOINT = "/api/UserData/GetAll?searchParameter=";

interface Props {}

const UserList = ({}: Props) => {
    const { searchBarValue } = useAppContext();
    const queryKeys = ["users", "potentialFirends", searchBarValue];
    const {
        data,
        isLoading: isLoadingUsers,
        isError: isErrorUsers,
    } = useGetRequest<UserData[]>({
        queryKeys: queryKeys,
        endpoint: `${USER_API_ENDPOINT}${searchBarValue}`,
        keepData: true,
        initialData: [],
    });

    if (isLoadingUsers) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (isErrorUsers) {
        return (
            <div>
                <p>Error</p>
            </div>
        );
    }

    const usersData: UserData[] = data ? data : [];
    return (
        <ul>
            {usersData.map((user, idx) => (
                <UserItem key={idx} user={user} />
            ))}
        </ul>
    );
};

export default UserList;
