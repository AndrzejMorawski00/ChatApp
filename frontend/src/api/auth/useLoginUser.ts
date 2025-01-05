import { useState } from "react";
import { useNavigate } from "react-router";
import { LoginFormType, useLoginUserType } from "../../types/auth";
import axiosInstance from "../../utils/api/apiConfig";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/auth";

// Constants
const API_AUTH_TOKEN_ENDPOINT = "api/auth/token";
const LOGIN_FAILED_ERROR_MESSAGE = "Login Failed";
const SUCCESSFUL_AUTH_REDIRECT_LINK = "/home/";

const useLoginUser = (): useLoginUserType => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const loginUser = async ({ email, password }: LoginFormType): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post(API_AUTH_TOKEN_ENDPOINT, {
                email,
                password,
            });
            const { accessToken, refreshToken } = response.data;
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            localStorage.setItem(REFRESH_TOKEN, refreshToken);
            navigate(SUCCESSFUL_AUTH_REDIRECT_LINK);
        } catch (err) {
            setError(LOGIN_FAILED_ERROR_MESSAGE);
            console.error(`${LOGIN_FAILED_ERROR_MESSAGE}. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return { loginUser, loading, error };
};

export default useLoginUser;
