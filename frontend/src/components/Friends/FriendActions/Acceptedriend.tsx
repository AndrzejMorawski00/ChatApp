import { Friend, HandleRemoveFriend } from "../../../types/Friends";

interface Props {
    friend: Friend;
    handleRemoveFriend: HandleRemoveFriend;
}

const AcceptedFriend = ({ friend, handleRemoveFriend }: Props) => {
    return (
        <div>
            <button onClick={() => handleRemoveFriend(friend.id)}>Remove Friend</button>
        </div>
    );
};

export default AcceptedFriend;
