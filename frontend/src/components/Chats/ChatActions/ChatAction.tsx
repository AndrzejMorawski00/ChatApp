import useSignalRAction from "../../../api/signalR/signalRActions";

interface Props {
    chatID: number;
    onOpenChange: (newValue: boolean) => void;
    chatActionName: string;
}

const ChatAction = ({ chatID, chatActionName, onOpenChange }: Props) => {
    const { handleSignalRAction } = useSignalRAction();

    const handleChatAction = async () => {
        await handleSignalRAction(chatActionName, chatID);
        onOpenChange(false);
    };

    return (
        <div className="flex items-center justify-around">
            <button
                className="font-montserrat text-textColor bg-mainButtonBackground text-4xl px-3 mt-3 py-1 border-2 rounded-md transform duration-300 hover:scale-105"
                onClick={handleChatAction}
            >
                Yes
            </button>
            <button
                className="font-montserrat text-textColor bg-mainButtonBackground text-4xl px-3 mt-3 py-1 border-2 rounded-md transform duration-300 hover:scale-105"
                onClick={() => onOpenChange(false)}
            >
                No
            </button>
        </div>
    );
};

export default ChatAction;
