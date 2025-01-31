import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeColor } from "../../types/store";

const getInitialThemeSite = (): ThemeColor => {
    const localStorageTheme = localStorage.getItem("theme") || "light";
    const osTheme = window.matchMedia("(prefers-color-scheme : dark)").matches;
    return localStorageTheme === "dark" || osTheme ? "dark" : "light";
};

export const themeSlice = createSlice({
    name: "theme",
    initialState: {
        theme: getInitialThemeSite(),
    },
    reducers: {
        changeThemeState: (state, action: PayloadAction<ThemeColor>): void => {
            const prevTheme = state.theme;
            const newTheme = action.payload;
            document.body.classList.remove(prevTheme);
            document.body.classList.add(newTheme);
            localStorage.setItem("theme", newTheme);
            state.theme = action.payload;
        },
    },
});

export const { changeThemeState } = themeSlice.actions;

export default themeSlice.reducer;
