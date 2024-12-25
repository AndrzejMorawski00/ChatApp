import { Friend, HandleAcceptFriend, HandleRemoveFriend } from "../../types/Friends";
import AcceptedFriend from "./FriendActions/Acceptedriend";
import PendingFriend from "./FriendActions/PendingFriend";

interface Props {
    friend: Friend;
    handleAcceptFriend: HandleAcceptFriend;
    handleRemoveFriend: HandleRemoveFriend;
}

const FriendItem = ({ friend, handleAcceptFriend, handleRemoveFriend }: Props) => {
    console.log(friend);
    return (
        <li>
            <p>
                {friend.friendData.firstName} {friend.friendData.lastName}
            </p>
            {friend.status === "accepted" ? (
                <AcceptedFriend friend={friend} handleRemoveFriend={handleRemoveFriend} />
            ) : (
                <PendingFriend
                    friend={friend}
                    handleAcceptFriend={handleAcceptFriend}
                    handleRemoveFriend={handleRemoveFriend}
                />
            )}
        </li>
    );
};

export default FriendItem;
