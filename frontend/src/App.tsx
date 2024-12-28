import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Main from "./routes/Main/Main";
import Login from "./routes/Auth/Login";
import LogoutAndRegister from "./routes/Auth/LogoutAndRegister";
import Logout from "./routes/Auth/Logout";
import Home from "./routes/Home/Home";
import ProtectedRoute from "./routes/Auth/ProtectedRoute";
import Providers from "./providers/Providers";
import Friends from "./routes/Friends/Friends";
import Chats from "./routes/Chats/Chats";
import ChatDetails from "./components/Chats/ChatDetails";

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
                        element: <Home />,
                        children: [
                            {
                                path: 'friends/',
                                element: <Friends/>
                            },
                            {
                                path: 'chats/',
                                element: <Chats/>,
                                children: [
                                    {
                                        path: ":chatID",
                                        element: <ChatDetails />
                                    }
                                ]
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

function App() {
    return (
        <Providers>
            <RouterProvider router={router} />
        </Providers>
    );
}

export default App;
