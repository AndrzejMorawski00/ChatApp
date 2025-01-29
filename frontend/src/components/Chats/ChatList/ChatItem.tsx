import { Link } from "react-router";
import { ChatData } from "../../../types/Chats";
import ChatActions from "../ChatActions/ChatActions";

interface Props {
    chat: ChatData;
}

const Chat = ({ chat }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center min-w-[20vw]">
            <Link
                className="text-xl tracking-wider text-center text-textColor font-montserrat linkStyles w-fit"
                to={chat.id.toString()}
            >
                {chat.chatName}
            </Link>
            <ChatActions chat={chat} />
        </div>
    );
};
export default Chat;
