export class NameElement extends HTMLElement {
    #error;
    #success;
    #success2;
    #unlock;
    #unlock2;
    #textColors;

    constructor() {
        super();
        this.dataset.name;

        this.#error = new Audio('/audio/error3.wav');
        this.#success = new Audio('/audio/success1.wav');
        this.#success2 = new Audio('/audio/success3.wav');
        this.#unlock = new Audio('/audio/unlock.wav');
        this.#unlock2 = new Audio('/audio/unlock2.wav');
        this.#textColors = [
            'text-gruvbox-light-yellow',
            'text-gruvbox-yellow',
            'text-gruvbox-orange',
            'text-gruvbox-purple',
            'text-gruvbox-blue',
            'text-gruvbox-aqua',
            'text-gruvbox-gray',
            'text-gruvbox-green',
            'text-gruvbox-red',
        ];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.dataset.name.split('').forEach(letter => {
            let span = document.createElement('span');
            span.classList.add('cursor-pointer', 'select-none', 'text-8xl');
            span.innerText = letter;
            span.setAttribute('data-click-count', 0);
            span.addEventListener('click', this.nameLetterClicked, { passive: true });
            this.appendChild(span);
            //setInterval(this.nameLetterClicked, 110, { target: span }, true);
        });
    }

    nameLetterClicked = (e, loading = false) => {
        const target = e.target;
        let clickCount = target.getAttribute('data-click-count') || 0;

        target.classList.remove(...this.#textColors);

        if (loading) {
            clickCount = Math.floor(Math.random() * this.#textColors.length);
        } else {
            clickCount = clickCount == this.#textColors.length ? 0 : ++clickCount;
        }

        target.setAttribute('data-click-count', clickCount);
        target.classList.add(this.#textColors[clickCount]);

        let isGreen = target.classList.contains('text-gruvbox-green');
        let isPurple = target.classList.contains('text-gruvbox-purple');

        if (!loading && (isGreen || isPurple)) {
            if (isGreen) {
                this.#success.currentTime = 0;
                this.#success.play();
            } else if (isPurple) {
                this.#success2.currentTime = 0;
                this.#success2.play();
            }

            target.classList.remove('cursor-not-allowed');
            target.classList.add('cursor-copy');
        } else if (!loading) {
            this.#error.currentTime = 0;
            this.#error.play();

            target.classList.remove('cursor-copy', 'cursor-pointer', 'cursor-not-allowed');
            target.classList.add('cursor-not-allowed');

            setTimeout(() => {
                target.classList.remove('cursor-not-allowed');
                target.classList.add('cursor-pointer');
            }, 500);
        }

        let allGreen = true;
        let allPurple = true;

        this.childNodes.forEach(letter => {
            if (!letter.classList.contains('text-gruvbox-green')) {
                allGreen = false;
            }
            if (!letter.classList.contains('text-gruvbox-purple')) {
                allPurple = false;
            }
        });

        if (!loading) {
            if (allGreen || allPurple) {
                let unlockType = allGreen ? 'green' : 'purple';
                if (allGreen) {
                   this.#unlock.currentTime = 0
                   this.#unlock.play()
                } else {
                   this.#unlock2.currentTime = 0
                   this.#unlock2.play()
                }
                // TODO: add method to create loading state
                // nameCursorLoading()
                // TODO: add window event trigger to change content
                window.dispatchEvent(new Event("unlock", { type: unlockType }));
                // disapearingParagraphs(selected)
            }
        }
    }
}

customElements.define('name-element', NameElement);
