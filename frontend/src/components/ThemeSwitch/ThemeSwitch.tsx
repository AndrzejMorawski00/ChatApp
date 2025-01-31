import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

import * as Switch from "@radix-ui/react-switch";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { changeThemeState } from "../../store/theme/themeSlice";
import { useAppDispatch } from "../../hooks/useReduxHook";

const ThemeSwitch = () => {
    const theme = useSelector((state: RootState) => state.theme.theme);
    const dispatch = useAppDispatch();

    const isDarkMode = theme === "dark";

    const toggleTheme = (): void => {
        const newTheme = isDarkMode ? "light" : "dark";
        dispatch(changeThemeState(newTheme));
    };

    useEffect(() => {
        document.body.classList.add(theme);
        return () => document.body.classList.remove(theme);
    }, [theme]);

    return (
        <div className="flex items-center justify-end w-full pr-4 md:pr-5 xl:pr-6">
            <Switch.Root
                onCheckedChange={toggleTheme}
                className="relative inline-flex items-center h-6 rounded-full w-11 md:h-7 md:w-12 lg:h-8 lg:w-14 bg-themeBackground"
            >
                <Switch.Thumb
                    className={`inline-flex items-center justify-center h-6 w-6  lg:h-7 lg:w-7 rounded-full bg-themeThumb  shadow-lg transform transition-transform duration-300 ${
                        isDarkMode ? "translate-x-6  lg:translate-x-7" : "translate-x-0"
                    }`}
                >
                    {isDarkMode ? (
                        <FontAwesomeIcon icon={faSun} className="text-themeIcon" />
                    ) : (
                        <FontAwesomeIcon icon={faMoon} className="text-themeIcon" />
                    )}
                </Switch.Thumb>
            </Switch.Root>
        </div>
    );
};

export default ThemeSwitch;
