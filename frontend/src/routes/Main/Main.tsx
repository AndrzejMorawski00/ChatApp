import { Outlet, useLocation, useNavigate } from "react-router";
import { ACCESS_TOKEN } from "../../constants/auth";
import { useEffect } from "react";
import { isValidJwtToken } from "../../utils/Auth/isValidJwtToken";
import { useDispatch, useSelector } from "react-redux";
import { logout, setIsAuthenticated } from "../../redux/auth/isAuthenticatedSlice";
import Header from "../../components/Header/Header";
import MainLink from "../../components/Main/MainLink";
import { RootState } from "../../redux/store";
import { refreshToken } from "../../utils/api/refreshToken";

const Main = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (token && isValidJwtToken(token)) {
                dispatch(setIsAuthenticated({ isAuthenticated: true }));
                {
                    location.pathname != "/" ? navigate(location.pathname) : navigate("/home/");
                }
                return;
            } else if (isAuthenticated) {
                const refreshTokenResult = await refreshToken();
                if (!refreshTokenResult) {
                    dispatch(logout());
                }
            }
            navigate("/");
        };

        auth();
    }, [dispatch, isAuthenticated, location.pathname, navigate]);

    return (
        <div>
            <Header />
            {isAuthenticated ? (
                <Outlet />
            ) : (
                <div>
                    <MainLink linkPath="/login/" buttonText="Login" />
                    <MainLink linkPath="register" buttonText="Register" />
                </div>
            )}
        </div>
    );
};

export default Main;
