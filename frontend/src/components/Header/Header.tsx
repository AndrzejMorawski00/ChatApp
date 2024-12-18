import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link, useLocation } from "react-router";

const Header = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    const linkValue: string = location.pathname === "/profile/" ? "/" : "/profile/";
    const linkText: string = location.pathname === "/profile/" ? "Home" : "Profile";

    return (
        <header>
            <h1>ChatApp</h1>
            {isAuthenticated && (
                <div>
                    <Link to={linkValue}>{linkText}</Link>
                    <Link to="/logout/">Logout</Link>
                </div>
            )}
        </header>
    );
};

export default Header;
