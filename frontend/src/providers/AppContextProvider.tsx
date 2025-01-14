import { createContext, ReactNode, useEffect, useState } from "react";
import { ApiStatusMessage } from "../types/ApiMessages";
import { AppContextType, ThemeColor } from "../types/AppContext";

//
const MESSAGE_TIMEOUT = 100000;
export const AppContext = createContext<AppContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

const AppContextProvider = ({ children }: Props) => {
    const [theme, setTheme] = useState<ThemeColor>("dark");
    const [currActiveChat, setCurrActiveChat] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [searchBarValue, setSearchBarValue] = useState<string>("");
    const [messages, setMessages] = useState<ApiStatusMessage[]>([
        {
            id: Infinity,
            messageType: "error",
            message: "This is Error Message",
        },
        {
            id: Infinity,
            messageType: "success",
            message: "This is Success Message",
        },
        {
            id: Infinity,
            messageType: "info",
            message: "This is Info Message",
        },
    ]);

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

    const handleMessagesChange = (message: ApiStatusMessage): void => {
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
