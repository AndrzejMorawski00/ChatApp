import { ChatObjectType } from "../../../types/Chats";
import { ChatCategory } from "../../../types/enums";
import ChatActionModal from "./ChatActionModal";
import ChatModal from "./ChatModal";


// Constants
const DELETE_CHAT_ACTION = "DeleteChat";
const LEAVE_CHAT_ACTION = "LeaveChat";

interface Props {
    chat: ChatObjectType;
}

const ChatActions = ({ chat }: Props) => {
    return (
        <div className="flex">
            {chat.isOwner ? (
                <>
                    <ChatModal buttonText="Edit Chat" currentChat={chat} />
                    <ChatActionModal buttonText="Delete Chat" chatActionName={DELETE_CHAT_ACTION} chatId={chat.id} />
                </>
            ) : (
                chat.chatType != ChatCategory.DM && <ChatActionModal buttonText="Leave Chat" chatActionName={LEAVE_CHAT_ACTION} chatId={chat.id} />
            )}
        </div>
    );
};

export default ChatActions;
