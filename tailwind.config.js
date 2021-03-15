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
                'gruvbox-red': '#cc241d',
                'gruvbox-yellow': '#d79921',
                'gruvbox-orange': '#d65d0e',
                'gruvbox-blue': '#458588',
                'gruvbox-aqua': '#689d6a',
                'gruvbox-gray': '#a89984',
                'gruvbox-green': '#98971a',
                'gruvbox-purple': '#d3869b',
                'gruvbox-black': '#282828',
                'gruvbox-white': '#fbf1c7',
                'hmt-green': '#b9cc33'
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
