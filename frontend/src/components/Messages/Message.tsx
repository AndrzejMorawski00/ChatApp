import { twMerge } from "tailwind-merge";
import { ChatMessage } from "../../types/messages";
import { getChatMessageColors } from "../../utils/messages/const getChatMessageColors";

interface Props {
    message: ChatMessage;
    fetchNextRef?: React.Ref<HTMLLIElement>;
}

const Message = ({ message, fetchNextRef }: Props) => {
    const { background, textName, textContent } = getChatMessageColors(message.senderData.isOwner);

    return (
        <li
            ref={fetchNextRef ? fetchNextRef : null}
            className={twMerge("flex", message.senderData.isOwner ? "justify-end" : "justify-start")}
        >
            <div className={twMerge("p-2 rounded-lg max-w-[50%] min-w-[25%] break-words", background)}>
                <p className={twMerge("text-l font-semibold", textName)}>
                    {message.senderData.firstName} {message.senderData.lastName}
                </p>
                <p className={twMerge("text-xl break-words", textContent)}>
                    {message.id}: {message.content}
                </p>
            </div>
        </li>
    );
};
export default Message;
