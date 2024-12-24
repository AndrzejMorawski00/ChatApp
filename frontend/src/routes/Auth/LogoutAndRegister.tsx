import { useDispatch } from "react-redux";
import Register from "./Register";
import { logout } from "../../redux/auth/authSlice";

const LogoutAndRegister = () => {
    const dispatch = useDispatch();
    dispatch(logout());

    return <Register />;
};

export default LogoutAndRegister;
