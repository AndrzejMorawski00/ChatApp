import { useState } from "react";
import { RegisterFormType } from "../../types/auth";
import { isValidKeyValue } from "../../utils/common";
import { isValidRegisterForm } from "../../utils/Auth/isValidAuthForm";
import { Link } from "react-router";
import useRegisterUser from "../../api/auth/useRegisterUser";
import Header from "../../components/Header/Header";

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
        <div className="flex flex-col items-center w-screen h-screen gap-1">
            <Header />
            <form action="" onSubmit={handleFormSubmit} className="flex flex-col gap-2 mt-10">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-2">
                        {" "}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="firstName" className="text-2xl tracking-wider text-textColor">
                                First Name:
                            </label>
                            <input
                                className="px-3 py-1 text-xl tracking-wider border-b-2 outline-none bg-formInputBackgroundColor text-formInputTextColor"
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
                                className="px-3 py-1 text-xl tracking-wider border-b-2 outline-none bg-formInputBackgroundColor text-formInputTextColor"
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
                                className="px-3 py-1 text-xl tracking-wider border-b-2 outline-none bg-formInputBackgroundColor text-formInputTextColor"
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
                                className="px-3 py-1 text-xl tracking-wider border-b-2 outline-none bg-formInputBackgroundColor text-formInputTextColor"
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
                                className="px-3 py-1 text-xl border-b-2 outline-none bg-formInputBackgroundColor text-formInputTextColor"
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
                    className="px-3 py-1 mt-4 text-4xl duration-300 transform border-2 rounded-md font-montserrat text-textColor bg-mainButtonBackground hover:scale-105"
                />
                <div className="flex justify-center">
                    <Link
                        className="mr-4 text-2xl tracking-wider text-center w-fit text-textColor font-montserrat linkStyles"
                        to={LOGIN_PATH}
                    >
                        {LOGIN_TEXT}
                    </Link>
                </div>
            </form>
            {loading && (
                <p className="mt-4 text-2xl font-montserrat text-mainButtonBackground animate-pulse">Loading...</p>
            )}
            {error && (
                <p className="p-3 mt-4 text-2xl text-red-600 bg-red-100 border-l-4 border-red-500 rounded-md font-montserrat">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Register;
