import { useDispatch } from "react-redux";
import { Navigate } from "react-router";
import { logout } from "../../redux/auth/authSlice";
import { useEffect } from "react";

const Logout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logout());
    }, [dispatch]);
    
    return <Navigate to="/" />;
};

export default Logout;
