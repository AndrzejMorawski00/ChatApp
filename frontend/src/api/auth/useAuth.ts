import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { ACCESS_TOKEN } from "../../constants/auth";
import { refreshToken } from "../../utils/auth/refreshToken";
import useAppContext from "../../hooks/useAppContextHook";
import { isValidJWTToken } from "../../utils/auth/isValidJWTToken";

// Constants
const ROOT_PATH = "/";
const DEFAULT_REDIRECT_LINK = "/home/";
const INVALID_AUTH_REDIRECT_LINK = "/login/";

const useAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const redirectLink: string = location.pathname != ROOT_PATH ? location.pathname : DEFAULT_REDIRECT_LINK;
    const { isAuthenticated, handleAuthenticationStateChange } = useAppContext();

    useEffect(() => {
        const authenticate = async (): Promise<void> => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (token && isValidJWTToken(token)) {
                handleAuthenticationStateChange(true);
                navigate(redirectLink);
            } else {
                const refreshed = await refreshToken();
                if (!refreshed) {
                    handleAuthenticationStateChange(false);
                    localStorage.clear();
                    if (location.pathname !== ROOT_PATH) {
                        navigate(INVALID_AUTH_REDIRECT_LINK);
                    }
                } else {
                    navigate(redirectLink);
                }
            }
        };
        authenticate();
    }, [navigate, isAuthenticated, handleAuthenticationStateChange]);
};

export default useAuth;
