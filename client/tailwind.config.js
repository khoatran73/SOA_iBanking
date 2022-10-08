/** @type {import('tailwindcss').Config}  */

module.exports = {
    mode: 'jit',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {},
        },
    },
    variants: {
        extend: {
            textColor: ['responsive', 'hover', 'focus', 'group-hover'],
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        // function ({ addVariant }) {
        // addVariant('child', '& > *');
        // addVariant('child-hover', '& > *:hover');
        // addVariant('child-span-hover', '& > span:hover');
        // },
    ],
};
