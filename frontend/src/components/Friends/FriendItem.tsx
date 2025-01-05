import { ReactNode } from "react";
import { FriendData } from "../../types/Friends";
import { FRIEND_COLUMNS } from "./FriendsContainer";
import { UserData } from "../../types/Users";
import { SignalRContext } from "../../providers/SignalRContextProvider";

// Constants
const REMOVE_FRIEND_ACTION = "RemoveFriend";
const ACCEPT_FRIEND_ACTION = "AcceptFriend";
const REMOVE_FRIEND_TEXT = "Remove Friend";
const ACCEPT_FRIEND_TEXT = "Accept";
const CANCEL_FRIEND_TEXT = "Cancel";

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
                <div>
                    <button onClick={async () => await invoke(REMOVE_FRIEND_ACTION, friendship.id)}>
                        {REMOVE_FRIEND_TEXT}
                    </button>
                </div>
            );
        case FRIEND_COLUMNS.received:
            return (
                <div>
                    <button onClick={async () => await invoke(ACCEPT_FRIEND_ACTION, friendship.id)}>
                        {ACCEPT_FRIEND_TEXT}
                    </button>
                    <button onClick={async () => await invoke(REMOVE_FRIEND_ACTION, friendship.id)}>
                        {CANCEL_FRIEND_TEXT}
                    </button>
                </div>
            );
        case FRIEND_COLUMNS.sent:
            return (
                <div>
                    <button onClick={async () => await invoke(ACCEPT_FRIEND_ACTION, friendship.id)}>
                        {CANCEL_FRIEND_TEXT}
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
        <li>
            <p>
                {friendship.userData.firstName} {friendship.userData.lastName}
            </p>
            {getActions(invoke, friendship, actions)}
        </li>
    );
};

export default FriendItem;
