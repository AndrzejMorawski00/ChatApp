import { ThemeColors } from "../constants/store"
import { ApiStatusMessage } from "./ApiMessages"

export type ActiveChat = {
    activeChat : number | null
}

export type MessagesType = {
    messages : ApiStatusMessage[]
}
export type ThemeColor = (typeof ThemeColors)[number];
