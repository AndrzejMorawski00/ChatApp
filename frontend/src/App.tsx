import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Main from "./routes/Main/Main";
import Login from "./routes/Auth/Login";
import LogoutAndRegister from "./routes/Auth/LogoutAndRegister";
import Logout from "./routes/Auth/Logout";
import Home from "./routes/Home/Home";
import ProtectedRoute from "./routes/Auth/ProtectedRoute";
import Providers from "./providers/Providers";
import One from "./routes/Home/One";

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
                                path: "1/",
                                element: <One />,
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
