import { ChatObjectType } from "../../../types/Chats";
import Chat from "./ChatItem";

interface Props {
    listName: string;
    chats: ChatObjectType[];
}

const ChatList = ({ listName, chats }: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl text-textColor tracking-wider">{listName}:</h2>
            <ul className="flex flex-col gap-3">
                {chats.map((chat) => (
                    <Chat chat={chat} key={chat.id} />
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
