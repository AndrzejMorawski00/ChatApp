import { UserData } from "../../types/Users";
import FriendItem from "./FriendItem";
import { FRIEND_COLUMNS } from "./FriendsContainer";

interface Props {
    listName: typeof FRIEND_COLUMNS[keyof typeof FRIEND_COLUMNS];
    friends: { id: number; userData: UserData; }[];
}

const FriendList = ({ listName, friends }: Props) => {
    return (
        <div>
            <h2>{listName}</h2>
            <ul>
                {friends.map((friend) => (
                    <FriendItem
                        key={friend.id}
                        friendship={friend}
                        actions={listName}
                    />
                ))}
            </ul>
        </div>
    );
};

export default FriendList;
