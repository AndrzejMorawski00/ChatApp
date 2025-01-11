import { ChatObjectType } from "../../../types/Chats";
import Chat from "./ChatItem";

interface Props {
    listName: string;
    chats: ChatObjectType[];
}

const ChatList = ({ listName, chats }: Props) => {
    return (
        <div>
            <h2>{listName}</h2>
            <ul className="flex flex-col gap-1">
                {chats.map((chat) => (
                    <Chat chat={chat} key={chat.id} />
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
