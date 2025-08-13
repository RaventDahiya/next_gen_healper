import { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // background: "#121212",
        // primary: "#0095f6",
      },
    },
  },
  plugins: [],
};

export default config;
