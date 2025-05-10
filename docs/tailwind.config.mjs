import starlightPlugin from "@astrojs/starlight-tailwind";

// Generated color palettes
// #00cea5
const accent = {
  200: "#95d4e9",
  400: "#00738d",
  600: "#00738d",
  900: "#003947",
  950: "#002934",
};
const gray = {
  100: "#f5f6f8",
  200: "#eceef2",
  300: "#c0c2c7",
  400: "#888b96",
  500: "#545861",
  700: "#353841",
  800: "#24272f",
  900: "#17181c",
};

const inherit ='inherit'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: { accent, gray },
      backgroundColor: {inherit}
    },
    colors: {
      accent,
      gray,
    },
  },
  plugins: [starlightPlugin()],
};
