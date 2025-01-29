import QueryProvider from "./QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppContextProvider from "./AppContextProvider";
import RoutingProvider from "./RoutingProvider";
import MessageToastList from "../components/APIMessages/MessageToastList";

const Providers = () => {
    return (
        <QueryProvider>
            <AppContextProvider>
                <RoutingProvider />
                <MessageToastList />
                <ReactQueryDevtools />
            </AppContextProvider>
        </QueryProvider>
    );
};

export default Providers;
