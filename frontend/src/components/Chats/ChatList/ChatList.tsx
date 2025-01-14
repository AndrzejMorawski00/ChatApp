import { ChatData } from "../../../types/Chats";
import Chat from "./ChatItem";

interface Props {
    listName: string;
    chats: ChatData[];
}

const ChatList = ({ listName, chats }: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl tracking-wider text-textColor">{listName}:</h2>
            <ul className="flex flex-col items-center gap-3">
                {chats.map((chat) => (
                    <Chat chat={chat} key={chat.id} />
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
