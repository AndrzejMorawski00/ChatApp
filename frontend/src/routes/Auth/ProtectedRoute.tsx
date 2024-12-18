import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate} from "react-router";

interface Props {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    return isAuthenticated? children : <Navigate to='/' />
};

export default ProtectedRoute;
