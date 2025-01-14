import { DELETE_CHAT_ACTION, LEAVE_CHAT_ACTION } from "../../../constants/signalRActions";
import { ChatData } from "../../../types/Chats";
import { ChatCategory } from "../../../types/enums";
import ChatActionModal from "./ChatActionModal";
import ChatModal from "./ChatModal";

interface Props {
    chat: ChatData;
}

const ChatActions = ({ chat }: Props) => {
    return (
        <div className="flex flex-row items-center justify-around w-full gap-2">
            {chat.isOwner ? (
                <>
                    <ChatModal
                        buttonStyles="text-xl text-textColor transform duration-300 hover:scale-105"
                        buttonText="Edit"
                        currentChat={chat}
                    />
                    <ChatActionModal buttonText="Delete" chatActionName={DELETE_CHAT_ACTION} chatId={chat.id} />
                </>
            ) : (
                chat.chatType != ChatCategory.DM && (
                    <ChatActionModal buttonText="Leave" chatActionName={LEAVE_CHAT_ACTION} chatId={chat.id} />
                )
            )}
        </div>
    );
};

export default ChatActions;
