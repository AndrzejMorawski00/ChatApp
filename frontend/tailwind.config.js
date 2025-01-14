/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/index.css"],
    corePlugins: {
        preflight: true,
    },

    theme: {
        extend: {
            colors: {
                backgroundColor: "rgba(var(--backgroundColor))",
                textColor: "rgba(var(--textColor))",
                mainButtonBackground: "rgba(var(--mainButtonBackground))",
                themeBackground: "rgba(var(--themeBackground))",
                themeIcon: "rgba(var(--themeIcon))",
                themeThumb: "rgba(var(--themeThumb))",
                linkUnderlineHover: "rgba(var(--linkUnderlineHover))",
                formInputBackgroundColor: "rgba(var(--formInputBackgroundColor))",
                formInputTextColor: "rgba(var(--formInputTextColor))",
                iconColor: "rgba(var(--iconColor))",
                iconColorHover: "rgba(var(--iconColorHover))",
                ownerMessageBackground: "rgba(var(--ownerMessageBackground))",
                guestMessageBackground: "rgba(var(--guestMessageBackground))",
                ownerMessageText: "rgba(var(--ownerMessageText))",
                guestMessageText: "rgba(var(--guestMessageText))",
                ownerMessageContentText: "rgba(var(--ownerMessageContentText))",
                guestMessageContentText: "rgba(var(--guestMessageContentText))",
                infoApiMessageBackground: "rgba(var(--infoApiMessageBackground))",
                errorApiMessageBackground: "rgba(var(--errorApiMessageBackground))",
                successApiMessageBackground: "rgba(var(--successApiMessageBackground))",
                defaultApiMessageIconColor: "rgba(var(--defaultApiMessageIconColor))",
                alternateApiMessageIconColor: "rgba(var(--alternateApiMessageIconColor))",
            },
            fontFamily: {
                montserrat: ["Montserrat", "serif"],
            },

            animation: {
                "toast-slide-in": "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                "toast-hide": "hide 100ms ease-in",
                "toast-swipe-out": "swipeOut 100ms ease-out",
            },
            keyframes: {
                slideIn: {
                    "0%": { transform: "translateX(calc(100% + var(--viewport-padding)))" },
                    "100%": { transform: "translateX(0)" },
                },
                hide: {
                    "0%": { opacity: 1 },
                    "100%": { opacity: 0 },
                },
                swipeOut: {
                    "0%": { transform: "translateX(var(--radix-toast-swipe-end-x))" },
                    "100%": { transform: "translateX(calc(100% + var(--viewport-padding)))" },
                },
            },
        },
    },
    plugins: [],
};
