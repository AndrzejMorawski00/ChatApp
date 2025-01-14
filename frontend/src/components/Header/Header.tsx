import { Link } from "react-router";
import useAppContext from "../../hooks/useAppContextHook";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

// Constants
const LOGOUT_PATH = "logout/";
const LOGOUT_TEXT = "Logout";

const Header = () => {
    const { isAuthenticated } = useAppContext();

    return (
        <header className="flex w-full items-center justify-end pr-4 min-h-20">
            <ThemeSwitch/>
            <h1 className="text-3xl text-textColor mr-4 font-montserrat tracking-wider">ChatApp</h1>
            {isAuthenticated && (
                <div>
                    <Link className="text-3xl text-textColor mr-4 font-montserrat tracking-wider linkStyles" to={LOGOUT_PATH}>{LOGOUT_TEXT}</Link>
                </div>
            )}
        </header>
    );
};

export default Header;


