export type ChatObjectType = {
    id : number, 
    chatType : ChatType,

    chatName : string,

    owner : number,
    participants : ChatParticipantType[]

}


export enum ChatType {
    DM = 0,
    Group = 1,
}

export type ChatParticipantType = {
    id : number,
    firstName : string,
    lastName : string,
}
