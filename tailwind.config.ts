import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        "yeseva": ['var(--font-yeseva-one)'],
        "sans": ['var(--font-open-sans)'],
        "signika": ['var(--font-signika)'],
        "garamond": ['var(--font-eb-garamond)'],
      },
    },
  },
  plugins: [],
};
export default config;
