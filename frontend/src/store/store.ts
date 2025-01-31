import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "./theme/themeSlice";
import authReducer from "./auth/authSlice";
import searchBarReducer from "./searchBar/searchBarSlice";
import activeChatReducer from "./activeChat/activeChatSlice";
import messagesReducer from './messages/messagesSlice'
import { apiSlice } from "./api/apiSlice";

const store = configureStore({
    reducer: {
        theme: themeReducer,
        searchBar: searchBarReducer,
        auth: authReducer,
        activeChat: activeChatReducer,
        messages : messagesReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
