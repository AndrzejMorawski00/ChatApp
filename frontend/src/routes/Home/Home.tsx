import { Link, Outlet } from "react-router";
import useSubscribeUsersEvents from "../../api/signalR/subscriptions/useSubscribeUserEvents";
import ChatModal from "../../components/Chats/ChatActions/ChatModal";
import useSubscribeChatEvents from "../../api/signalR/subscriptions/useSubscribeChatEvents";

// Constants
const FRIENDS_PATH = "friends/";
const CHATS_PATH = "chats/";
const FRIENDS_TEXT = "Friends";
const CHATS_TEXT = "Chats";

const Home = () => {
    const { subscribeToUserEvents } = useSubscribeUsersEvents();
    const { subscribeToChatEvents } = useSubscribeChatEvents();
    subscribeToUserEvents();
    subscribeToChatEvents();

    return (
        <div className="flex h-full border-t-2 border-t-white/30">
            <div className="flex flex-col items-center gap-2 mt-5 ml-4">
                <Link
                    className="mr-4 text-xl tracking-wider w-fit text-textColor font-montserrat linkStyles"
                    to={FRIENDS_PATH}
                >
                    {FRIENDS_TEXT}
                </Link>
                <Link
                    className="mr-4 text-xl tracking-wider outline-none w-fit text-textColor font-montserrat linkStyles"
                    to={CHATS_PATH}
                >
                    {CHATS_TEXT}
                </Link>
                <ChatModal
                    buttonStyles="text-xl text-textColor mr-4 font-montserrat tracking-wider linkStyles focus:outline-none text-nowrap"
                    buttonText="New Chat"
                />
            </div>
            <Outlet />
        </div>
    );
};

export default Home;
