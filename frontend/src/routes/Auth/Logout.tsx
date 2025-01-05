import { Navigate } from "react-router";
import { useEffect } from "react";
import useAppContext from "../../hooks/useAppContextHook";

const Logout = () => {
    const {handleAuthenticationStateChange} = useAppContext();
    
    useEffect(() => {handleAuthenticationStateChange(false)}, [])

    localStorage.clear();
    return <Navigate to="/" replace/>;
};

export default Logout;
