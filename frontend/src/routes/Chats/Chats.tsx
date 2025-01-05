import { Outlet } from "react-router";
import ChatContainer from "../../components/Chats/ChatContainer";

const Chats = () => {
    return (
        <div className="flex gap-1">
            <div className="w-25">
            <Outlet />
            </div>
            <ChatContainer />
            
        </div>
    );
};

export default Chats;
