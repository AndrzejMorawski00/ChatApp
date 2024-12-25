import { Friend, HandleAcceptFriend, HandleRemoveFriend } from "../../types/Friends";
import FriendList from "./FriendList";

interface Props {
    friends: Friend[];
    isLoading: boolean;
    isError: boolean;
    handleAcceptFriend: HandleAcceptFriend;
    handleRemoveFriend: HandleRemoveFriend;
}

const FriendsContainer = ({ friends, isLoading, isError, handleAcceptFriend, handleRemoveFriend }: Props) => {
    const acceptedFriends: Friend[] = [];
    const pendingFriends: Friend[] = [];

    friends.forEach((friend) => {
        if (friend.status == "accepted") {
            acceptedFriends.push(friend);
        } else {
            pendingFriends.push(friend);
        }
    });

    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <p>Error...</p>
            </div>
        );
    }

    console.log(`Pending: ${pendingFriends} Accepted: ${acceptedFriends}`);

    return (
        <div className="flex gap-2">
            <FriendList
                listName="Friendship Requests:"
                friends={pendingFriends}
                handleAcceptFriend={handleAcceptFriend}
                handleRemoveFriend={handleRemoveFriend}
            />
            <FriendList
                listName="Friends:"
                friends={acceptedFriends}
                handleAcceptFriend={handleAcceptFriend}
                handleRemoveFriend={handleRemoveFriend}
            />
        </div>
    );
};

export default FriendsContainer;
