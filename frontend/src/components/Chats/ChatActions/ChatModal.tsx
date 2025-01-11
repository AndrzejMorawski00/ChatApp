import { useState } from "react"
import ReusableModal from "../../ReusableComponents/Modal/ReusableModal";
import ChatForm from "./ChatForm";
import { ChatObjectType } from "../../../types/Chats";

// Constants 
interface Props {
    buttonText : string,
    currentChat? : ChatObjectType

}

const NewChatModal = ({buttonText, currentChat} : Props) => {
    const [open, setOpen] = useState<boolean>(false);


    return <ReusableModal open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
        <ReusableModal.Button asChild>
            <button onClick={() => setOpen(true)}>
                {buttonText}
            </button>
        </ReusableModal.Button>
        <ReusableModal.Content title={buttonText}>
            <ChatForm currentChat={currentChat} handleOpenChange={(newValue : boolean) => setOpen(newValue)}/>
        </ReusableModal.Content>
    </ReusableModal>
}


export default NewChatModal