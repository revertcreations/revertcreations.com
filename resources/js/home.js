const mainHeader = document.getElementById('main_header')
const content = document.getElementById('content')
const lead = document.getElementById('lead')
const footer = document.getElementById('footer')
const myName = document.getElementById('name')
const myNameLetters = document.querySelectorAll('#name span')
const hint = document.getElementById('hint')
const eh = document.getElementById('eh')

let state = 'default'

const error = new Audio('/audio/error3.wav')
const success = new Audio('/audio/success1.wav')
const success2 = new Audio('/audio/success3.wav')
const unlock = new Audio('/audio/unlock.wav')
const unlock2 = new Audio('/audio/unlock2.wav')

const textColors = [
    'text-gruvbox-light-yellow',
    'text-gruvbox-yellow',
    'text-gruvbox-orange',
    'text-gruvbox-purple',
    'text-gruvbox-blue',
    'text-gruvbox-aqua',
    'text-gruvbox-gray',
    'text-gruvbox-green'
]

const animationFrames = 1000

hint.addEventListener(
    'mousedown',
    e => {
        // console.log('mousedown')
        e.target.setAttribute('draggable', true)
        e.target.classList.remove('shadow-inner')
        e.target.classList.add('shadow-outer', 'text-gruvbox-gray')
    },
    { passive: true }
)

hint.addEventListener('mouseup', e => {
    // console.log('mouseup')
    let target = e.target
    target.setAttribute('draggable', false)
    target.classList.remove('shadow-outer', 'text-gruvbox-gray')
    target.classList.add('shadow-inner', 'text-black')
})

hint.addEventListener(
    'dragstart',
    e => {
        // console.log('dragstart')
        e.target.textContent = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'
        // get the current mouse position
        let x = e.clientX
        let y = e.clientY

        let ehWidth = eh.offsetWidth
        let ehHeight = eh.offsetHeight
        let ehX = eh.offsetLeft + ehWidth / 2
        let ehY = eh.offsetTop + ehHeight / 2

        const mainHeaderHeight = mainHeader.offsetHeight
        const footerHeight = footer.offsetHeight
        const padding = 15

        state = state === 'default' ? 'secondary' : 'tertiary'

        // math.random() * (max - min) + min
        let maxHeight = window.innerHeight - footerHeight - padding
        let minHeight = mainHeaderHeight + padding

        if (state == 'secondary') {
            window.rngX = Math.random() * (window.innerWidth - padding - padding) + padding
            window.rngY = Math.random() * (maxHeight - minHeight) + minHeight
        } else {
            window.rngX = ehX - x
            window.rngY = ehY - y
        }

        // console.log('rngX', window.rngX)
        // console.log('rngY', window.rngY)

        // create a new svg element at the mouse position
        let key = document.createElement('div')
        key.innerHTML = '🗝️'
        key.innerHTML = '🧭'
        key.innnerHTML = '🔑'
        key.innerHTML = '💡'
        key.classList.add('absolute', 'z-50', 'text-5xl')

        key.id = 'key'
        document.getElementsByTagName('body')[0].appendChild(key)
        e.target.classList.remove('cursor-pointer', 'shadow-outer')
        e.target.classList.add('cursor-grabbing')
    },
    { passive: true }
)

