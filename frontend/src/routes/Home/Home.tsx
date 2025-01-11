import { Link, Outlet } from "react-router";
import useSubscribeUsersEvents from "../../api/signalR/subscriptions/useSubscribeFriendsEvents";
import ChatModal from "../../components/Chats/ChatActions/ChatModal";
import useSubscribeChatEvents from "../../api/signalR/subscriptions/useSubscribeChatEvents";

// Constants
const FRIENDS_PATH = "friends/";
const CHATS_PATH = "chats/";
const FRIENDS_TEXT = "Friends";
const CHATS_TEXT = "Chats";

const Home = () => {
    const { subscribeToUserEvents } = useSubscribeUsersEvents();
    const {subscribeToChatEvents} = useSubscribeChatEvents()
    subscribeToUserEvents();
    subscribeToChatEvents();

    return (
        <div className="flex divide-x-2 h-full">
            <div className="flex flex-col">
                <Link to={FRIENDS_PATH}>{FRIENDS_TEXT}</Link>
                <Link to={CHATS_PATH}>{CHATS_TEXT}</Link>
                {/* <Link to='#'>Any Other</Link> */}
                <ChatModal buttonText="New Chat" />
            </div>
            <Outlet />
        </div>
    );
};

export default Home;
