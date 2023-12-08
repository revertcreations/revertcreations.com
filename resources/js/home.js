const myName = document.getElementById('name')
const lead = document.getElementById('lead')
const myNameLetters = document.querySelectorAll('#name span')
const hint = document.getElementById('hint')
const error = new Audio("/audio/error3.wav")
const success = new Audio("/audio/success1.wav")
const success2 = new Audio("/audio/success3.wav")
const unlock = new Audio("/audio/unlock.wav")
const unlock2 = new Audio("/audio/unlock2.wav")
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

// disapearingParagraphs('green')
hint.addEventListener('mousedown', e => {
    console.log('mousedown')
    e.target.setAttribute('draggable', true)
}, { passive: true })
hint.addEventListener('dragstart', e => {
    console.log('dragstart')
    e.target.classList.add('text-gruvbox-white')
    e.target.classList.remove('cursor-pointer')
    e.target.classList.add('cursor-move')
}, { passive: true })
hint.addEventListener('dragend', e => {
    console.log('dragend')
    e.target.classList.remove('text-gruvbox-white')
    e.target.classList.add('text-gruvbox-black')
    e.target.classList.remove('cursor-move')
    e.target.classList.add('cursor-pointer')
}, { passive: true })

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

    if  (textColors[clickCount]) {
        e.target.classList.add(textColors[clickCount])
    }

    let isGreen = e.target.classList.contains('text-gruvbox-green')
    let isPurple = e.target.classList.contains('text-gruvbox-purple')

    if (!loading && (isGreen || isPurple)) {
        
        if (isGreen) {
            success.currentTime = 0;
            success.play();
        } else if (isPurple) {
            success2.currentTime = 0;
            success2.play();
        }

        e.target.classList.remove('cursor-not-allowed')
        e.target.classList.add('cursor-copy')

    } else if (!loading) {

        error.currentTime = 0;
        error.play();

        e.target.classList.remove('cursor-copy')
        e.target.classList.remove('cursor-pointer')
        e.target.classList.remove('cursor-not-allowed')
        e.target.classList.add('cursor-not-allowed')
        
        setTimeout(() => {
            e.target.classList.remove('cursor-not-allowed')
            e.target.classList.add('cursor-pointer')
        }, 500);

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
                unlock.currentTime = 0;
                unlock.play();
            } else {
                unlock2.currentTime = 0;
                unlock2.play();
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
                    
                    document.getElementsByTagName('body')[0].classList.remove('cursor-wait')

                }, 100)
            })
        }
    })
}
