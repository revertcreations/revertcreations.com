export class PuzzleElement extends HTMLElement {
    #interval;
    #hintCount;
    constructor() {
        super();
        this.dataset.content
        this.#interval = null;
        this.#hintCount = 0;
    }

    connectedCallback() {
        this.innerText = this.dataset.content;

        setTimeout(() => {
            this.glimmerHint();
        }, 500);
    }

    glimmerHint = () => {
        const content = this.dataset.content;
        const duration = 300/this.dataset.content.split('').length;

        this.innerHTML = "";
        clearInterval(this.#interval);

        content.split('').forEach((letter, index) => {
            const offset = index * duration;
            let span = document.createElement('span');
            span.innerText = letter;
            this.appendChild(span);
            setTimeout(() => {
                if (index > 0 && index < content.length)
                    this.childNodes[index-1].classList.remove('text-gruvbox-white');
                span.classList.add('text-gruvbox-white');
            }
        , offset);
        });

        setTimeout(() => {
            this.innerText = this.dataset.content;
        }, 300);

        this.#interval = setInterval(this.glimmerHint, 10000);
        this.#hintCount++;
    }
}

customElements.define('puzzle-element', PuzzleElement);