hint.addEventListener(
    'drag',
    e => {
        let key = document.getElementById('key')

        let x = e.clientX
        let y = e.clientY

        key.style.top = `${y - 40}px`
        key.style.left = `${x - 20}px`

        let deltaX = window.rngX - x
        let deltaY = window.rngY - y

        if (state == 'tertiary') {
            deltaX = ehX - x
            deltaY = ehY - y
        }

        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        let theta = Math.atan2(deltaY, deltaX)
        let angle = (theta / Math.PI) * 180 + (theta > 0 ? 0 : 360)

        // the added 45 is to account for the emoji being rotated 45 away from north by default
        let rotate = state == 'tertiary' ? angle + 225 : 0

        console.log('rotate', rotate)

        key.style.transform = `rotate(${rotate}deg)`

        if (
            x > window.rngX &&
            x < window.rngX + ehWidth &&
            y > window.rngY &&
            y < window.rngY + ehHeight
        ) {

            console.log('found it')

            if (window.held === undefined) {
                window.held = new Date()
                window.held = window.held.setSeconds(
                    window.held.getSeconds() + 2
                )
            }

            e.target.classList.remove('cursor-grabbing')
            e.target.classList.add('cursor-progress')

            key.style.textShadow = `0 0 10px #cc241d, 0 0 18px #cc241d, 0 0 20px #cc241d`;

            if (window.held < new Date().getTime()) {
                state = 'tertiary'
                key.innerHTML = '🔑'
                key.style.textShadow = `none`
                key.style.color = `#000000`
            }

        } else if (distance <= 400 && state == 'secondary') {
            window.held = undefined
            let spread = distance < 100 ? 0.5 : 0.1
            if (distance < 25) {
                key.style.textShadow = `0 0 ${distance / spread}px #fe8019, 0 0 ${
                    distance / spread
                }px #fe8019, 0 0 ${distance / spread}px #EDD205`
                key.style.color = `#fe8019`
            } else {
                key.style.textShadow = `0 0 ${distance / spread}px #FFE205, 0 0 ${
                    distance / spread
                }px #FFE205, 0 0 ${distance / spread}px #EDD205`
                key.style.color = `#FFE205`
            }
        } else {
            window.held = undefined
            key.style.textShadow = `none`
            key.style.color = `#000000`
            eh.classList.remove('text-gruvbox-yellow')
            eh.classList.add('text-gruvbox-gray')
        }
        
        e.target.classList.remove('cursor-progress')
        e.target.classList.add('cursor-grabbing')
        if (state == 'tertiary' &&
            x > ehX &&
            x < ehX + ehWidth &&
            y > ehY &&
            y < ehY + ehHeight
        ) {
            console.log('in eh')
            eh.classList.remove('text-gruvbox-gray')
            eh.classList.add('text-gruvbox-yellow')
        } else {
            eh.classList.remove('text-gruvbox-yellow')
            eh.classList.add('text-gruvbox-gray')
        }
    },
    { passive: true }
)

hint.addEventListener(
    'dragend',
    e => {
        let target = e.target
        console.log('dragend')
        target.textContent = 'hidden'
        target.classList.remove(
            'text-gruvbox-gray',
            'shadow-outer',
            'cursor-grabbing'
        )
        target.classList.add('text-black', 'shadow-inner', 'cursor-pointer')
        document
            .getElementsByTagName('body')[0]
            .removeChild(document.getElementById('key'))
    },
    { passive: true }
)

myNameLetters.forEach(letter => {
    letter.addEventListener('mousedown', nameLetterClicked, { passive: true })
    // letter.addEventListener('touchstart', nameLetterClicked, { passive: true })
})

myNameLetters.forEach(letter => {
    for (let i = 0; i < animationFrames; i++) {
        setTimeout(() => {
            nameLetterClicked({ target: letter }, true)
        }, 100)
    }
})

function disiplineTargeted (e) {
    let title = e.target
    let target_disipline = e.target.innerText.toLowerCase()
    console.log('target_disipline', target_disipline)
}

function nameCursorLoading () {
    console.log('nameCursorLoading')
    myNameLetters.forEach(letter => {
        letter.classList.remove('cursor-copy')
        letter.classList.add('cursor-wait')
        setTimeout(() => {
            letter.classList.remove('cursor-wait')
            letter.classList.add('cursor-pointer')
        }, 3000)
    })

    let body = document.getElementsByTagName('body')[0]
    body.classList.add('cursor-wait')
}

