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
                'float': 'float var(--float-animation-time) linear infinite'
            },
            keyframes: {
                float: {
                    '0%': { transform: 'translate(0px,  0px)' },
                    '50%':  { transform: 'translate(var(--float-fifty-percent-x), var(--float-fifty-percent-y))' },
                    '100%':   { transform: 'translate(0px, -0px)' }
                },
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
