import { ReactNode } from "react";
import { FriendData } from "../../types/Friends";
import { FRIEND_COLUMNS } from "./FriendsContainer";
import { UserData } from "../../types/Users";
import { SignalRContext } from "../../providers/SignalRContextProvider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faX, faCheck } from "@fortawesome/free-solid-svg-icons";

// Constants
const REMOVE_FRIEND_ACTION = "RemoveFriend";
const ACCEPT_FRIEND_ACTION = "AcceptFriend";

interface Props {
    friendship: { id: number; userData: UserData };
    actions: (typeof FRIEND_COLUMNS)[keyof typeof FRIEND_COLUMNS];
}

const getActions = (
    invoke: any,
    friendship: FriendData,
    actions: (typeof FRIEND_COLUMNS)[keyof typeof FRIEND_COLUMNS]
): ReactNode => {
    switch (actions) {
        case FRIEND_COLUMNS.accepted:
            return (
                <div className="flex gap-4 items-center justify-center">
                    <button
                        onClick={async () => (
                            console.log(friendship), await invoke(REMOVE_FRIEND_ACTION, friendship.id)
                        )}
                    >
                        <FontAwesomeIcon icon={faX} className="size-4 text-iconColor hover:text-iconColorHover transfrom transition duration-300 hover:scale-105"/>
                    </button>
                </div>
            );
        case FRIEND_COLUMNS.received:
            return (
                <div className="flex gap-4 items-center justify-center">
                    <button onClick={async () => await invoke(ACCEPT_FRIEND_ACTION, friendship.id)}>
                        <FontAwesomeIcon icon={faCheck} className="size-4 text-iconColor hover:text-iconColorHover transfrom transition duration-300 hover:scale-105"/>
                    </button>
                    <button onClick={async () => await invoke(REMOVE_FRIEND_ACTION, friendship.id)}>
                        <FontAwesomeIcon icon={faX} className="size-4 text-iconColor hover:text-iconColorHover transfrom transition duration-300 hover:scale-105"/>
                    </button>
                </div>
            );
        case FRIEND_COLUMNS.sent:
            return (
                <div className="flex gap-4 items-center justify-center">
                    <button onClick={async () => await invoke(REMOVE_FRIEND_ACTION, friendship.id)}>
                        <FontAwesomeIcon icon={faX} className="size-4 text-iconColor hover:text-iconColorHover transfrom transition duration-300 hover:scale-105"/>
                    </button>
                </div>
            );
        default:
            return <></>;
    }
};

const FriendItem = ({ friendship, actions }: Props) => {
    const invoke = SignalRContext.invoke;

    return (
        <li className="flex flex-col">
            <div className="flex gap-2 justify-center items-center">
                <p className="text-xl text-textColor tracking-wider w-fit">{friendship.userData.firstName}</p>
                <p className="text-xl text-textColor tracking-wider w-fit">{friendship.userData.lastName}</p>
            </div>
            {getActions(invoke, friendship, actions)}
        </li>
    );
};

export default FriendItem;
