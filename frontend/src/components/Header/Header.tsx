import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link } from "react-router";

const Header = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <header>
            <h1>ChatApp</h1>
            {isAuthenticated && (
                <div>
                    <Link to="/logout/">Logout</Link>
                </div>
            )}
        </header>
    );
};

export default Header;
