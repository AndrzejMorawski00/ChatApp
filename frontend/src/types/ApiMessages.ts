import { API_MESSAGE_TYPE } from "../constants/ApiMessageStatus";

export type NewApiStatusMessage = {
    type: ApiMessageType;
    content: string;
};

export type ApiStatusMessage = {
    id: number;
    messageType: ApiMessageType;
    message: string;
};

export type ApiMessageType = (typeof API_MESSAGE_TYPE)[number];
