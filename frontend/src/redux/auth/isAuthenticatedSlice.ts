import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import useLogoutUser from "../../api/auth/useLogoutUser";

interface IsAuthenticatedState {
    isAuthenticated: boolean | null;

}

const initialState: IsAuthenticatedState = {
    isAuthenticated: false,
};

const isAuthenticatedSlice = createSlice({
    name: "isAuthenticaed",
    initialState,
    reducers: {
        setIsAuthenticated: (
            state,
            action: PayloadAction<{ isAuthenticated: boolean}>
        ) => {
            state.isAuthenticated = action.payload.isAuthenticated;
        },
        logout: (state) => {
            const {logoutUser} = useLogoutUser();
            state.isAuthenticated = false;
            logoutUser()
        },
    },
});

export const { setIsAuthenticated, logout } = isAuthenticatedSlice.actions;

export default isAuthenticatedSlice.reducer;
