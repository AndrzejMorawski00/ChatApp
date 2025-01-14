import { ChatMessageColors } from "../../types/messages";



export const getChatMessageColors = (isOwner : boolean) : ChatMessageColors => ({
    background: isOwner ? "bg-ownerMessageBackground" : "bg-guestMessageBackground",
    textName: isOwner ? "text-ownerMessageText" : "text-guestMessageText",
    textContent: isOwner ? "text-ownerMessageContentText" : "text-guestMessageContentText",
})