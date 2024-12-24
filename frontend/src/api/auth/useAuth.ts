import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { StoreState } from "../../redux/store";
import { useEffect } from "react";
import { ACCESS_TOKEN } from "../../constants/auth";
import { isValidJwtToken } from "../../utils/auth/isValidJwtToken";
import { extractUserData } from "../../utils/auth/extractUserData";
import { authenticateUser, logout } from "../../redux/auth/authSlice";
import { refreshToken } from "../../utils/auth/refreshToken";

const useAuth = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const redirectLink = location.pathname != "/" ? location.pathname : "/home/";
    const { isAuthenticated, userData: prevUserData } = useSelector((state: StoreState) => state.auth);

    useEffect(() => {
        const authenticate = async (): Promise<void> => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            console.log('Authenticate user:');
            if (token && isValidJwtToken(token)) {
                const userData = extractUserData(token);
                if (!userData) {
                    dispatch(authenticateUser({ isAuthenticated: false, userData: null }));
                    console.log('1');
                    return;
                }
                dispatch(authenticateUser({ isAuthenticated: true, userData: userData }));
                console.log('2');
                navigate(redirectLink);
            } else {
                const refreshed = await refreshToken();
                if (!refreshed) {
                    dispatch(logout());
                    console.log('3');
                    console.log(redirectLink);
                    if (location.pathname !== '/') {
                        navigate("/login/");
                    }
                } else {
                    console.log('4');
                    dispatch(authenticateUser({ isAuthenticated: true, userData: prevUserData }));

                    navigate(redirectLink);
                }
            }
        };
        authenticate();
    }, [dispatch, navigate, isAuthenticated]);
};

export default useAuth;
