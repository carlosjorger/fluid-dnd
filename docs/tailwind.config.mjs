import starlightPlugin from "@astrojs/starlight-tailwind";

// Generated color palettes
// #00cea5
const accent = {
  200: "#a9d3c5",
  400: "#02b38f",
  600: "#007e65",
  900: "#003c2f",
  950: "#012b21",
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
