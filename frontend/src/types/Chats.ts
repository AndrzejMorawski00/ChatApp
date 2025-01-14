import { ChatCategory } from "./enums";

export type ChatData = {
    id: number;
    chatType: ChatCategory;
    chatName: string;
    owner: number;
    isOwner : boolean;
    chatParticipants: ChatParticipant[];
};

export type NewChatRequest = {
    chatName: string;
    participantsID: number[];
};


export type ChatDeletionResponse = {
    chatID : number,
    userChatList: ChatData[],
}


export type ChatParticipant = {
    id: number;
    firstName: string;
    lastName: string;
};



export type ChatRouteParams = {
    chatID: string;
};
