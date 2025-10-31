/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{ts,tsx,js,jsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#2563eb',
                    foreground: '#ffffff'
                }
            }
        },
    },
    plugins: [],
}