function nameLetterClicked (e, loading = false) {
    e.target.classList.remove(...textColors)
    let clickCount = e.target.getAttribute('data-click-count') || 0

    if (loading) {
        clickCount = Math.floor(Math.random() * textColors.length)
    } else {
        ++clickCount
    }

    if (clickCount > textColors.length) {
        clickCount = 0
    }

    e.target.setAttribute('data-click-count', clickCount)

    if (textColors[clickCount]) {
        e.target.classList.add(textColors[clickCount])
    }

    let isGreen = e.target.classList.contains('text-gruvbox-green')
    let isPurple = e.target.classList.contains('text-gruvbox-purple')

    if (!loading && (isGreen || isPurple)) {
        if (isGreen) {
            success.currentTime = 0
            success.play()
        } else if (isPurple) {
            success2.currentTime = 0
            success2.play()
        }

        e.target.classList.remove('cursor-not-allowed')
        e.target.classList.add('cursor-copy')
    } else if (!loading) {
        error.currentTime = 0
        error.play()

        e.target.classList.remove('cursor-copy')
        e.target.classList.remove('cursor-pointer')
        e.target.classList.remove('cursor-not-allowed')
        e.target.classList.add('cursor-not-allowed')

        setTimeout(() => {
            e.target.classList.remove('cursor-not-allowed')
            e.target.classList.add('cursor-pointer')
        }, 500)
    }

    let allGreen = true
    let allPurple = true
    myNameLetters.forEach(letter => {
        if (!letter.classList.contains('text-gruvbox-green')) {
            allGreen = false
        }
        if (!letter.classList.contains('text-gruvbox-purple')) {
            allPurple = false
        }
    })

    if (!loading) {
        if (allGreen || allPurple) {
            let selected = allGreen ? 'green' : 'purple'

            if (allGreen) {
                unlock.currentTime = 0
                unlock.play()
            } else {
                unlock2.currentTime = 0
                unlock2.play()
            }

            nameCursorLoading()
            disapearingParagraphs(selected)
        }
    }
}

function disapearingParagraphs (selected) {
    if (!selected) return

    let paragraphs = lead.childNodes
    let newParagraphs = []
    let newParagraph

    paragraphs.forEach((paragraph, i) => {
        newParagraph = null

        if (
            paragraph.nodeType === 1 &&
            (!paragraph.classList ||
                (paragraph.classList &&
                    !paragraph.classList.contains('hidden')))
        ) {
            newParagraph = document.createElement('p')

            paragraph.classList.forEach(className => {
                newParagraph.classList.add(className)
            })
            newParagraph.id = 'exploding-paragraph-' + i

            paragraph.childNodes.forEach(words => {
                let text = words.textContent
                let letters = text.split('')

                letters.forEach(letter => {
                    let span = document.createElement('span')
                    if (words.classList) {
                        words.classList.forEach(className => {
                            span.classList.add(className)
                        })
                    }

                    span.innerText = letter
                    if (letter != '\n') {
                        newParagraph.appendChild(span)
                    }
                })
            })
        }
        if (newParagraph) newParagraphs.push(newParagraph)
    })

    document.getElementById('default').classList.add('hidden')
    document.getElementById('secondary').classList.add('hidden')

    newParagraphs.forEach(newParagraph => {
        lead.appendChild(newParagraph)
    })

    let disapearingParagraphs = document.querySelectorAll('#lead p')

    disapearingParagraphs.forEach((paragraph, i) => {
        if (!paragraph.classList.contains('hidden')) {
            paragraph.classList.add('overflow-hidden')
            let letters = paragraph.querySelectorAll('span')
            letters.forEach((letter, i) => {
                setTimeout(() => {
                    if (
                        (selected == 'green' &&
                            letter.classList.contains('text-gruvbox-green')) ||
                        (selected == 'purple' &&
                            letter.classList.contains('text-gruvbox-purple'))
                    ) {
                        letter.style.fontSize = '3rem'
                    } else {
                        setTimeout(() => {
                            //remove letter from dom
                            paragraph.removeChild(letter)
                        }, 2000)
                        letter.style.opacity = 0
                        letter.style.transition = `opacity ${
                            Math.random() * (2 - 1)
                        }s ease-in-out`
                    }

                    document
                        .getElementsByTagName('body')[0]
                        .classList.remove('cursor-wait')
                }, 100)
            })
        }
    })
}
