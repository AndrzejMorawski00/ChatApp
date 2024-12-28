import { ChatObjectType } from "../../types/Chats";
import Chat from "./Chat";

interface Props {
    listName: string;
    chats: ChatObjectType[];
}

const ChatList = ({ listName, chats }: Props) => {
    return (
        <div>
            <h2>{listName}</h2>
            <ul>
                {chats.map((chat) => (
                    <Chat chat={chat} key={chat.id} />
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
