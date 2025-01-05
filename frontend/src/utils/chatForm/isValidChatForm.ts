export const isValidChatForm = (chatName: string, participants: Number[]): boolean => {
    return chatName.trim() !== "" && participants.length > 0;
};
