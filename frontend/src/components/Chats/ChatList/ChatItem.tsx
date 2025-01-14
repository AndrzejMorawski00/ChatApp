import { Link } from "react-router";
import { ChatObjectType } from "../../../types/Chats";
import ChatActions from "../ChatActions/ChatActions";

interface Props {
    chat: ChatObjectType;
}

const Chat = ({ chat }: Props) => {
    return (
        <div className="flex flex-col pl-2 items-start">
            <Link className="text-xl text-textColor  font-montserrat tracking-wider linkStyles mx-2" to={`${chat.id}`}>
                {chat.chatName}
            </Link>

            <ChatActions chat={chat} />
        </div>
    );
};
export default Chat;
