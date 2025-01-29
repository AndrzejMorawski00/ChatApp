import { ChatData } from "../../../types/Chats";
import Chat from "./ChatItem";

interface Props {
    listName: string;
    chats: ChatData[];
}

const ChatList = ({ listName, chats }: Props) => {
    const chatListContent =
        chats && chats.length > 0 ? (
            <ul className="flex flex-col items-center gap-4 overflow-y-auto max-h-[70vh]">
                {chats.map((chat) => (
                    <Chat chat={chat} key={chat.id} />
                ))}
            </ul>
        ) : (
            <p className="text-xl text-center text-textColor">There aren't any chats.</p>
        );

    return (
        <div className="flex flex-col gap-2 min-w-[35vw] items-center">
            <h2 className="pb-4 text-2xl tracking-wider text-textColor">{listName}:</h2>
            {chatListContent}
        </div>
    );
};

export default ChatList;
