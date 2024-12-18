import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/auth";
import { useLogoutType } from "../../types/auth";

const useLogoutUser = (): useLogoutType => {
    const logoutUser = (): void => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
    };

    return { logoutUser };
};

export default useLogoutUser;
