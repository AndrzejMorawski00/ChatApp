import { useState } from "react";
import useSignalRAction from "../../api/signalR/signalRActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { SEND_MESSAGE_ACTION } from "../../constants/signalRActions";


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
            className="flex flex-row items-center py-1 pr-2 border-b-2 bg-formInputBackgroundColor"
        >
            <input
                className="flex-grow px-2 py-1 text-xl outline-none bg-formInputBackgroundColor text-formInputTextColor"
                type="text"
                name="message"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="px-2 text-iconColor">
                <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-lg duration-300 transform hover:text-iconColorHover"
                />
            </button>
        </form>
    );
};

export default NewMessageForm;
