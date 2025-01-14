import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

import * as Switch from "@radix-ui/react-switch";
import useAppContext from "../../hooks/useAppContextHook";

const ThemeSwitch = () => {
    const { theme, handleThemeChange } = useAppContext();

    const isDarkMode = theme === "dark";

    const toggleTheme = (): void => {
        const newTheme = isDarkMode ? "light" : "dark";
        handleThemeChange(newTheme);
    };

    return (
        <div className="flex w-full items-center justify-end pr-4 md:pr-5 xl:pr-6">
            <Switch.Root
                onCheckedChange={toggleTheme}
                className="relative inline-flex items-center h-6 w-11 md:h-7 md:w-12 lg:h-8 lg:w-14 rounded-full bg-themeBackground"
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
