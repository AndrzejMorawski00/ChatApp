import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import friendsSearchReducer from "./friends/friendsSearchSlice";

import signalRConnectionReducer from "./signalR/signalRConnectionSlice";

export const store = configureStore({
    reducer: { auth: authReducer, friendsSearch: friendsSearchReducer, signalRConnection: signalRConnectionReducer },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["signalR/startConnection/fulfilled", "signalR/stopConnection/fulfilled"],
                ignoredPaths: ["signalRConnection.connection"],
            },
        }),
});

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
