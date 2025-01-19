import { useState } from "react"
import ReusableModal from "../../ReusableComponents/Modal/ReusableModal";
import ChatForm from "../ChatForm/ChatForm";
import { ChatData } from "../../../types/Chats";

interface Props {
    buttonText : string,
    currentChat? : ChatData

    buttonStyles : string,

}

const NewChatModal = ({buttonText, currentChat, buttonStyles} : Props) => {
    const [open, setOpen] = useState<boolean>(false);


    return <ReusableModal open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
        <ReusableModal.Button asChild >
            <button className={buttonStyles} onClick={() => setOpen(true)}>
                {buttonText}
            </button>
        </ReusableModal.Button>
        <ReusableModal.Content title={buttonText}>
            <ChatForm currentChat={currentChat} handleOpenChange={(newValue : boolean) => setOpen(newValue)}/>
        </ReusableModal.Content>
    </ReusableModal>
}


export default NewChatModal