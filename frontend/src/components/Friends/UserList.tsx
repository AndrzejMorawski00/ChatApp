import { UserData } from "../../types/Users";
import UserItem from "./UserItem";

interface Props {
    users: UserData[];
    isLoading: boolean;
    isError: boolean;
}

const UserList = ({ users, isLoading, isError }: Props) => {
    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <p>Error</p>
            </div>
        );
    }

    return (
        <ul>
            {users.map((user, idx) => (
                <UserItem key={idx} user={user} />
            ))}
        </ul>
    );
};

export default UserList;
