import QueryProvider from "./QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RoutingProvider from "./RoutingProvider";
import MessageToastList from "../components/APIMessages/MessageToastList";
import { Provider as StoreProvider } from "react-redux";

import store from "../store/store";

const Providers = () => {
    return (
        <QueryProvider>
            <StoreProvider store={store}>
                <RoutingProvider />
                <MessageToastList />
                <ReactQueryDevtools />
            </StoreProvider>
        </QueryProvider>
    );
};

export default Providers;
