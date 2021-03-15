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
                'gruvbox-light-red': '#cc241d',
                'gruvbox-red': '#cc241d',
                'gruvbox-light-yellow': '#d79921',
                'gruvbox-yellow': '#fabd2f',
                'gruvbox-light-orange': '#d65d0e',
                'gruvbox-orange': '#fabd2f',
                'gruvbox-light-blue': '#458588',
                'gruvbox-blue': '#83a598',
                'gruvbox-light-aqua': '#689d6a',
                'gruvbox-aqua': '#8ec07c',
                'gruvbox-gray': '#a89984',
                'gruvbox-light-green': '#98971a',
                'gruvbox-green': '#b8bb26',
                'gruvbox-light-purple': '#d3869b',
                'gruvbox-purple': '#b16286',
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
