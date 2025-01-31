import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const searchBarSlice = createSlice({
    name: "searchBar",
    initialState: {
        searchBarValue: "",
    },
    reducers: {
        changeSearchBarState: (state, action: PayloadAction<string>): void => {
            state.searchBarValue = action.payload;
        },
    },
});

export const { changeSearchBarState } = searchBarSlice.actions;
export default searchBarSlice.reducer;
