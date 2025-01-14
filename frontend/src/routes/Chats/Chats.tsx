import { useOutlet } from "react-router";
import ChatContainer from "../../components/Chats/ChatContainer";

const Chats = () => {
    const outlet = useOutlet();

    return <>{outlet ? <div className="w-full">{outlet}</div> : <ChatContainer />}</>;
};

export default Chats;
