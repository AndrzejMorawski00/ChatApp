import { Friend } from "../../types/Friends";
import { UserData } from "../../types/Users";

interface Props {
    user: UserData;
}

const UserItem = ({ user }: Props) => {
    
    const handleAddFriend = () => {
        console.log('Add Friend');
    }

    return (
        <li>
            <div>
                <p>{user.firstName}</p>
                <p>{user.lastName}</p>
            </div>
            <div>
                <button onClick={handleAddFriend}>Add Friend</button>
            </div>
        </li>
    );
};

export default UserItem;
