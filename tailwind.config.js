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
                'gruvbox-light-red': '#fb3934',
                'gruvbox-red': '#cc241d',
                'gruvbox-light-yellow': '#d79921',
                'gruvbox-yellow': '#fabd2f',
                'gruvbox-light-orange': '#d65d0e',
                'gruvbox-orange': '#fe8019',
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
                'gruvbox-black-hidden': '#32302f',
                'gruvbox-white': '#fbf1c7',
                'hmt-green': '#b9cc33'
            },
            animation: {
                'float-text': 'float-text 1s linear forwards',
                'float-bg': 'float-bg 1s linear forwards'
            },
            keyframes: {
                'float-text': {
                    '0%': { 'text-shadow': '1px 1px 0px black' },
                    '50%': { 'text-shadow': '4px 4px 3px black' },
                    '100%':   { 'text-shadow': '5px 5px 7px black' },
                },
                'float-bg': {
                    '0%': { 'box-shadow': '1px 1px 0px 1px black' },
                    '50%': { 'box-shadow': '4px 4px 3px 4px black' },
                    '100%':   { 'box-shadow': '5px 5px 10px 5px black' },
                }

            },
        }
    },
    variants: {
        extend: {
            backgroundColor: ['disabled'],
            textColor: ['disabled'],
            cursor: ['disabled'],
            animation: ['hover'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
