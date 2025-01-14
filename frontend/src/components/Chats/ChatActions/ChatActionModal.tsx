import { useState } from "react";
import ReusableModal from "../../ReusableComponents/Modal/ReusableModal";
import ChatAction from "./ChatAction";

interface Props {
    buttonText: string;
    chatActionName : string
    chatId: number;
}

const ChatActionModal = ({ buttonText,chatActionName, chatId }: Props) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <ReusableModal open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
            <ReusableModal.Button asChild>
                <button className="text-xl duration-300 transform text-textColor hover:scale-105" onClick={() => setOpen(true)}>{buttonText}</button>
            </ReusableModal.Button>
            <ReusableModal.Content title={buttonText}>
                <ChatAction chatID={chatId} chatActionName={chatActionName} onOpenChange={(newValue : boolean) => setOpen(newValue)} />
            </ReusableModal.Content>
        </ReusableModal>
    );
};

export default ChatActionModal;
