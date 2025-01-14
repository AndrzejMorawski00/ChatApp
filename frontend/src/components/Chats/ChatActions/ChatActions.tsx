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
        <div className="flex flex-row gap-2 items-center justify-around w-full">
            {chat.isOwner ? (
                <>
                    <ChatModal buttonStyles="text-xl text-textColor transform duration-300 hover:scale-105" buttonText="Edit" currentChat={chat} />
                    <ChatActionModal  buttonText="Delete" chatActionName={DELETE_CHAT_ACTION} chatId={chat.id} />
                </>
            ) : (
                chat.chatType != ChatCategory.DM && <ChatActionModal  buttonText="Leave" chatActionName={LEAVE_CHAT_ACTION} chatId={chat.id} />
            )}
        </div>
    );
};

export default ChatActions;
