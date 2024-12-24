import {Outlet } from "react-router";
import { useSelector } from "react-redux";
import MainLink from "../../components/Main/MainLink";
import useAuth from "../../api/auth/useAuth";
import { StoreState } from "../../redux/store";

const Main = () => {
    useAuth();
    const isAuthenticated = useSelector((store: StoreState) => store.auth.isAuthenticated);

    return (
        <div className="flex flex-col h-screen w-screen">
            <header className="flex justify-end">
                <h1>Chat App</h1>
                {isAuthenticated && (
                    <MainLink destination='/logout/' buttonText="Logout" />
                )}
            </header>
            {isAuthenticated ? (
                <Outlet />
            ) : (
                <div className="flex flex-col gap-10 w-full h-full items-center justify-center">
                    <MainLink destination="login/" buttonText="Login"/>
                    <MainLink destination="register/" buttonText="Register"/>
                </div>
            )}
        </div>
    );
};

export default Main;
