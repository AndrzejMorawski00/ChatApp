import { Friend, HandleAcceptFriend, HandleRemoveFriend } from "../../../types/Friends";

interface Props {
    friend: Friend;
    handleRemoveFriend: HandleRemoveFriend;
    handleAcceptFriend: HandleAcceptFriend;
}

const PendingFriend = ({ friend, handleAcceptFriend, handleRemoveFriend }: Props) => {
    return (
        <div>
            <button onClick={() => handleAcceptFriend(friend.id)}>Accept Request</button>
            <button onClick={() => handleRemoveFriend(friend.id)}>Remove Request</button>
        </div>
    );
};

export default PendingFriend;
