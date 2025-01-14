import { useState } from "react";
import { RegisterFormType } from "../../types/auth";
import { isValidKeyValue } from "../../utils/common";
import { isValidRegisterForm } from "../../utils/auth/isValidAuthForm";
import { Link } from "react-router";
import useRegisterUser from "../../api/auth/useRegisterUser";

const INITIAL_REGISTER_FORM: RegisterFormType = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
};

const LOGIN_PATH = "/login/";
const LOGIN_TEXT = "Login";

const ERROR_MESSAGE = "Invalid key:";

const Register = () => {
    const [formData, setFormData] = useState<RegisterFormType>(INITIAL_REGISTER_FORM);
    const { registerUser, loading, error } = useRegisterUser();

    const handleFormDataChange = <T extends keyof RegisterFormType>(key: string, value: RegisterFormType[T]): void => {
        if (isValidKeyValue(key, formData)) {
            setFormData({
                ...formData,
                [key]: value,
            });
            return;
        }
        throw new Error(`${ERROR_MESSAGE} ${key}`);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!isValidRegisterForm(formData)) {
            return;
        }
        await registerUser(formData);
        setFormData(INITIAL_REGISTER_FORM);
    };

    return (
        <div className="flex flex-col gap-1 items-center w-screen h-screen justify-center">
            <header>
                <h2 className="text-4xl text-textColor tracking-wider mb-4">Register User:</h2>
            </header>
            <form action="" onSubmit={handleFormSubmit} className="flex flex-col gap-2 mt-2">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-2">
                        {" "}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="firstName" className="text-2xl tracking-wider text-textColor">
                                First Name:
                            </label>
                            <input
                                className="px-3 py-1 text-xl outline-none border-b-2 bg-formInputBackgroundColor text-formInputTextColor tracking-wider"
                                type="text"
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="lastName" className="text-2xl tracking-wider text-textColor">
                                Last Name:
                            </label>
                            <input
                                className="px-3 py-1 text-xl outline-none border-b-2 bg-formInputBackgroundColor text-formInputTextColor tracking-wider"
                                type="text"
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-2xl tracking-wider text-textColor">
                                Email:
                            </label>
                            <input
                                className="px-3 py-1 text-xl outline-none border-b-2 bg-formInputBackgroundColor text-formInputTextColor tracking-wider"
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {" "}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-2xl tracking-wider text-textColor">
                                Password:
                            </label>
                            <input
                                className="px-3 py-1 text-xl outline-none border-b-2 bg-formInputBackgroundColor text-formInputTextColor tracking-wider"
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="repeatPassword" className="text-2xl tracking-wider text-textColor">
                                Repeat Password:
                            </label>
                            <input
                                className="px-3 py-1 text-xl outline-none border-b-2 bg-formInputBackgroundColor text-formInputTextColor"
                                value={formData.repeatPassword}
                                type="password"
                                id="repeatPassword"
                                onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <input
                    type="submit"
                    value="Register"
                    className="font-montserrat text-textColor bg-mainButtonBackground text-4xl px-3 mt-4 py-1 border-2 rounded-md transform duration-300 hover:scale-105"
                />
                <div className="flex justify-center">
                    <Link
                        className="text-2xl w-fit text-center text-textColor mr-4 font-montserrat tracking-wider linkStyles"
                        to={LOGIN_PATH}
                    >
                        {LOGIN_TEXT}
                    </Link>
                </div>
            </form>
            {loading && (
                <p className="text-2xl font-montserrat text-mainButtonBackground animate-pulse mt-4">Loading...</p>
            )}
            {error && (
                <p className="text-2xl font-montserrat text-red-600 bg-red-100 border-l-4 border-red-500 p-3 rounded-md mt-4">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Register;
