import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../redux/store";

interface Props {
    children: ReactNode;
}

const Providers = ({ children }: Props) => {
    return (
        <QueryProvider>
            <ReduxProvider store={store}>
                <>
                    {children}
                    <ReactQueryDevtools />
                </>
            </ReduxProvider>
        </QueryProvider>
    );
};

export default Providers;
