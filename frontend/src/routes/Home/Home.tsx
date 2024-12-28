import { Link, Outlet } from "react-router";
import NewChatModal from "../../components/Chats/NewChat/NewChatModal";


const Home = () => {
    return (
        <div className="flex divide-x-2 h-full">
            <div className="flex flex-col">
            <Link to='friends/'>Friends</Link>
            <Link to='chats/'>Chats</Link>
            <Link to='#'>Any Other</Link>
            <NewChatModal/>
            </div>
            <Outlet/>
        </div>
    );
};

export default Home;
