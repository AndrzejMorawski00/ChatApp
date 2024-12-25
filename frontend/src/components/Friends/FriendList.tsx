import { Friendship } from "../../types/Friends";
import FriendItem from "./FriendItem";
import { FRIEND_COLUMNS } from "./FriendsContainer";

interface Props {
    listName: typeof FRIEND_COLUMNS[keyof typeof FRIEND_COLUMNS];
    friends: Friendship[];
}

const FriendList = ({ listName, friends }: Props) => {
    return (
        <div>
            <h2>{listName}</h2>
            <ul>
                {friends.map((friend) => (
                    <FriendItem
                        key={friend.id}
                        friend={friend}
                        actions={listName}
                    />
                ))}
            </ul>
        </div>
    );
};

export default FriendList;
