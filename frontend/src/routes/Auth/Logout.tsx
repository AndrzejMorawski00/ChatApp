import { Navigate } from "react-router";
import { useEffect } from "react";
import { changeAuthenticationState } from "../../store/auth/authSlice";
import { useAppDispatch } from "../../hooks/useReduxHook";


const Logout = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(changeAuthenticationState(false));
    }, []);

    localStorage.clear();
    return <Navigate to="/" replace />;
};

export default Logout;
