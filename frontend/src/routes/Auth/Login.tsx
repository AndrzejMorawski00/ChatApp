import { useState } from "react";

import { isValidKeyValue } from "../../utils/common";
import { isValidLoginForm } from "../../utils/auth/isValidAuthForm";
import { Link } from "react-router";
import { LoginFormType } from "../../types/auth";
import useLoginUser from "../../api/auth/useLoginUser";
import Header from "../../components/Header/Header";

// Constants
const INITIAL_LOGIN_FORM: LoginFormType = {
    email: "",
    password: "",
};

const REGISTER_PATH = "/register/";
const REGISTER_TEXT = "Register";

const Register = () => {
    const [formData, setFormData] = useState<LoginFormType>(INITIAL_LOGIN_FORM);
    const { loginUser, loading, error } = useLoginUser();

    const handleFormDataChange = <T extends keyof LoginFormType>(key: string, value: LoginFormType[T]): void => {
        if (isValidKeyValue(key, formData)) {
            setFormData({
                ...formData,
                [key]: value,
            });
            return;
        }
        throw new Error(`Invalid key: ${key}`);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!isValidLoginForm(formData)) {
            return;
        }
        await loginUser(formData);
        setFormData(INITIAL_LOGIN_FORM);
    };

    return (
        <div className="flex flex-col items-center w-screen h-screen gap-2 x">
            <Header/>
            <form action="" onSubmit={handleFormSubmit} className="flex flex-col gap-2 mx-2 my-2 mt-10">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-2xl tracking-wider text-textColor">
                        Email:
                    </label>
                    <input
                        className="px-3 py-2 text-xl tracking-wider border-b-2 outline-none bg-formInputBackgroundColor text-formInputTextColor"
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-2xl tracking-wider text-textColor">
                        Password:
                    </label>
                    <input
                        className="px-3 py-2 text-xl tracking-wider border-b-2 outline-none bg-formInputBackgroundColor text-formInputTextColor"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                    />
                </div>
                <input
                    type="submit"
                    value="Login"
                    disabled={loading}
                    className="px-3 py-1 mt-3 text-4xl duration-300 transform border-2 rounded-md font-montserrat text-textColor bg-mainButtonBackground hover:scale-105"
                />
            </form>
            <div>
                <Link
                    className="mr-4 text-2xl tracking-wider text-textColor font-montserrat linkStyles"
                    to={REGISTER_PATH}
                >
                    {REGISTER_TEXT}
                </Link>
            </div>
            {loading && (
                <p className="mt-4 text-2xl font-montserrat text-mainButtonBackground animate-pulse">Loading...</p>
            )}
            {error && (
                <p className="mt-4 text-2xl text-red-600 font-montserrat animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Register
