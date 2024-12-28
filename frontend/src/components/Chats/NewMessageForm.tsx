import { useState } from "react";
import { handleSignalRAction } from "../../api/signalR/signalRService";
import { NewMessage } from "../../types/messages";


interface Props {
    chatID : number
}

const NewMessageForm = ({chatID} : Props) => {
    const [message, setMessage] = useState<string>("");

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (message.trim() === '') {
            return
        }
        
        await handleSignalRAction<NewMessage>('SendMessage', {chatID: chatID, content: message.trim()})
        setMessage('')

    }


    return <form onSubmit={e => handleFormSubmit(e)}>
        <input type="text" name="message" id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
        <input type="submit" value="+" />
    </form>
}

export default NewMessageForm