import FriendsContainer from "../../components/Friends/FriendsContainer";
import UserList from "../../components/UserList/UserList";
import UserSearchBar from "../../components/UserList/UserSearchBar";

const Friends = () => {
    return (
        <div className="flex w-full gap-4 pt-4 pl-4 border-l-2 border-l-white/30">
            <div>
                <UserSearchBar />
                <UserList />
            </div>
            <FriendsContainer />
        </div>
    );
};

export default Friends;
