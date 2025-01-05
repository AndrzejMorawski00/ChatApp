import useChatActions from "../../api/chats/useChatActions";
import { ChatObjectType } from "../../types/Chats";
import { ChatCategory } from "../../types/enums";
import ChatList from "./ChatList/ChatList";

// Constants

const DM_CHATS_NAME = "Direct Messages";
const GROUP_CHATS_NAME = "Group Chats";

interface Props {}

const ChatContainer = ({}: Props) => {
    const { chats, isLoadingChats, isErrorChats } = useChatActions();

    const dmChats: ChatObjectType[] = [];
    const groupChats: ChatObjectType[] = [];

    chats.forEach((chat) => (chat.chatType === ChatCategory.DM ? dmChats.push(chat) : groupChats.push(chat)));

    if (isLoadingChats) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (isErrorChats) {
        return (
            <div>
                <p>Error...</p>
            </div>
        );
    }

    return (
        <div className="w-20 pl-5">
            <ChatList listName={DM_CHATS_NAME} chats={dmChats} />
            <ChatList listName={GROUP_CHATS_NAME} chats={groupChats} />
        </div>
    );
};

export default ChatContainer;
