import { ChatCategory } from "./enums";

export type ChatObjectType = {
    id: number;
    chatType: ChatCategory;
    chatName: string;
    owner: number;
    isOwner : boolean;
    chatParticipants: ChatParticipantType[];
};

export type NewChatType = {
    chatName: string;
    participantsID: number[];
};


export type ChatDeletedResponse = {
    chatID : number,
    userChatList: ChatObjectType[],
}


export type ChatParticipantType = {
    id: number;
    firstName: string;
    lastName: string;
};
