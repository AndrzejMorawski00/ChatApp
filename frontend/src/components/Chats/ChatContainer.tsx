import { useGetChatsQuery } from "../../store/api/apiSlice";
import { ChatData } from "../../types/Chats";
import { ChatCategory } from "../../types/enums";
import ChatList from "./ChatList/ChatList";

// Constants
const DM_CHATS_NAME = "Direct Messages";
const GROUP_CHATS_NAME = "Group Chats";

interface Props {}

const ChatContainer = ({}: Props) => {
    const dmChats: ChatData[] = [];
    const groupChats: ChatData[] = [];
    const { data: chats, error: isErrorChats, isLoading: isLoadingChats } = useGetChatsQuery();

    if (isLoadingChats) {
        return (
            <div className="flex items-center justify-center w-full h-full pt-4 pl-4 border-l-2 border-l-white/30">
                <p className="mt-4 text-2xl font-montserrat text-mainButtonBackground animate-pulse">Loading...</p>
            </div>
        );
    }

    if (isErrorChats || !chats) {
        return (
            <div className="flex items-center justify-center w-full h-full pt-4 pl-4 border-l-2 border-l-white/30">
                <p className="mt-4 text-2xl text-red-600 font-montserrat animate-pulse">Error...</p>
            </div>
        );
    }

    chats.forEach((chat) => (chat.chatType === ChatCategory.DM ? dmChats.push(chat) : groupChats.push(chat)));

    return (
        <div className="flex justify-around w-full h-full gap-4 pt-4 pl-4 border-l-2 border-l-white/30">
            <ChatList listName={DM_CHATS_NAME} chats={dmChats} />
            <ChatList listName={GROUP_CHATS_NAME} chats={groupChats} />
        </div>
    );
};

export default ChatContainer;
