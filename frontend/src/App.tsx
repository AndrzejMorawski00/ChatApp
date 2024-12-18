import { createBrowserRouter, RouterProvider } from "react-router";
import Main from "./routes/Main/Main";
import ErrorRoute from "./routes/Error/ErrorRoute";
import Login from "./routes/Auth/Login";
import LogoutAndRegister from "./routes/Auth/LogoutAndRegister";
import Logout from "./routes/Auth/Logout";
import Home from "./routes/Home/Home";
import ProtectedRoute from "./routes/Auth/ProtectedRoute";
import Profile from "./routes/Profile/Profile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        errorElement: <ErrorRoute />,
        children: [
            {
                path: "home/",
                element: (
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profile/",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "login/",
        element: <Login />,
    },
    {
        path: "register/",
        element: <LogoutAndRegister />,
    },
    {
        path: "logout/",
        element: <Logout />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
