import { useContext } from "react";
// import { ThemeContextType } from "../types/types";
import { ThemeContext, ThemeContextType } from "../providers/ThemeContextProvider";

export const useThemeContext = (): ThemeContextType => {
    const themeContext = useContext(ThemeContext);
    if (themeContext === undefined) {
        throw new Error("Theme Context is undefined");
    }
    return themeContext;
};
