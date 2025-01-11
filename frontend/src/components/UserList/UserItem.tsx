import { UserData } from "../../types/Users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import useSignalRAction from "../../api/signalR/signalRActions";

// Constants
const ADD_FRIEND_ACTION = "AddFriend"

interface Props {
    user: UserData;
    searchBarValue : string,
}

const UserItem = ({ user, searchBarValue }: Props) => {
    const { handleSignalRAction } = useSignalRAction();
    return (
        <li className="flex gap-2">
            <div className="flex gap-2">
                <p>{user.firstName}</p>
                <p>{user.lastName}</p>
            </div>
            <div>
                <button onClick={async () => await handleSignalRAction(ADD_FRIEND_ACTION, user.email)}>
                    <FontAwesomeIcon icon={faUserPlus} />
                </button>
            </div>
        </li>
    );
};

export default UserItem;
