export class NameElement extends HTMLElement {
    static observedAttributes = ["name"];

    #error = new Audio("/audio/error3.wav");
    #success = new Audio("/audio/success1.wav");
    #success2 = new Audio("/audio/success3.wav");
    #unlock = new Audio("/audio/unlock.wav");
    #unlock2 = new Audio("/audio/unlock2.wav");
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
    #intervals = [];

    constructor() {
        super();
        this.dataset.name;
    }

    connectedCallback() {
        this.render();
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
        this.dataset.name.split("").forEach((letter, i) => {
            let span = document.createElement("span");

            span.classList.add("cursor-pointer", "select-none", "text-8xl");
            span.innerText = letter;
            span.setAttribute("data-click-count", 0);
            span.setAttribute("data-loading-count", 0);
            span.addEventListener("click", this.nameLetterClicked, {
                passive: true,
            });

            this.appendChild(span);

            this.#intervals[i] = setInterval(this.loadAnimation, 50, span, i);
        });
    }

    nameLetterClicked = (e, loading = false) => {
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
        const isPurple = target.classList.contains("text-gruvbox-purple");

        if (!loading && (isGreen || isPurple)) {
            if (isGreen) {
                this.#success.currentTime = 0;
                this.#success.play();
            } else if (isPurple) {
                this.#success2.currentTime = 0;
                this.#success2.play();
            }

            target.classList.remove("cursor-not-allowed");
            target.classList.add("cursor-copy");
        } else if (!loading) {
            this.#error.currentTime = 0;
            this.#error.play();

            target.classList.remove(
                "cursor-copy",
                "cursor-pointer",
                "cursor-not-allowed",
            );
            target.classList.add("cursor-not-allowed");

            setTimeout(() => {
                target.classList.remove("cursor-not-allowed");
                target.classList.add("cursor-pointer");
            }, 500);
        }

        let allGreen = true;
        let allPurple = true;

        this.childNodes.forEach((letter) => {
            if (!letter.classList.contains("text-gruvbox-green")) {
                allGreen = false;
            }
            if (!letter.classList.contains("text-gruvbox-purple")) {
                allPurple = false;
            }
        });

        if (!loading) {
            if (allGreen || allPurple) {
                let unlockType = allGreen ? "green" : "purple";

                if (allGreen) {
                    this.#unlock.currentTime = 0;
                    this.#unlock.play();
                } else {
                    this.#unlock2.currentTime = 0;
                    this.#unlock2.play();
                }
                // TODO: add method to create loading state
                // this.nameCursorLoading()
                // TODO: add window event trigger to change content
                //window.dispatchEvent(new Event("unlock", { type: unlockType }));
                this.disapearingParagraphs(unlockType);
            }
        }
    };

    disapearingParagraphs(selected) {
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
                    setTimeout(() => {
                        if (
                            (selected == "green" &&
                                letter.classList.contains(
                                    "text-gruvbox-green",
                                )) ||
                            (selected == "purple" &&
                                letter.classList.contains(
                                    "text-gruvbox-purple",
                                ))
                        ) {
                            letter.style.fontSize = "3rem";
                            setTimeout(() => {
                                paragraph.removeChild(letter);
                            }, 3500);
                        } else {
                            setTimeout(() => {
                                //remove letter from dom
                                paragraph.removeChild(letter);
                                window.dispatchEvent("foo");
                            }, 2000);
                            letter.style.opacity = 0;
                            letter.style.transition = `opacity ${
                                Math.random() * (2 - 1)
                            }s ease-in-out`;
                        }

                        document
                            .getElementsByTagName("body")[0]
                            .classList.remove("cursor-wait");
                    }, 100);
                });
            }
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
