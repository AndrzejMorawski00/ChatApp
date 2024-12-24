import { useState } from "react";
import { useNavigate } from "react-router";
import { RegisterFormType, useRegisterUserType } from "../../types/auth";
import axiosInstance from "../../utils/api/apiConfig";

const useRegisterUser = (): useRegisterUserType => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const registerUser = async (registerData: RegisterFormType): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post("api/auth/register", registerData);
            if (response.status == 200) {
                navigate("/login/");
            }
        } catch (err: any) {
            setError("Failed to create an account");
            console.error(`Login failed. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return { registerUser, loading, error };
};

export default useRegisterUser;
