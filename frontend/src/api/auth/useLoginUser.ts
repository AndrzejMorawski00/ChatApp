import { useState } from "react";
import { useNavigate } from "react-router";
import { LoginFormType, useLoginUserType } from "../../types/auth";
import axiosInstance from "../../utils/api/apiConfig";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/auth";
import { API_AUTH_TOKEN_ENDPOINT } from "../../constants/endpoints";

// Constants
const SUCCESSFUL_AUTH_REDIRECT_LINK = "/home/";
const LOGIN_FAILED_ERROR_MESSAGE = "Login Failed";

const useLoginUser = (): useLoginUserType => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const loginUser = async ({ email, password }: LoginFormType): Promise<void> => {
        setError(null);
        setLoading(true);
        try {
            const response = await axiosInstance.post(API_AUTH_TOKEN_ENDPOINT, {
                email,
                password,
            });
            const { accessToken, refreshToken } = response.data;
            localStorage.setItem(REFRESH_TOKEN, refreshToken);
            localStorage.setItem(ACCESS_TOKEN, accessToken);
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
