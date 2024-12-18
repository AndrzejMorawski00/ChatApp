import { useState } from "react";
import { RegisterFormType } from "../../types/auth";
import { isValidKeyValue } from "../../utils/common";
import { isValidRegisterForm } from "../../utils/Auth/isValidAuthForm";
import { Link } from "react-router";
import useRegisterUser from "../../api/auth/useRegisterUser";

const INITIAL_REGISTER_FORM: RegisterFormType = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
};

const Register = () => {
    const [formData, setFormData] = useState<RegisterFormType>(INITIAL_REGISTER_FORM);
    const { register, loading, error } = useRegisterUser();

    const handleFormDataChange = <T extends keyof RegisterFormType>(key: string, value: RegisterFormType[T]): void => {
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
        if (!isValidRegisterForm(formData)) {
            return;
        }
        await register(formData);
        setFormData(INITIAL_REGISTER_FORM);
    };

    return (
        <div>
            <header>
                <Link to="/login/" />
            </header>
            <form action="" onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="repeatPassword">Repeat Password:</label>
                    <input
                        value={formData.repeatPassword}
                        type="password"
                        id="repeatPassword"
                        onChange={(e) => handleFormDataChange(e.target.id, e.target.value)}
                    />
                </div>
                <input type="submit" value="Register" />
            </form>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Register;
