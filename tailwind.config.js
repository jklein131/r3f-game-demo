/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,js,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')],
};
