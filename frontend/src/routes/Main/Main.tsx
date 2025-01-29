import { Outlet, useLocation, useNavigate } from "react-router";
import MainLink from "../../components/Main/MainLink";

import useAppContext from "../../hooks/useAppContextHook";
import { useEffect } from "react";
import { ACCESS_TOKEN } from "../../constants/auth";
import { refreshToken } from "../../utils/auth/refreshToken";
import { isValidJWTToken } from "../../utils/auth/isValidJWTToken";
import Header from "../../components/Header/Header";

// Constants
const ROOT_PATH = "/";
const HOME_PATH = "/home/";
const LOGIN_PATH = "/login/";
const LOGIN_TEXT = "Login";
const REGISTER_PATH = "/register/";
const REGISTER_TEXT = "Register";

const Main = () => {
    const location = useLocation();
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
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
    }, [isAuthenticated, accessToken]);
    return (
        <div className="flex flex-col w-screen h-screen bg-backgrouolor">
            <Header />
            {isAuthenticated ? (
                <Outlet />
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-full gap-10">
                    <MainLink destination={LOGIN_PATH} buttonText={LOGIN_TEXT} />
                    <MainLink destination={REGISTER_PATH} buttonText={REGISTER_TEXT} />
                </div>
            )}
        </div>
    );
};

export default Main;
