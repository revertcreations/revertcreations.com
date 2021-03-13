module.exports = {
    purge: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'gruvbox-green': '#98971a',
                'gruvbox-purple': '#d3869b',
                'gruvbox-black': '#282828',
            },
        }
    },
    variants: {
        extend: {
            backgroundColor: ['disabled'],
            textColor: ['disabled'],
            cursor: ['disabled'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
