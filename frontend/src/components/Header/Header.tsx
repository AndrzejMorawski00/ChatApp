import { Link, useLocation } from "react-router";
import useAppContext from "../../hooks/useAppContextHook";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import HeaderLink from "./HeaderLink";

// Constants
const LOGOUT_PATH = "logout/";
const LOGOUT_TEXT = "Logout";
const HOME_PATH = "/home/";
const HOME_TEXT = "Home";
const MIN_PATH_SEGMENT = 3;
const HOME_PATH_SEGMENT = "home";

const Header = () => {
    const { isAuthenticated } = useAppContext();
    const location = useLocation();
    const pathSegments = location.pathname.split("/");
    const includeHomeLink = pathSegments.includes(HOME_PATH_SEGMENT) && pathSegments.length > MIN_PATH_SEGMENT;
    return (
        <header className="flex items-center justify-between w-full pr-4 min-h-16">
            <div className="flex gap-2 ml-4">
                <Link to='/' className="mr-4 text-3xl tracking-wider text-textColor font-montserrat linkStyles">ChatApp</Link>
                <ThemeSwitch />
            </div>
            <div className="flex ">
                {isAuthenticated && (
                    <>
                        {includeHomeLink && <HeaderLink destination={HOME_PATH} name={HOME_TEXT} />},
                        <HeaderLink destination={LOGOUT_PATH} name={LOGOUT_TEXT} />
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
