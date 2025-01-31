import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { RootState } from "../../store/store";

// Constants
const REDITECT_LINK = "/login/";

const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    return isAuthenticated ? <Outlet /> : <Navigate to={REDITECT_LINK} />;
};

export default ProtectedRoute;
