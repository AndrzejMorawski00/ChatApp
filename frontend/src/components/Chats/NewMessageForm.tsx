import { useState } from "react";
import useSignalRAction from "../../api/signalR/signalRActions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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
        <form
            onSubmit={(e) => handleFormSubmit(e)}
            className="flex flex-row items-center border-b-2 bg-formInputBackgroundColor py-1 pr-2"
        >
            <input
                className="flex-grow bg-formInputBackgroundColor text-xl text-formInputTextColor outline-none px-2 py-1"
                type="text"
                name="message"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="text-iconColor px-2">
                <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-lg duration-300 transform hover:text-iconColorHover"
                />
            </button>
        </form>
    );
};

export default NewMessageForm;
