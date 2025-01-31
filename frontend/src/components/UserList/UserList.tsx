import { useSelector } from "react-redux";
import { UserData } from "../../types/Users";
import UserItem from "./UserItem";
import { RootState } from "../../store/store";
import { useGetUsersQuery } from "../../store/api/apiSlice";

interface Props {}

const UserList = ({}: Props) => {
    const { searchBarValue } = useSelector((state: RootState) => state.searchBar);

    const { data, error: isErrorUsers, isLoading: isLoadingUsers } = useGetUsersQuery({ searchParams: searchBarValue });
    if (isLoadingUsers) {
        return (
            <div className="flex items-center justify-center w-full h-full pt-4 pl-4 border-l-2 border-l-white/30">
                <p className="mt-4 text-2xl font-montserrat text-mainButtonBackground animate-pulse">Loading...</p>
            </div>
        );
    }

    if (isErrorUsers) {
        return (
            <div className="flex items-center justify-center w-full h-full pt-4 pl-4 border-l-2 border-l-white/30">
                <p className="mt-4 text-2xl font-montserrat text-mainButtonBackground animate-pulse">Error...</p>
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
