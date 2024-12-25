import { ReactNode } from "react";
import { Friendship } from "../../types/Friends";
import { FRIEND_COLUMNS } from "./FriendsContainer";
import { acceptFriendRequest, removeFriendRequest } from "../../utils/ManagingFriends/actions";

interface Props {
    friend: Friendship;
    actions: (typeof FRIEND_COLUMNS)[keyof typeof FRIEND_COLUMNS];
}

const getActions = (friend: Friendship, actions: (typeof FRIEND_COLUMNS)[keyof typeof FRIEND_COLUMNS]): ReactNode => {
    switch (actions) {
        case FRIEND_COLUMNS.accepted:
            return (
                <div>
                    <button onClick={() => removeFriendRequest(friend.id)}>Remove Friend</button>
                </div>
            );
        case FRIEND_COLUMNS.received:
            return (
                <div>
                    <button onClick={() => acceptFriendRequest(friend.id)}>Accept</button>
                    <button onClick={() => removeFriendRequest(friend.id)}>Cancel</button>
                </div>
            );
        case FRIEND_COLUMNS.sent:
            return (
                <div>
                    <button onClick={() => removeFriendRequest(friend.id)}>Cancel</button>
                </div>
            );
        default:
            return <></>;
    }
};

const FriendItem = ({ friend, actions }: Props) => {
    return (
        <li>
            <p>
                {friend.friendData.firstName} {friend.friendData.lastName}
            </p>
            {getActions(friend, actions)}
        </li>
    );
};

export default FriendItem;
