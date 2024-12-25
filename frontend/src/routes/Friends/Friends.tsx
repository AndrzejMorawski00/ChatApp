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
    } = useFriendActions();

    return (
        <div className="flex">
            <div>
                <FriendsSearchBar />
                <UserList
   
                    users={usersData ? usersData : []}
                    isLoading={isLoadingUsers}
                    isError={isErrorUsers}
                />
            </div>
            <FriendsContainer
               
                friends={friendsData ? friendsData : { accepted: [], sent: [], received: [] }}
                isLoading={isLoadingFriends}
                isError={isErrorFriends}
                
                
            />
        </div>
    );
};

export default Friends;
