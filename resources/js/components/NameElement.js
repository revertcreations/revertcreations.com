//import { Playground } from "../playground.js";

export class NameElement extends HTMLElement {
    static observedAttributes = ["data-content"];

    #intervals = [];
    #cursorTimeout;

    #error = new Audio("/audio/error3.wav");
    #success = new Audio("/audio/success3.wav");
    #unlock = new Audio("/audio/unlock.wav");

    #textColors = [
        "text-gruvbox-light-yellow",
        "text-gruvbox-yellow",
        "text-gruvbox-orange",
        "text-gruvbox-purple",
        "text-gruvbox-blue",
        "text-gruvbox-aqua",
        "text-gruvbox-gray",
        "text-gruvbox-green",
        "text-gruvbox-red",
    ];

    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(oldValue === null) {
            return;
        } else {
            for (let i = 0; i < this.#intervals.length; i++) {
                clearInterval(this.#intervals[i]);
            }
            this.innerHTML = '';
            this.render();
        }
    }

    loadAnimation = (span, index) => {
        this.nameLetterClicked({ target: span }, true);

        let count = span.getAttribute("data-loading-count");
        if (count == 8) {
            clearInterval(this.#intervals[index]);
        }

        span.setAttribute("data-loading-count", ++count);
    };

    render() {
        this.dataset.content.split("").forEach((letter, i) => {
            let span = document.createElement("span");
            span.classList.add("cursor-pointer", "select-none", "text-8xl");
            span.innerText = letter;
            span.setAttribute("data-click-count", 0);
            span.setAttribute("data-loading-count", 0);
            span.addEventListener("click", this.nameLetterClicked, {
                passive: true,
            });

            this.appendChild(span);
            if (this.dataset.content === "Trever") {
                this.#intervals[i] = setInterval(this.loadAnimation, 50, span, i);
            }
        });
    }

    nameLetterClicked = (e, loading = false) => {
        clearTimeout(this.#cursorTimeout);
        const target = e.target;
        let clickCount = target.getAttribute("data-click-count") || 0;

        target.classList.remove(...this.#textColors);

        if (loading) {
            clickCount = Math.floor(Math.random() * this.#textColors.length);
        } else {
            clickCount =
                clickCount == this.#textColors.length ? 0 : ++clickCount;
        }

        target.setAttribute("data-click-count", clickCount);
        target.classList.add(this.#textColors[clickCount]);

        const isGreen = target.classList.contains("text-gruvbox-green");

        if (!loading && isGreen) {
            this.#success.currentTime = 0;
            this.#success.play();

            target.classList.remove("cursor-not-allowed");
            target.classList.add("cursor-copy");
        } else if (!loading) {
            this.#error.currentTime = 0;
            this.#error.play();

            target.classList.remove(
                "cursor-pointer",
                "cursor-not-allowed",
            );
            target.classList.add("cursor-not-allowed");

            this.#cursorTimeout = setTimeout(() => {
                target.classList.remove("cursor-not-allowed");
                target.classList.add("cursor-pointer");
            }, 500);
        }

        let allGreen = true;

        this.childNodes.forEach((letter) => {
            if (!letter.classList.contains("text-gruvbox-green")) {
                allGreen = false;
            }
        });

        if (!loading && allGreen) {
            let unlockType = "green";
            this.#unlock.currentTime = 0;
            this.#unlock.play();
            this.loadPlayground();
        }
    }

    async loadPlayground() {
        fetch("/skills")
                .then((response) => response.json())
                .then((data) => {
                    window.Playground.init(data.skills);
                    return;
                });
    }

    async disapearingParagraphs(selected) {

        return new Promise((resolve, reject) => {
            if (!selected) return;
            const lead = document.getElementById("lead");

            let paragraphs = lead.childNodes;
            let newParagraphs = [];
            let newParagraph;

            paragraphs.forEach((paragraph, i) => {
                newParagraph = null;

                if (
                    paragraph.nodeType === 1 &&
                    (!paragraph.classList ||
                        (paragraph.classList &&
                            !paragraph.classList.contains("hidden")))
                ) {
                    newParagraph = document.createElement("p");

                    paragraph.classList.forEach((className) => {
                        newParagraph.classList.add(className);
                    });
                    newParagraph.id = "exploding-paragraph-" + i;

                    paragraph.childNodes.forEach((words) => {
                        let text = words.textContent;
                        let letters = text.split("");

                        letters.forEach((letter) => {
                            let span = document.createElement("span");
                            if (words.classList) {
                                words.classList.forEach((className) => {
                                    span.classList.add(className);
                                });
                            }

                            span.innerText = letter;
                            if (letter != "\n") {
                                newParagraph.appendChild(span);
                            }
                        });
                    });
                }
                if (newParagraph) newParagraphs.push(newParagraph);
            });

            document.getElementById("default").classList.add("hidden");
            document.getElementById("secondary").classList.add("hidden");

            newParagraphs.forEach((newParagraph) => {
                lead.appendChild(newParagraph);
            });

            let disapearingParagraphs = document.querySelectorAll("#lead p");

            disapearingParagraphs.forEach((paragraph) => {
                if (!paragraph.classList.contains("hidden")) {
                    paragraph.classList.add("overflow-hidden");
                    let letters = paragraph.querySelectorAll("span");
                    letters.forEach((letter) => {
                        resolve(setTimeout(() => {
                            if (
                                selected == "green" &&
                                letter.classList.contains("text-gruvbox-green")
                            ) {
                                letter.style.fontSize = "3rem";
                                setTimeout(() => {
                                    paragraph.removeChild(letter);
                                }, 3500);
                            } else {
                                setTimeout(() => {
                                    //remove letter from dom
                                    paragraph.removeChild(letter);
                                }, 2000);
                                letter.style.opacity = 0;
                                letter.style.transition = `opacity ${
                                    Math.random() * (2 - 1)
                                }s ease-in-out`;
                            }

                            document
                                .getElementsByTagName("body")[0]
                                .classList.remove("cursor-wait");
                        }, 100));
                    });
                }
            });
        });
    }

    nameCursorLoading() {
        const myNameLetters = document.querySelectorAll("#name span");
        myNameLetters.forEach((letter) => {
            letter.classList.remove("cursor-copy");
            letter.classList.add("cursor-wait");
            setTimeout(() => {
                letter.classList.remove("cursor-wait");
                letter.classList.add("cursor-pointer");
            }, 3000);
        });

        let body = document.getElementsByTagName("body")[0];
        body.classList.add("cursor-wait");
    }
}

customElements.define("name-element", NameElement);
