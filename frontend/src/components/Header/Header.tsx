import { Link } from "react-router";
import useAppContext from "../../hooks/useAppContextHook";

// Constants
const LOGOUT_PATH = "logout/";
const LOGOUT_TEXT = "Logout";

const Header = () => {
    const { isAuthenticated } = useAppContext();

    return (
        <header>
            <h1>ChatApp</h1>
            {isAuthenticated && (
                <div>
                    <Link to={LOGOUT_PATH}>{LOGOUT_TEXT}</Link>
                </div>
            )}
        </header>
    );
};

export default Header;
