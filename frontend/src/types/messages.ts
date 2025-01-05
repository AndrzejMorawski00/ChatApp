export type MessageType = {
    id : number,
    chatID : number,
    sendTime : Date,
    senderData: SenderDataType,
    content : string
}

export type SenderDataType = {
    id : number,
    firstName : string,
    lastName : string
}

export type GetMessageType = {
    chatID : number,
    pageNumber : number,
}


export type PaginatedResponse<T> = {
    count: number;
    next: number | null;
    prev: number | null;
    items: T[];
};
