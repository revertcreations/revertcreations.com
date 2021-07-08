module.exports = {
    purge: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        boxShadow: {
            inner: 'inset 0 4px 8px 0 rgba(0, 0, 0, 1)',
        },
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
                'float-text': 'float-text .2s linear .1s forwards',
                'float-bg': 'float-bg 1s linear .1s forwards',
                'experience': 'experience 2s linear .1s forwards',
                'translate': 'translate 1s linear .1s forwards',
            },
            keyframes: {
                'translate': {
                    '0%': { 'transform': 'translate3d(var(--translate-origin), 0px, 0)' },
                    '100%': { 'transform': 'translate3d(var(--translate-x), 0px, 0)' }
                },
                'float-text': {
                    '0%': { 'text-shadow': '1px 1px 0px black' },
                    '50%': { 'text-shadow': '4px 4px 5px black' },
                    '100%':   { 'text-shadow': '5px 5px 9px black' },
                },
                'float-bg': {
                    '0%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-0), #fbf1c7 var(--experience-percent-0))', 'box-shadow': '1px 1px 0px 1px black' },
                    '1%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-1), #fbf1c7 var(--experience-percent-1))' },
                    '2%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-2), #fbf1c7 var(--experience-percent-2))' },
                    '3%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-3), #fbf1c7 var(--experience-percent-3))' },
                    '4%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-4), #fbf1c7 var(--experience-percent-4))' },
                    '5%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-5), #fbf1c7 var(--experience-percent-5))' },
                    '6%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-6), #fbf1c7 var(--experience-percent-6))' },
                    '7%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-7), #fbf1c7 var(--experience-percent-7))' },
                    '8%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-8), #fbf1c7 var(--experience-percent-8))' },
                    '9%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-9), #fbf1c7 var(--experience-percent-9))' },
                    '10%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-10), #fbf1c7 var(--experience-percent-10))' },
                    '11%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-11), #fbf1c7 var(--experience-percent-11))' },
                    '12%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-12), #fbf1c7 var(--experience-percent-12))' },
                    '13%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-13), #fbf1c7 var(--experience-percent-13))' },
                    '14%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-14), #fbf1c7 var(--experience-percent-14))' },
                    '15%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-15), #fbf1c7 var(--experience-percent-15))' },
                    '16%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-16), #fbf1c7 var(--experience-percent-16))' },
                    '17%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-17), #fbf1c7 var(--experience-percent-17))' },
                    '18%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-18), #fbf1c7 var(--experience-percent-18))' },
                    '19%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-19), #fbf1c7 var(--experience-percent-19))' },
                    '20%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-20), #fbf1c7 var(--experience-percent-20))' },
                    '21%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-21), #fbf1c7 var(--experience-percent-21))' },
                    '22%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-22), #fbf1c7 var(--experience-percent-22))' },
                    '23%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-23), #fbf1c7 var(--experience-percent-23))' },
                    '24%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-24), #fbf1c7 var(--experience-percent-24))' },
                    '25%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-25), #fbf1c7 var(--experience-percent-25))' },
                    '26%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-26), #fbf1c7 var(--experience-percent-26))' },
                    '27%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-27), #fbf1c7 var(--experience-percent-27))' },
                    '28%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-28), #fbf1c7 var(--experience-percent-28))' },
                    '29%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-29), #fbf1c7 var(--experience-percent-29))' },
                    '30%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-30), #fbf1c7 var(--experience-percent-30))' },
                    '31%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-31), #fbf1c7 var(--experience-percent-31))' },
                    '32%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-32), #fbf1c7 var(--experience-percent-32))' },
                    '33%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-33), #fbf1c7 var(--experience-percent-33))' },
                    '34%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-34), #fbf1c7 var(--experience-percent-34))' },
                    '35%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-35), #fbf1c7 var(--experience-percent-35))' },
                    '36%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-36), #fbf1c7 var(--experience-percent-36))' },
                    '37%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-37), #fbf1c7 var(--experience-percent-37))' },
                    '38%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-38), #fbf1c7 var(--experience-percent-38))' },
                    '39%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-39), #fbf1c7 var(--experience-percent-39))' },
                    '40%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-40), #fbf1c7 var(--experience-percent-40))' },
                    '41%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-41), #fbf1c7 var(--experience-percent-41))' },
                    '42%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-42), #fbf1c7 var(--experience-percent-42))' },
                    '43%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-43), #fbf1c7 var(--experience-percent-43))' },
                    '44%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-44), #fbf1c7 var(--experience-percent-44))' },
                    '45%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-45), #fbf1c7 var(--experience-percent-45))' },
                    '46%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-46), #fbf1c7 var(--experience-percent-46))' },
                    '47%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-47), #fbf1c7 var(--experience-percent-47))' },
                    '48%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-48), #fbf1c7 var(--experience-percent-48))' },
                    '49%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-49), #fbf1c7 var(--experience-percent-49))' },
                    '50%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-50), #fbf1c7 var(--experience-percent-50))', 'box-shadow': '4px 4px 8px 4px black' },
                    '51%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-51), #fbf1c7 var(--experience-percent-51))' },
                    '52%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-52), #fbf1c7 var(--experience-percent-52))' },
                    '53%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-53), #fbf1c7 var(--experience-percent-53))' },
                    '54%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-54), #fbf1c7 var(--experience-percent-54))' },
                    '55%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-55), #fbf1c7 var(--experience-percent-55))' },
                    '56%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-56), #fbf1c7 var(--experience-percent-56))' },
                    '57%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-57), #fbf1c7 var(--experience-percent-57))' },
                    '58%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-58), #fbf1c7 var(--experience-percent-58))' },
                    '59%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-59), #fbf1c7 var(--experience-percent-59))' },
                    '60%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-60), #fbf1c7 var(--experience-percent-60))' },
                    '61%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-61), #fbf1c7 var(--experience-percent-61))' },
                    '62%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-62), #fbf1c7 var(--experience-percent-62))' },
                    '63%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-63), #fbf1c7 var(--experience-percent-63))' },
                    '64%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-64), #fbf1c7 var(--experience-percent-64))' },
                    '65%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-65), #fbf1c7 var(--experience-percent-65))' },
                    '66%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-66), #fbf1c7 var(--experience-percent-66))' },
                    '67%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-67), #fbf1c7 var(--experience-percent-67))' },
                    '68%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-68), #fbf1c7 var(--experience-percent-68))' },
                    '69%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-69), #fbf1c7 var(--experience-percent-69))' },
                    '70%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-70), #fbf1c7 var(--experience-percent-70))' },
                    '71%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-71), #fbf1c7 var(--experience-percent-71))' },
                    '72%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-72), #fbf1c7 var(--experience-percent-72))' },
                    '73%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-73), #fbf1c7 var(--experience-percent-73))' },
                    '74%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-74), #fbf1c7 var(--experience-percent-74))' },
                    '75%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-75), #fbf1c7 var(--experience-percent-75))' },
                    '76%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-76), #fbf1c7 var(--experience-percent-76))' },
                    '77%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-77), #fbf1c7 var(--experience-percent-77))' },
                    '78%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-78), #fbf1c7 var(--experience-percent-78))' },
                    '79%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-79), #fbf1c7 var(--experience-percent-79))' },
                    '80%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-80), #fbf1c7 var(--experience-percent-80))' },
                    '81%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-81), #fbf1c7 var(--experience-percent-81))' },
                    '82%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-82), #fbf1c7 var(--experience-percent-82))' },
                    '83%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-83), #fbf1c7 var(--experience-percent-83))' },
                    '84%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-84), #fbf1c7 var(--experience-percent-84))' },
                    '85%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-85), #fbf1c7 var(--experience-percent-85))' },
                    '86%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-86), #fbf1c7 var(--experience-percent-86))' },
                    '87%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-87), #fbf1c7 var(--experience-percent-87))' },
                    '88%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-88), #fbf1c7 var(--experience-percent-88))' },
                    '89%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-89), #fbf1c7 var(--experience-percent-89))' },
                    '90%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-90), #fbf1c7 var(--experience-percent-90))' },
                    '91%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-91), #fbf1c7 var(--experience-percent-91))' },
                    '92%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-92), #fbf1c7 var(--experience-percent-92))' },
                    '93%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-93), #fbf1c7 var(--experience-percent-93))' },
                    '94%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-94), #fbf1c7 var(--experience-percent-94))' },
                    '95%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-95), #fbf1c7 var(--experience-percent-95))' },
                    '96%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-96), #fbf1c7 var(--experience-percent-96))' },
                    '97%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-97), #fbf1c7 var(--experience-percent-97))' },
                    '98%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-98), #fbf1c7 var(--experience-percent-98))' },
                    '99%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-99), #fbf1c7 var(--experience-percent-99))' },
                    '100%': { 'background-image': 'linear-gradient(to right, var(--experience-color) 0%, var(--experience-color) var(--experience-percent-100), #fbf1c7 var(--experience-percent-100))', 'box-shadow': '5px 5px 20px 5px black' },

                },
                'experience': {
                    '1%': { 'background-image': 'linear-gradient(to right, #b8bb26 0%, #b8bb26 1%, #fbf1c7 1%)' },
                    '100%': { 'background-image': 'linear-gradient(to right, #b8bb26 0%, #b8bb26 var(--experience-percent), #fbf1c7 var(--experience-percent))' }
                },
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
