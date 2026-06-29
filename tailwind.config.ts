import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0E14',
        panel: '#11151D',
        line: '#1E2530',
        accent: '#13B9FD',
        accent2: '#02569B',
        good: '#3DDC97',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      keyframes: {
        blink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        slideIn: 'slideIn 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
