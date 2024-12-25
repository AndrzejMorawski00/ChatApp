import { Friend, HandleAcceptFriend, HandleRemoveFriend } from "../../types/Friends";
import FriendItem from "./FriendItem";

interface Props {
    listName: string;
    friends: Friend[];
    handleAcceptFriend: HandleAcceptFriend;
    handleRemoveFriend: HandleRemoveFriend;
}

const FriendList = ({ listName, friends, handleAcceptFriend, handleRemoveFriend }: Props) => {
    return (
        <div>
            <h2>{listName}</h2>
            <ul>
                {friends.map((friend) => (
                    <FriendItem
                        key={friend.id}
                        friend={friend}
                        handleAcceptFriend={handleAcceptFriend}
                        handleRemoveFriend={handleRemoveFriend}
                    />
                ))}
            </ul>
        </div>
    );
};

export default FriendList;
