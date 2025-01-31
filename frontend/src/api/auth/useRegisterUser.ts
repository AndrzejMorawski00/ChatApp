import { useState } from "react";
import { useNavigate } from "react-router";
import { RegisterFormType, useRegisterUserType } from "../../types/auth";
import axiosInstance from "../../utils/api/apiConfig";
import { API_REGISTER_ENDPOINT } from "../../constants/endpoints";
import { ApiStatusMessage } from "../../types/ApiMessages";
import { handleMessages } from "../../store/messages/messagesSlice";
import { useAppDispatch } from "../../hooks/useReduxHook";

// Constants
const SUCCESSFUL_REGISTER_REDIRECT_LINK = "/login/";
const REGISTER_FAILED_ERROR_MESSAGE = "Failed to create an account";
const ACCOUNT_CREATED_SUCCESS_MESSAGE = "Account created successfully.";
const ACCOUNT_CREATED_MESSAGE_TYPE = "success";

const useRegisterUser = (): useRegisterUserType => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    const registerUser = async (registerData: RegisterFormType): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post(API_REGISTER_ENDPOINT, registerData);
            if (response.status == 200) {
                const newMessageID = Date.now();
                const newMessage: ApiStatusMessage = {
                    id: newMessageID,
                    message: ACCOUNT_CREATED_SUCCESS_MESSAGE,
                    messageType: ACCOUNT_CREATED_MESSAGE_TYPE,
                };
                dispatch(handleMessages(newMessage));
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
