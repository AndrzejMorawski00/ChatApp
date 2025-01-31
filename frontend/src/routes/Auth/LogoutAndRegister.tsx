import Register from "./Register";
import { useEffect } from "react";
import { changeAuthenticationState } from "../../store/auth/authSlice";
import { useAppDispatch } from "../../hooks/useReduxHook";

const LogoutAndRegister = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(changeAuthenticationState(false));
    }, []);
    return <Register />;
};

export default LogoutAndRegister;
