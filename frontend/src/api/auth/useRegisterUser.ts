import { useState } from "react";
import { useNavigate } from "react-router";
import { RegisterFormType, useRegisterUserType } from "../../types/auth";
import axiosInstance from "../../utils/api/apiConfig";
import { API_REGISTER_ENDPOINT } from "../../constants/endpoints";
import useAppContext from "../../hooks/useAppContextHook";
import { ApiStatusMessage } from "../../types/ApiMessages";

// Constants
const SUCCESSFUL_REGISTER_REDIRECT_LINK = "/login/";
const REGISTER_FAILED_ERROR_MESSAGE = "Failed to create an account";

const useRegisterUser = (): useRegisterUserType => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { handleMessagesChange } = useAppContext();

    const registerUser = async (registerData: RegisterFormType): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post(API_REGISTER_ENDPOINT, registerData);
            if (response.status == 200) {
                const newMessage: ApiStatusMessage = {
                    id: Date.now(),
                    message: "Account created successfully.",
                    messageType: "success",
                };
                handleMessagesChange(newMessage);
                navigate(SUCCESSFUL_REGISTER_REDIRECT_LINK);
            }
        } catch (err: any) {
            setError(REGISTER_FAILED_ERROR_MESSAGE);
            console.error(`${REGISTER_FAILED_ERROR_MESSAGE}. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return { registerUser, loading, error };
};

export default useRegisterUser;
