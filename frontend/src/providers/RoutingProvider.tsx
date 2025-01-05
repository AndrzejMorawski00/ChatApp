import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import ProtectedRoute from "../routes/Auth/ProtectedRoute";
import Logout from "../routes/Auth/Logout";
import Login from "../routes/Auth/Login";
import LogoutAndRegister from "../routes/Auth/LogoutAndRegister";
import Main from "../routes/Main/Main";
import Home from "../routes/Home/Home";
import Friends from "../routes/Friends/Friends";
import SignalRContextProvider from "./SignalRContextProvider";
import Chats from "../routes/Chats/Chats";
import ChatDetails from "../components/Chats/ChatDetails";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: "/",
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "home/",
                        element: (
                            <SignalRContextProvider>
                                <Home />
                            </SignalRContextProvider>
                        ),
                        children: [
                            {
                                path: "friends/",
                                element: <Friends />,
                            },
                            {
                                path: "chats/",
                                element: <Chats />,
                                children: [
                                    {
                                        path: ":chatID",
                                        element: <ChatDetails />,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: "logout/",
                        element: <Logout />,
                    },
                ],
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <LogoutAndRegister />,
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);

const RoutingProvider = () => {
    return <RouterProvider router={router} />;
};
export default RoutingProvider;
