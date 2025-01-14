import { Link } from "react-router";
import { ChatData } from "../../../types/Chats";
import ChatActions from "../ChatActions/ChatActions";

interface Props {
    chat: ChatData;
}

const Chat = ({ chat }: Props) => {
    return (
        <div className="flex flex-col items-start pl-2">
            <Link className="mx-2 text-xl tracking-wider text-textColor font-montserrat linkStyles" to={chat.id.toString()}>
                {chat.chatName}
            </Link>
            <ChatActions chat={chat} />
        </div>
    );
};
export default Chat;
