import { jwtDecode } from "jwt-decode";

// Constants
const DECODING_TOKEN_ERROR_MESSAGE = "Error while decoding token";
const DEFAULT_EXPIRATION = -1;
const MILLISECONDS_IN_SECOND = 1000;
export const isValidJWTToken = (token: string): boolean => {
    try {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp ? decoded.exp : DEFAULT_EXPIRATION;
        return !(tokenExpiration < Date.now() / MILLISECONDS_IN_SECOND);
    } catch (error) {
        console.error(`${DECODING_TOKEN_ERROR_MESSAGE}. ${error}`);
        return false;
    }
};
