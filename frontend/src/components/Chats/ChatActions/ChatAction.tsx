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
                className="px-3 py-1 mt-3 text-4xl duration-300 transform border-2 rounded-md font-montserrat text-textColor bg-mainButtonBackground hover:scale-105"
                onClick={handleChatAction}
            >
                Yes
            </button>
            <button
                className="px-3 py-1 mt-3 text-4xl duration-300 transform border-2 rounded-md font-montserrat text-textColor bg-mainButtonBackground hover:scale-105"
                onClick={() => onOpenChange(false)}
            >
                No
            </button>
        </div>
    );
};

export default ChatAction;
