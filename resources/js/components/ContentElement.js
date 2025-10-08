export class ContentElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
    }


    disapearingParagraphs(selected) {
        if (!selected) return;
        const lead = document.getElementById("lead");
        if (!lead) return;

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

        document.getElementById("default")?.classList.add("hidden");
        document.getElementById("secondary")?.classList.add("hidden");

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
                    }, 100);
                });
            }
        });
    }

}

customElements.define('content-element', ContentElement);
