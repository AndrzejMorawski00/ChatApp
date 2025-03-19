import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ACCESS_TOKEN } from "../../constants/auth";
import { isValidJWTToken } from "../../utils/Auth/isValidJwtToken"
import { refreshToken } from "../../utils/Auth/refreshToken";


export const authenticateUser = createAsyncThunk(
    "auth/authenticateUser",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token && isValidJWTToken(token)) {
            return true;
        } else {
            const refreshed = await refreshToken();
            if (!refreshed) {
                return rejectWithValue(false);
            }
            return true;
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
    },
    reducers: {
        changeAuthenticationState: (state, action: PayloadAction<boolean>) : void => {
            state.isAuthenticated = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(authenticateUser.fulfilled, (state) =>{
            state.isAuthenticated = true
        }).addCase(authenticateUser.rejected, (state) => {
            state.isAuthenticated = false
        })
    }
});

export const { changeAuthenticationState } = authSlice.actions;
export default authSlice.reducer;
