import { Outlet, useLocation, useNavigate } from "react-router";
import MainLink from "../../components/Main/MainLink";
import { useEffect } from "react";
import { ACCESS_TOKEN } from "../../constants/auth";
import Header from "../../components/Header/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { changeAuthenticationState } from "../../store/auth/authSlice";
import { useAppDispatch } from "../../hooks/useReduxHook";
import { isValidJWTToken } from "../../utils/Auth/isValidJwtToken";
import { refreshToken } from "../../utils/Auth/refreshToken";

// Constants
const ROOT_PATH = "/";
const HOME_PATH = "/home/";
const LOGIN_PATH = "/login/";
const LOGIN_TEXT = "Login";
const REGISTER_PATH = "/register/";
const REGISTER_TEXT = "Register";

const Main = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const redirectLink = location.pathname != ROOT_PATH ? location.pathname : HOME_PATH;


    useEffect(() => {
        const authenticate = async (): Promise<void> => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (token && isValidJWTToken(token)) {
                dispatch(changeAuthenticationState(true));
                navigate(redirectLink);
            } else {
                const refreshed = await refreshToken();
                if (!refreshed) {
                    dispatch(changeAuthenticationState(false));
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
