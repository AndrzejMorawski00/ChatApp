import { Link, Outlet } from "react-router";
import useSubscribeUsersEvents from "../../api/signalR/subscriptions/useSubscribeFriendsEvents";
import NewChatModal from "../../components/Chats/NewChat/NewChatModal";

// Constants
const FRIENDS_PATH = "friens/";
const CHATS_PATH = "chats.";
const FRIENDS_TEXT = "Friends";
const CHATS_TEXT = "Chats";

const Home = () => {
    const { subscribeToEvents } = useSubscribeUsersEvents();

    subscribeToEvents();

    return (
        <div className="flex divide-x-2 h-full">
            <div className="flex flex-col">
                <Link to={FRIENDS_PATH}>{FRIENDS_TEXT}</Link>
                <Link to={CHATS_PATH}>{CHATS_TEXT}</Link>
                {/* <Link to='#'>Any Other</Link> */}
                <NewChatModal />
            </div>
            <Outlet />
        </div>
    );
};

export default Home;
