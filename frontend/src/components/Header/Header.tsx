import HeaderLink from "./HeaderLink";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Link, useLocation } from "react-router";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

// Constants
const LOGOUT_PATH = "logout/";
const LOGOUT_TEXT = "Logout";
const HOME_PATH = "/home/";
const HOME_TEXT = "Home";
const MIN_PATH_SEGMENT = 3;
const HOME_PATH_SEGMENT = "home";

const Header = () => {
    const {isAuthenticated} = useSelector((state : RootState) => state.auth)
    const location = useLocation();
    const pathSegments = location.pathname.split("/");
    const includeHomeLink = pathSegments.includes(HOME_PATH_SEGMENT) && pathSegments.length > MIN_PATH_SEGMENT;
    const logoLink = isAuthenticated ? HOME_PATH : "/";

    return (
        <header className="flex items-center justify-between w-full pr-4 min-h-16">
            <div className="flex gap-2 ml-4">
                <Link to={logoLink} className="mr-4 text-3xl tracking-wider text-textColor font-montserrat linkStyles">
                    ChatApp
                </Link>
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
