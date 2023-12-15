import { NameElement } from './components/NameElement.js';
import { PuzzleElement } from './components/PuzzleElement.js';

window.addEventListener("DOMContentLoaded", () => {
    console.log('ahh yea');
    const mainHeader = document.getElementById('main_header')
    const lead = document.getElementById('lead')
    const footer = document.getElementById('footer')
    const myNameLetters = document.querySelectorAll('#name span')
    const hint = document.getElementById('hint')
    const eh = document.getElementById('eh')

    let state = 'default'
    if (hint) {


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
    }
});
