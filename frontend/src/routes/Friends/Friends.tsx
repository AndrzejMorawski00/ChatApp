import { useFriendActions } from "../../api/signalR/useFriendActions";
import FriendsContainer from "../../components/Friends/FriendsContainer";
import FriendsSearchBar from "../../components/Friends/FriendsSearchBar";
import UserList from "../../components/Friends/UserList";

const Friends = () => {
    const {
        usersData,
        isLoadingUsers,
        isErrorUsers,
        friendsData,
        isLoadingFriends,
        isErrorFriends,
        handleAddFriend,
        handleAcceptFriend,
        handleRemoveFriend,
    } = useFriendActions();

    return (
        <div className="flex">
            <div>
                <FriendsSearchBar />
                <UserList
                    handleAddFriend={handleAddFriend}
                    users={usersData ? usersData : []}
                    isLoading={isLoadingUsers}
                    isError={isErrorUsers}
                />
            </div>
            <FriendsContainer
                friends={friendsData ? friendsData : []}
                isLoading={isLoadingFriends}
                isError={isErrorFriends}
                handleAcceptFriend={handleAcceptFriend}
                handleRemoveFriend={handleRemoveFriend}
            />
        </div>
    );
};

export default Friends;
