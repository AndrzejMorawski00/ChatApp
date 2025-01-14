import { Link, Outlet, useLocation, useNavigate } from "react-router";
import MainLink from "../../components/Main/MainLink";

import useAppContext from "../../hooks/useAppContextHook";
import { useEffect } from "react";
import { ACCESS_TOKEN } from "../../constants/auth";
import { refreshToken } from "../../utils/auth/refreshToken";
import { isValidJWTToken } from "../../utils/auth/isValidJWTToken";
import Header from "../../components/Header/Header";

// Constants
const HOME_PATH = "/home/";
const ROOT_PATH = "/";
const LOGIN_PATH = "/login/";
const REGISTER_PATH = "/register/";
const LOGOUT_PATH = "/logout/";
const LOGIN_TEXT = "Login";
const REGISTER_TEXT = "Register";
const LOGOUT_TEXT = "Logout";

const Main = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const redirectLink = location.pathname != ROOT_PATH ? location.pathname : HOME_PATH;
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
                    navigate(ROOT_PATH);
                } else {
                    navigate(redirectLink);
                }
            }
        };
        authenticate();
    }, [isAuthenticated]);
    return (
        <div className="flex flex-col h-screen w-screen bg-backgrouolor">
            <Header/>
            {isAuthenticated ? (
                <Outlet />
            ) : (
                <div className="flex flex-col gap-10 w-full h-full items-center justify-center">
                    <MainLink destination={LOGIN_PATH} buttonText={LOGIN_TEXT} />
                    <MainLink destination={REGISTER_PATH} buttonText={REGISTER_TEXT} />
                </div>
            )}
        </div>
    );
};

export default Main;
