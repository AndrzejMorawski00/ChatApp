export type SimpleMessage = {
    userName: string;
    content: string;
    cid: number;
    createdTime: string;
    id: number;
};

export type NewSimpleMessage = {
    userName: string;
    content: string;
    cid: number;
};


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


export type NewMessage = {
    chatID : number,
    content : string,
}