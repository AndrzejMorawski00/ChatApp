import { createContext, ReactNode, useState } from "react";

export type AppContextType = {
    searchBarValue: string;
    isAuthenticated: boolean;
    currActiveChat: number | null;
    handleCurrActiveChatChange: (newChatValue: number | null) => void;
    handleAuthenticationStateChange: (authenticated: boolean) => void;
    handleSearchBarValueStateChange: (newValue: string) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

const AppContextProvider = ({ children }: Props) => {
    const [currActiveChat, setCurrActiveChat] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [searchBarValue, setSearchBarValue] = useState<string>("");

    const handleAuthenticationStateChange = (authenticated: boolean): void => {
        setIsAuthenticated(authenticated);
    };

    const handleSearchBarValueStateChange = (newValue: string): void => {
        setSearchBarValue(newValue);
    };

    const handleCurrActiveChatChange = (newChatValue: number | null): void => {
        setCurrActiveChat(newChatValue);
    };

    const appContext: AppContextType = {
        isAuthenticated: isAuthenticated,
        searchBarValue: searchBarValue,
        currActiveChat: currActiveChat,
        handleCurrActiveChatChange: handleCurrActiveChatChange,
        handleAuthenticationStateChange: handleAuthenticationStateChange,
        handleSearchBarValueStateChange: handleSearchBarValueStateChange,
    };

    return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
