import { ReactNode } from "react";
import { getBaseAPIUrl } from "../utils/api/apiConfig";
import { ACCESS_TOKEN } from "../constants/auth";
import { createSignalRContext } from "react-signalr/signalr";

export const SignalRContext = createSignalRContext();

const CHAT_HUB_ENDPOINT = "chatHub";

interface Props {
    children: ReactNode;
}

const SignalRContextProvider = ({ children }: Props) => {
    const token = localStorage.getItem(ACCESS_TOKEN) || "";

    return (
        <SignalRContext.Provider
            connectEnabled={!!token}
            accessTokenFactory={() => token}
            dependencies={[token]}
            url={`${getBaseAPIUrl()}${CHAT_HUB_ENDPOINT}`}
        >
            {children}
        </SignalRContext.Provider>
    );
};

export default SignalRContextProvider;
