import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FriendForm = {
    searchBarValue: string;
};

const INITIAL_STATE: FriendForm = {
    searchBarValue: "",
};

const friendsSearchSlice = createSlice({
    name: "friendsSearch",
    initialState: INITIAL_STATE,
    reducers: {
        handleSearchBarChange : (state, action: PayloadAction<FriendForm>): void => {
            state.searchBarValue = action.payload.searchBarValue;
        },
    },
});

export const { handleSearchBarChange } = friendsSearchSlice.actions;

export default friendsSearchSlice.reducer;
