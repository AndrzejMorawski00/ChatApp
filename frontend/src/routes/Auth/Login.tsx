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
const REGISTER_PATH = "register/";
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
        <div>
            <header>
                <Link to={REGISTER_PATH}>{REGISTER_TEXT}</Link>
            </header>
            <form action="" onSubmit={handleFormSubmit}>
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
                <input type="submit" value="Login" disabled={loading} />
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default Register;
