import { UserData } from "../../types/Users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { HandleAddFriend } from "../../types/Friends";
interface Props {
    user: UserData;
    handleAddFriend: HandleAddFriend;
}

const UserItem = ({ user, handleAddFriend }: Props) => {
    return (
        <li className="flex gap-2">
            <div className="flex gap-2">
                <p>{user.firstName}</p>
                <p>{user.lastName}</p>
            </div>
            <div>
                <button onClick={() => handleAddFriend(user.email)}>
                    <FontAwesomeIcon icon={faUserPlus} />
                </button>
            </div>
        </li>
    );
};

export default UserItem;
