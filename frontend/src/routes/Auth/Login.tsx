import { useState } from "react";

import { isValidKeyValue } from "../../utils/common";
import { isValidLoginForm } from "../../utils/auth/isValidAuthForm";
import { Link } from "react-router";
import { LoginFormType } from "../../types/auth";
import useLoginUser from "../../api/auth/useLoginUser";

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
        <div className="flex flex-col gap-2 items-center w-screen h-screen justify-center">
            <header>
                <h2 className="text-4xl text-textColor tracking-wider mb-4">Login User:</h2>
            </header>
            <form action="" onSubmit={handleFormSubmit} className="flex flex-col gap-2 mx-2 my-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-2xl tracking-wider text-textColor">
                        Email:
                    </label>
                    <input
                        className="px-3 py-2 text-xl outline-none border-b-2 bg-formInputBackgroundColor text-formInputTextColor tracking-wider"
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
                        className="px-3 py-2 text-xl outline-none border-b-2 bg-formInputBackgroundColor text-formInputTextColor tracking-wider"
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
                    className="font-montserrat text-textColor bg-mainButtonBackground text-4xl px-3 mt-3 py-1 border-2 rounded-md transform duration-300 hover:scale-105"
                />
            </form>
            <div>
                <Link
                    className="text-2xl text-textColor mr-4 font-montserrat tracking-wider linkStyles"
                    to={REGISTER_PATH}
                >
                    {REGISTER_TEXT}
                </Link>
            </div>
            {loading && (
                <p className="text-2xl font-montserrat text-mainButtonBackground animate-pulse mt-4">Loading...</p>
            )}
            {error && (
                <p className="text-2xl font-montserrat text-red-600  animate-pulse mt-4">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Register
