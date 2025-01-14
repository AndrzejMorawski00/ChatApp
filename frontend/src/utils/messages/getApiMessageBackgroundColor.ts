import { ApiMessageType } from "../../types/ApiMessages";

export const getApiMessageBackgroundColor = (status: ApiMessageType): string => {
    switch (status) {
        case "error":
            return "bg-errorApiMessageBackground";
        case "info":
            return "bg-infoApiMessageBackground";
        case "success":
            return "bg-successApiMessageBackground";
        default:
            return "bg-white";
    }
};
