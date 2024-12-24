import FriendList from "../../components/Friends/UserList";
import FriendsSearchBar from "../../components/Friends/FriendsSearchBar";

const Friends = () => {
    return (
        <div>
            <div>
                <FriendsSearchBar />
                <FriendList />
            </div>
            <div>Pending</div>
            <div>Accespted</div>
        </div>
    );
};

export default Friends;
