import { UserData } from "../../types/Users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { sendFriendRequest } from "../../utils/ManagingFriends/actions";
interface Props {
    user: UserData;

}

const UserItem = ({ user}: Props) => {
    return (
        <li className="flex gap-2">
            <div className="flex gap-2">
                <p>{user.firstName}</p>
                <p>{user.lastName}</p>
            </div>
            <div>
                <button onClick={() => sendFriendRequest(user.email)}>
                    <FontAwesomeIcon icon={faUserPlus} />
                </button>
            </div>
        </li>
    );
};

export default UserItem;
