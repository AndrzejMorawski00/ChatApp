import Register from "./Register";
import useAppContext from "../../hooks/useAppContextHook";
import { useEffect } from "react";

const LogoutAndRegister = () => {
    const {handleAuthenticationStateChange} = useAppContext();
    
    useEffect(() => {
        handleAuthenticationStateChange(false);
    }, [])
    return <Register />;
};

export default LogoutAndRegister;
