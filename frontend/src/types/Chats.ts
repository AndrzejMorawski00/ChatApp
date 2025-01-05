import { ChatCategory } from "./enums";

export type ChatObjectType = {
    id: number;
    chatType: ChatCategory;

    chatName: string;

    owner: number;
    participants: ChatParticipantType[];
};

export type NewChatType = {
    chatName: string;
    participantsID: number[];
};



export type ChatParticipantType = {
    id: number;
    firstName: string;
    lastName: string;
};
