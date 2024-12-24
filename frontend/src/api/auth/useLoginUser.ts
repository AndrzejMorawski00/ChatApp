import { useState } from "react";
import { useNavigate } from "react-router";
import { LoginFormType, useLoginUserType } from "../../types/auth";
import axiosInstance from "../../utils/api/apiConfig";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/auth";

const useLoginUser = (): useLoginUserType => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const loginUser = async ({ email, password }: LoginFormType): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post("api/auth/token", {
                email,
                password,
            });
            const { accessToken, refreshToken } = response.data;
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            localStorage.setItem(REFRESH_TOKEN, refreshToken);
            navigate("/home/");
        } catch (err) {
            setError("Login Failed");
            console.error(`Login failed. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return { loginUser, loading, error };
};

export default useLoginUser;
