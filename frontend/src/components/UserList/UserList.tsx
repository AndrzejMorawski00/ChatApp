import useGetRequest from "../../api/useGetRequest/useGetRequest";
import { USER_API_ENDPOINT } from "../../constants/endpoints";
import useAppContext from "../../hooks/useAppContextHook";
import { UserData } from "../../types/Users";
import UserItem from "./UserItem";
// Constants

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
        <ul className="flex flex-col gap-2 pr-2 mt-4 max-h-[70vh] overflow-y-auto">
            {usersData.length > 0 ? (
                usersData.map((user, idx) => <UserItem key={idx} user={user} searchBarValue={searchBarValue} />)
            ) : (
                <li className="text-xl text-center text-textColor">No users available in this list.</li>
            )}
        </ul>
    );
};

export default UserList;
