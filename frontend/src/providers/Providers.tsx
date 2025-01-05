import QueryProvider from "./QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppContextProvider from "./AppContextProvider";
import RoutingProvider from "./RoutingProvider";





const Providers = () => {
    return (
        <QueryProvider>
            <AppContextProvider>
                <>
                    <RoutingProvider/>
                    <ReactQueryDevtools />
                </>
            </AppContextProvider>
        </QueryProvider>
    );
};

export default Providers;
