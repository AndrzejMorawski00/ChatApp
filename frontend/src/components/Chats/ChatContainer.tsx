import useChatActions from "../../api/chats/useChatActions";
import useSignalRAction from "../../api/signalR/signalRActions";
import { ChatObjectType } from "../../types/Chats";
import { ChatCategory } from "../../types/enums";
import ChatList from "./ChatList/ChatList";

// Constants

const DM_CHATS_NAME = "Direct Messages";
const GROUP_CHATS_NAME = "Group Chats";

interface Props {}

const ChatContainer = ({}: Props) => {
    const { chats, isLoadingChats, isErrorChats } = useChatActions();
    const { handleSignalRAction } = useSignalRAction();

    const dmChats: ChatObjectType[] = [];
    const groupChats: ChatObjectType[] = [];

    chats.forEach((chat) => (chat.chatType === ChatCategory.DM ? dmChats.push(chat) : groupChats.push(chat)));

    // const createAnError = async () => {
    //     await handleSignalRAction("InvokeMessage", 1);
    // };

    if (isLoadingChats) {
        return (
            <div className="w-full h-full flex items-center justify-center border-l-2 border-l-white/30 pl-4 pt-4">
                <p className="text-2xl font-montserrat text-mainButtonBackground animate-pulse mt-4">Loading...</p>
            </div>
        );
    }

    if (isErrorChats) {
        return (
            <div className="w-full h-full flex items-center justify-center border-l-2 border-l-white/30 pl-4 pt-4">
                <p className="text-2xl font-montserrat text-red-600  animate-pulse mt-4">Error...</p>
            </div>
        );
    }

    return (
        <div className="flex w-full h-full justify-around gap-4 border-l-2 border-l-white/30 pl-4 pt-4">
            {/* <button onClick={() =>createAnError()}>Invoke Error</button> */}
            <ChatList listName={DM_CHATS_NAME} chats={dmChats} />
            <ChatList listName={GROUP_CHATS_NAME} chats={groupChats} />
        </div>
    );
};

export default ChatContainer;
