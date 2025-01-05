import { Navigate, Outlet } from "react-router";
import useAppContext from "../../hooks/useAppContextHook";

// Constants
const REDITECT_LINK = "/login/";

const ProtectedRoute = () => {
    const { isAuthenticated } = useAppContext();
    return isAuthenticated ? <Outlet /> : <Navigate to={REDITECT_LINK} />;
};

export default ProtectedRoute;
