import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1890FF',
          light: '#40A9FF',
          dark: '#096DD9',
        },
        success: '#52C41A',
        warning: '#FAAD14',
        danger: '#F5222D',
        purple: '#722ED1',
        bg: '#F5F5F5',
        'card-bg': '#FFFFFF',
        title: '#333333',
        'text-secondary': '#666666',
        'text-light': '#999999',
        border: '#D9D9D9',
        divider: '#F0F0F0',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
export default config;
