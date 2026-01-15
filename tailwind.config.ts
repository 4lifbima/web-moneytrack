import type { Config } from 'tailwindcss'

export default {
    content: [
        './app/components/**/*.{js,vue,ts}',
        './app/layouts/**/*.vue',
        './app/pages/**/*.vue',
        './app/plugins/**/*.{js,ts}',
        './app/app.vue',
        './app/error.vue',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff8eb',
                    100: '#ffecc6',
                    200: '#ffd688',
                    300: '#ffbb4a',
                    400: '#ffa520',
                    500: '#f59105',
                    600: '#d96d01',
                    700: '#b44b05',
                    800: '#92390a',
                    900: '#78300b',
                    950: '#451600',
                },
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'card': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
        },
    },
    plugins: [],
} satisfies Config
