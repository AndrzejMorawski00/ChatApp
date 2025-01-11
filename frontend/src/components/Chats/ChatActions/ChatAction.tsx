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
        <div>
            <button onClick={handleChatAction}>Yes</button>
            <button onClick={() => onOpenChange(false)}>No</button>
        </div>
    );
};

export default ChatAction;
