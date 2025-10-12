import { gsap } from 'gsap'

export class NameElement extends HTMLElement {
    static observedAttributes = ['data-content']

    #intervals = []
    #cursorTimeout

    #audioContext = null
    #audioBuffers = {
        error: null,
        success: null,
        unlock: null
    }
    #audioReadyPromise = null

    #textColors = [
        'text-gruvbox-light-yellow',
        'text-gruvbox-yellow',
        'text-gruvbox-orange',
        'text-gruvbox-purple',
        'text-gruvbox-blue',
        'text-gruvbox-aqua',
        'text-gruvbox-gray',
        'text-gruvbox-green',
        'text-gruvbox-red'
    ]

    constructor () {
        super()
        this.#ensureAudioLoaded()
    }

    connectedCallback () {
        this.#ensureAudioLoaded()
        this.render()
    }

    attributeChangedCallback (name, oldValue, newValue) {
        if (oldValue === null) {
            return
        } else {
            for (let i = 0; i < this.#intervals.length; i++) {
                clearInterval(this.#intervals[i])
            }
            this.innerHTML = ''
            this.render()
        }
    }

    // loadAnimation = (span, index) => {
    //     this.nameLetterClicked({ target: span }, true)

    //     let count = span.getAttribute('data-loading-count')
    //     if (count == 8) {
    //         clearInterval(this.#intervals[index])
    //     }

    //     span.setAttribute('data-loading-count', ++count)
    // }

    #ensureAudioLoaded () {
        if (this.#audioReadyPromise) {
            return this.#audioReadyPromise
        }

        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (!AudioContext) {
            this.#audioReadyPromise = Promise.resolve()
            return this.#audioReadyPromise
        }

        this.#audioContext = new AudioContext()

        const loadBuffer = async url => {
            try {
                const response = await fetch(url)
                const arrayBuffer = await response.arrayBuffer()
                return await this.#audioContext.decodeAudioData(arrayBuffer)
            } catch (error) {
                console.error(`Failed to load audio: ${url}`, error)
                return null
            }
        }

        this.#audioReadyPromise = Promise.all([
            loadBuffer('/audio/error3.wav'),
            loadBuffer('/audio/success3.wav'),
            loadBuffer('/audio/unlock.wav')
        ]).then(([errorBuffer, successBuffer, unlockBuffer]) => {
            this.#audioBuffers.error = errorBuffer
            this.#audioBuffers.success = successBuffer
            this.#audioBuffers.unlock = unlockBuffer
        })

        return this.#audioReadyPromise
    }

    #playAudio (type) {
        if (!this.#audioContext || !this.#audioBuffers[type]) {
            return
        }

        if (this.#audioContext.state === 'suspended') {
            this.#audioContext
                .resume()
                .catch(error =>
                    console.error('Failed to resume audio context', error)
                )
        }

        const source = this.#audioContext.createBufferSource()
        source.buffer = this.#audioBuffers[type]
        source.connect(this.#audioContext.destination)
        source.start(0)
    }

    render () {
        // Clear old content
        this.innerHTML = ''

        // Ensure parent allows visible drops
        this.style.display = 'inline-block'
        this.style.overflow = 'visible'

        this.dataset.content.split('').forEach((letter, i) => {
            const span = document.createElement('span')
            span.classList.add('cursor-pointer', 'select-none', 'text-8xl')
            span.style.display = 'inline-block' // <-- key!
            // span.style.transform = 'translateY(200px)' // optional visual setup
            span.innerText = letter

            span.setAttribute('data-click-count', 0)
            span.setAttribute('data-loading-count', 0)
            span.addEventListener('click', this.nameLetterClicked, {
                passive: true
            })

            this.appendChild(span)

            // random rotation between -30 and +30 degrees
            const rotateRandom = gsap.utils.random(-90, 90, 1)
            // oppostie rotation direction for bounce
            const oppositeRotate = rotateRandom * -1

            // timeline for each letter
            const letterTl = gsap.timeline({
                delay: i * 0.18 // cascading
            })

            // first fall — starts above, hits “ground”
            letterTl.from(span, {
                y: -200,
                rotate: rotateRandom,
                transformOrigin: 'center bottom',
                ease: 'bounce.out',
                duration: 0.8,
                onUpdate: () => {
                    // span._gsap.y is something like "-2.345px"
                    const yValue = parseFloat(span._gsap.y) // convert to number (removes 'px')
                    // check if it's roughly between -10px and 0px
                    if (yValue >= -10 && yValue <= 0) {
                        this.nameLetterClicked({ target: span }, true)
                    }
                }
            })
        })
    }

    nameLetterClicked = (e, loading = false) => {
        clearTimeout(this.#cursorTimeout)
        const target = e.target
        let clickCount = target.getAttribute('data-click-count') || 0

        target.classList.remove(...this.#textColors)

        if (loading) {
            clickCount = Math.floor(Math.random() * this.#textColors.length)
        } else {
            clickCount =
                clickCount == this.#textColors.length ? 0 : ++clickCount
        }

        target.setAttribute('data-click-count', clickCount)
        target.classList.add(this.#textColors[clickCount])

        const isGreen = target.classList.contains('text-gruvbox-green')
        const letterTl = gsap.timeline({})

        if (!loading && isGreen) {
            this.#ensureAudioLoaded().then(() => this.#playAudio('success'))

            letterTl.to(target, {
                y: -4,
                duration: 0.1,
                ease: 'power1.out'
            })

            letterTl.to(target, {
                y: 0,
                duration: 0.3,
                ease: 'bounce.out'
            })

            target.classList.remove('cursor-not-allowed')
            target.classList.add('cursor-copy')
        } else if (!loading) {
            this.#ensureAudioLoaded().then(() => this.#playAudio('error'))

            letterTl.to(target, {
                x: -2,
                duration: 0.08,
                ease: 'elastic.inOut',
                repeat: 3,
                yoyo: true
            })

            target.classList.remove('cursor-pointer', 'cursor-not-allowed')
            target.classList.add('cursor-not-allowed')

            this.#cursorTimeout = setTimeout(() => {
                target.classList.remove('cursor-not-allowed')
                target.classList.add('cursor-pointer')
            }, 500)
        }

        let allGreen = true

        this.childNodes.forEach(letter => {
            if (!letter.classList.contains('text-gruvbox-green')) {
                allGreen = false
            }
        })

        if (!loading && allGreen) {
            let unlockType = 'green'
            this.#ensureAudioLoaded().then(() => this.#playAudio('unlock'))
            this.loadPlayground()
        }
    }

    async loadPlayground () {
        const skillsUrl = new URL('/skills', window.location.origin)

        fetch(skillsUrl.toString())
            .then(response => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to load skills (${response.status})`
                    )
                }

                return response.json()
            })
            .then(data => {
                if (data?.skills && window.Playground) {
                    window.Playground.init(data.skills)
                }

                if (typeof gtag === 'function') {
                    gtag('event', 'Skills Puzzle', {
                        event_category: 'Skills',
                        event_label: 'Skills Playground Loaded'
                    })
                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    async disapearingParagraphs (selected) {
        return new Promise((resolve, reject) => {
            if (!selected) return
            const lead = document.getElementById('lead')
            if (!lead) {
                resolve()
                return
            }

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

            document.getElementById('default')?.classList.add('hidden')
            document.getElementById('secondary')?.classList.add('hidden')

            newParagraphs.forEach(newParagraph => {
                lead.appendChild(newParagraph)
            })

            let disapearingParagraphs = document.querySelectorAll('#lead p')

            disapearingParagraphs.forEach(paragraph => {
                if (!paragraph.classList.contains('hidden')) {
                    paragraph.classList.add('overflow-hidden')
                    let letters = paragraph.querySelectorAll('span')
                    letters.forEach(letter => {
                        resolve(
                            setTimeout(() => {
                                if (
                                    selected == 'green' &&
                                    letter.classList.contains(
                                        'text-gruvbox-green'
                                    )
                                ) {
                                    letter.style.fontSize = '3rem'
                                    setTimeout(() => {
                                        paragraph.removeChild(letter)
                                    }, 3500)
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
                        )
                    })
                }
            })
        })
    }

    nameCursorLoading () {
        const myNameLetters = document.querySelectorAll('#name span')
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
}

customElements.define('name-element', NameElement)
