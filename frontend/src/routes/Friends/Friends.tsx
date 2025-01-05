import FriendsContainer from "../../components/Friends/FriendsContainer";
import UserList from "../../components/UserList/UserList";
import UserSearchBar from "../../components/UserList/UserSearchBar";

const Friends = () => {
    return (
        <div className="flex">
            <div>
                <UserSearchBar />
                <UserList />
            </div>
            <FriendsContainer />
        </div>
    );
};

export default Friends;
