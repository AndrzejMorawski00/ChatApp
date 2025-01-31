import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { authenticateUser } from "../../store/auth/authSlice";
import { useAppDispatch } from "../../hooks/useReduxHook";

// Constants
const ROOT_PATH = "/";
const DEFAULT_REDIRECT_LINK = "/home/";
const INVALID_AUTH_REDIRECT_LINK = "/login/";

const useAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const redirectLink: string = location.pathname != ROOT_PATH ? location.pathname : DEFAULT_REDIRECT_LINK;

    const dispatch = useAppDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const authenticate = async (): Promise<void> => {
            const result = await dispatch(authenticateUser());
            if (result.payload) {
                navigate(redirectLink);
                return;
            }
            localStorage.clear();
            navigate(INVALID_AUTH_REDIRECT_LINK);
        };
        authenticate();
    }, [navigate, isAuthenticated]);
};

export default useAuth;
