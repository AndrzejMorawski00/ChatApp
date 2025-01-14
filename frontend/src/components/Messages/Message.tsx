import { MessageType } from "../../types/messages";

interface Props {
    message: MessageType;
    fetchNextRef?: React.Ref<HTMLLIElement>;
}

const Message = ({ message, fetchNextRef }: Props) => {
    return (
        <li
            ref={fetchNextRef ? fetchNextRef : null}
            className={`flex ${message.senderData.isOwner ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`${
                    message.senderData.isOwner ? "bg-ownerMessageBackground" : "bg-guestMessageBackground"
                } p-2 rounded-lg max-w-[50%] break-words`}
            >
                <p
                    className={`text-l font-semibold ${
                        message.senderData.isOwner ? "text-ownerMessageText" : "text-guestMessageText"
                    }`}
                >
                    {message.senderData.firstName} {message.senderData.lastName}
                </p>
                <p
                    className={`text-xl ${
                        message.senderData.isOwner ? "text-ownerMessageContentText" : "text-guestMessageContentText"
                    } break-words`}
                >
                    {message.id}: {message.content}
                </p>
            </div>
        </li>
    );
};
export default Message;
