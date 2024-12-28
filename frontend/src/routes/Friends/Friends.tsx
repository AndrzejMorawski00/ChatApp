import FriendsContainer from "../../components/Friends/FriendsContainer";
import FriendsSearchBar from "../../components/Friends/FriendsSearchBar";
import UserList from "../../components/Friends/UserList";

const Friends = () => {
    return (
        <div className="flex">
            <div>
                <FriendsSearchBar />
                <UserList />
            </div>
            <FriendsContainer />
        </div>
    );
};

export default Friends;
