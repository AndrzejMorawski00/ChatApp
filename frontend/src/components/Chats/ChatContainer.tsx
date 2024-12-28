import useChatActions from "../../api/signalR/useChatActions";
import { ChatObjectType, ChatType } from "../../types/Chats";
import ChatList from "./ChatList";

interface Props {}

const ChatContainer = ({}: Props) => {
    const { chats , isLoading, isError } = useChatActions();

    const dmChats : ChatObjectType[] = [];
    const groupChats : ChatObjectType[] = [];


    chats.forEach(chat => chat.chatType === ChatType.DM? dmChats.push(chat) : groupChats.push(chat));

    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <p>Error...</p>
            </div>
        );
    }

    

    return <div className='w-20 pl-5'>
        <ChatList listName="Direct Messages" chats={dmChats} />
        <ChatList listName="Group Chats" chats={groupChats} />
    </div>;
};

export default ChatContainer;
