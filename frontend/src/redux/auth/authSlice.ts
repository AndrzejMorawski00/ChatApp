import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserData = {
    email: string;
};

interface AuthState {
    isAuthenticated: boolean | null;
    userData: UserData | null;
}

const INITIAL_STATE: AuthState = {
    isAuthenticated: false,
    userData: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState: INITIAL_STATE,
    reducers: {
        authenticateUser: (state, action: PayloadAction<{ isAuthenticated: boolean; userData: UserData | null }>) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.userData = action.payload.userData;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.userData = null;
            localStorage.clear();
        },
    },
});

export const { authenticateUser, logout } = authSlice.actions;

export default authSlice.reducer;
