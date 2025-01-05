import { useState } from "react"
import ReusableModal from "../../ReusableComponents/ReusableModal";
import NewChatForm from "./NewChatForm";


interface Props {

}

const NewChatModal = ({} : Props) => {
    const [open, setOpen] = useState<boolean>(false);


    return <ReusableModal open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
        <ReusableModal.Button asChild>
            <button onClick={() => setOpen(true)}>
                New Chat
            </button>
        </ReusableModal.Button>
        <ReusableModal.Content title="New Chat">
            <NewChatForm handleOpenChange={(newValue : boolean) => setOpen(newValue)}/>
        </ReusableModal.Content>
    </ReusableModal>
}


export default NewChatModal