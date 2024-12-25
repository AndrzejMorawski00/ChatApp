import { Link, Outlet } from "react-router";


const Home = () => {
    return (
        <div>
            <Link to='friends/'>Friends</Link>
            {/* <Chats/> */}

            <Outlet/>
        </div>
    );
};

export default Home;
