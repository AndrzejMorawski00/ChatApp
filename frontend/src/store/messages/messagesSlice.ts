import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiStatusMessage } from "../../types/ApiMessages";
import { MessagesType } from "../../types/store";
import { MESSAGE_TIMEOUT } from "../../constants/store";

const initialState: MessagesType = {
    messages: [],
};

export const handleMessages = createAsyncThunk<void, ApiStatusMessage>(
    "messages/handleMessages",
    async (message, { dispatch }) => {
        dispatch(changeMessagesState(message));
        await new Promise((resolve) => setTimeout(resolve, MESSAGE_TIMEOUT));
        dispatch(removeMessage(message.id));
    }
);

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        changeMessagesState: (state, action: PayloadAction<ApiStatusMessage>): void => {
            state.messages.push(action.payload);
        },
        removeMessage: (state, action: PayloadAction<number>): void => {
            state.messages.filter((m) => m.id !== action.payload);
        },
    },
});

export const { changeMessagesState, removeMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
