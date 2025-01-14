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

const UserItem = ({ user, searchBarValue }: Props) => {
    const { handleSignalRAction } = useSignalRAction();
    return (
        <li className="flex gap-2 justify-between items-center">
            <div className="flex gap-4 items-center">
                <p className="text-textColor text-xl tracking-wider py-1">{user.firstName}</p>
                <p className="text-textColor text-xl tracking-wider py-1">{user.lastName}</p>
            </div>

            <button className="" onClick={async () => await handleSignalRAction(ADD_FRIEND_ACTION, user.email)}>
                <FontAwesomeIcon
                    icon={faUserPlus}
                    className="size-6 text-iconColor hover:text-iconColorHover transform transition duration-300 hover:scale-105"
                />
            </button>
        </li>
    );
};

export default UserItem;
