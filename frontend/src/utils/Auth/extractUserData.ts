import { jwtDecode } from "jwt-decode";
import { UserData } from "../../redux/auth/authSlice";
// import { UserData } from "../../redux/auth/authSlice";

const EMAIL_KEY = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

export const extractUserData = (token: string): UserData | null => {
    try {
        const decoded: any = jwtDecode(token);
        const email = decoded[EMAIL_KEY];
        if (!email) {
            console.error("Failed to extract email");
            return null;
        }
        return {email : email};
    } catch (error) {
        console.error(`Error while decoding token. ${error}`);
        return null;
    }
};
