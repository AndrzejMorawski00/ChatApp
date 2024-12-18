import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../redux/store";
import { injectDispatch } from "../utils/api/apiConfig";

interface Props {
    children: ReactNode;
}

const Providers = ({ children }: Props) => {
    injectDispatch(store)
    return (
        <ReduxProvider store={store}>
            <QueryProvider>
                <>
                    {children}
                    <ReactQueryDevtools />
                </>
            </QueryProvider>
        </ReduxProvider>
    );
};

export default Providers;
