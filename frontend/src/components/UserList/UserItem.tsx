import { UserData } from "../../types/Users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import useSignalRAction from "../../api/signalR/signalRActions";

// Constants
const ADD_FRIEND_ACTION = "AddFriend";

interface Props {
    user: UserData;
    searchBarValue: string;
}

const UserItem = ({ user }: Props) => {
    const { handleSignalRAction } = useSignalRAction();
    return (
        <li className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-4">
                <p className="py-1 text-xl tracking-wider text-textColor">{user.firstName}</p>
                <p className="py-1 text-xl tracking-wider text-textColor">{user.lastName}</p>
            </div>

            <button className="" onClick={async () => await handleSignalRAction(ADD_FRIEND_ACTION, user.email)}>
                <FontAwesomeIcon
                    icon={faUserPlus}
                    className="transition duration-300 transform size-6 text-iconColor hover:text-iconColorHover hover:scale-105"
                />
            </button>
        </li>
    );
};

export default UserItem;
