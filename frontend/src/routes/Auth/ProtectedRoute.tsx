
import { useSelector } from "react-redux";
import { Navigate, Outlet} from "react-router";
import { StoreState } from "../../redux/store";

const ProtectedRoute = () => {
    const isAuthenticated = useSelector((state: StoreState) => state.auth.isAuthenticated);
    return isAuthenticated? <Outlet/> : <Navigate to='/login/' />
};

export default ProtectedRoute;
