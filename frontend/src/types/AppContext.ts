import { ThemeColors } from "../constants/AppContext";
import { ApiStatusMessage } from "./ApiMessages";

export type AppContextType = {
    theme: ThemeColor;
    searchBarValue: string;
    messages: ApiStatusMessage[];
    isAuthenticated: boolean;
    currActiveChat: number | null;
    handleMessagesChange: (errorMessage: ApiStatusMessage) => void;
    handleSearchBarValueStateChange: (newValue: string) => void;
    handleCurrActiveChatChange: (newChatValue: number | null) => void;
    handleAuthenticationStateChange: (authenticated: boolean) => void;
    handleThemeChange: (newThemeValue: (typeof ThemeColors)[number]) => void;
};


export type ThemeColor = (typeof ThemeColors)[number];