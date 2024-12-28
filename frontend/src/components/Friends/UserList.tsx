import { useUsersActions } from "../../api/signalR/useUsersActions";
import UserItem from "./UserItem";

interface Props {}

const UserList = ({}: Props) => {
    const { usersData, isLoadingUsers, isErrorUsers } = useUsersActions();
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

    return (
        <ul>
            {usersData.map((user, idx) => (
                <UserItem key={idx} user={user} />
            ))}
        </ul>
    );
};

export default UserList;
