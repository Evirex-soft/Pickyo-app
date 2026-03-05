import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                background: "var(--background)", // zinc-50
                foreground: "var(--foreground)", //  zinc-900
                primary: {
                    DEFAULT: "#4F46E5", // Indigo 600
                    foreground: "#FFFFFF",
                },
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)"],
            },
        },
    },
    plugins: [],
};
export default config;