import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActiveChat } from "../../types/store";

const initialState: ActiveChat = {
    activeChat: null,
};

const activeChatSlice = createSlice({
    name: "activeChat",
    initialState,
    reducers: {
        changeActiveChatState: (state, action: PayloadAction<null | number>) => {
            state.activeChat = action.payload;
        },
    },
});

export const { changeActiveChatState } = activeChatSlice.actions;
export default activeChatSlice.reducer;
