export type ChatMessage = {
    id: number;
    chatID: number;
    sendTime: Date;
    senderData: SenderData;
    content: string;
};

export type SenderData = {
    id: number;
    isOwner: boolean;
    firstName: string;
    lastName: string;
};

export type MessageQuery = {
    chatID: number;
    pageNumber: number;
};

export type PaginatedData<T> = {
    count: number;
    next: number | null;
    prev: number | null;
    items: T[];
};

export type ChatMessageColors = {
    background: string;
    textName: string;
    textContent: string;
};
