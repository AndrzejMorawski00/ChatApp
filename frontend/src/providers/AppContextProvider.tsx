import { createContext, ReactNode, useEffect, useState } from "react";

const MESSAGE_TIMEOUT = 100000;

export type MessageType = {
    id: number;
    message: string;
    messageType: string;
};

export type AppContextType = {
    theme: ThemeColor;
    searchBarValue: string;
    messages: MessageType[];
    isAuthenticated: boolean;
    currActiveChat: number | null;
    handleMessagesChange: (errorMessage: MessageType) => void;
    handleSearchBarValueStateChange: (newValue: string) => void;
    handleCurrActiveChatChange: (newChatValue: number | null) => void;
    handleAuthenticationStateChange: (authenticated: boolean) => void;
    handleThemeChange: (newThemeValue: (typeof ThemeColors)[number]) => void;
};


export const ThemeColors = ["dark", "light"] as const;
export type ThemeColor = (typeof ThemeColors)[number];


export const AppContext = createContext<AppContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

const AppContextProvider = ({ children }: Props) => {
    const [theme, setTheme] = useState<ThemeColor>("dark")
    const [currActiveChat, setCurrActiveChat] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [searchBarValue, setSearchBarValue] = useState<string>("");
    const [messages, setMessages] = useState<MessageType[]>([]);

    const handleThemeChange = (newThemeValue: ThemeColor): void => {
        setTheme((prevValue) => {
            document.body.classList.remove(prevValue);
            document.body.classList.add(newThemeValue);
            localStorage.setItem("theme", newThemeValue);
            return newThemeValue;
        });
    };

    useEffect(() => {
        const localStorageTheme = localStorage.getItem("theme") || "light";
        const osTheme = window.matchMedia("(prefers-color-scheme : dark)").matches;

        if (localStorageTheme === "dark" || osTheme) {
            handleThemeChange("dark");
            document.body.classList.add("dark");
        } else {
            handleThemeChange("light");
            document.body.classList.add("light");
        }
    }, []);

    const handleAuthenticationStateChange = (authenticated: boolean): void => {
        setIsAuthenticated(authenticated);
    };

    const handleSearchBarValueStateChange = (newValue: string): void => {
        setSearchBarValue(newValue);
    };

    const handleCurrActiveChatChange = (newChatValue: number | null): void => {
        setCurrActiveChat(newChatValue);
    };

    const handleMessagesChange = (message: MessageType): void => {
        setMessages((prevMessages) => [...prevMessages, message]),
            setTimeout(() => {
                setMessages((prevMessages) => prevMessages.filter((m) => m.id !== message.id));
            }, MESSAGE_TIMEOUT);
    };

    const appContext: AppContextType = {
        theme: theme,
        messages: messages,
        searchBarValue: searchBarValue,
        currActiveChat: currActiveChat,
        isAuthenticated: isAuthenticated,
        handleThemeChange: handleThemeChange,
        handleMessagesChange: handleMessagesChange,
        handleCurrActiveChatChange: handleCurrActiveChatChange,
        handleAuthenticationStateChange: handleAuthenticationStateChange,
        handleSearchBarValueStateChange: handleSearchBarValueStateChange,
    };

    return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
