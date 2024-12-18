import { configureStore } from "@reduxjs/toolkit";


import isAuthenticatedReducer from "./auth/isAuthenticatedSlice";

export const store = configureStore({
    reducer: { auth: isAuthenticatedReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
