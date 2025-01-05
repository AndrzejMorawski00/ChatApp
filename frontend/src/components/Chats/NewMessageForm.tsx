import { useState } from "react";
import useSignalRAction from "../../api/signalR/signalRActions";

// Constants
const SEND_MESSAGE_ACTION = "SendMessage";

interface Props {
    chatID: number;
}

const NewMessageForm = ({ chatID }: Props) => {
    const { handleSignalRAction } = useSignalRAction();
    const [message, setMessage] = useState<string>("");

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (message.trim() === "") {
            return;
        }
        await handleSignalRAction(SEND_MESSAGE_ACTION, { chatID: chatID, content: message.trim() });
        setMessage("");
    };

    return (
        <form onSubmit={(e) => handleFormSubmit(e)}>
            <input
                type="text"
                name="message"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <input type="submit" value="+" />
        </form>
    );
};

export default NewMessageForm;
