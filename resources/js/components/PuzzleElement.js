export class PuzzleElement extends HTMLElement {
    #interval;
    #time;
    #hintCount;
    #level;
    #held;
    #rngX;
    #rngY;

    constructor() {
        super();
        this.dataset.content
        this.#interval = null;
        this.#time = new Date();
        this.#hintCount = 0;
        this.#level = 0;
        this.#held = null;
        this.#rngX = null;
        this.#rngY = null
    }

    connectedCallback() {
        this.innerText = this.dataset.content;
        this.loadEventListeners();
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
            }, offset);
        });

        setTimeout(() => {
            this.innerText = this.dataset.content;
        }, 300);

        this.#interval = setInterval(this.glimmerHint, 10000);
        this.#hintCount++;
    }

    loadEventListeners = () => {
        this.addEventListener('mousedown', this.mDown);
        this.addEventListener('mouseup', this.mUp);
        this.addEventListener('dragstart', this.dStart);
        this.addEventListener('dragend', this.dEnd);
        this.addEventListener('drag', this.d);
    }

    removeEventListeners = () => {
        clearInterval(this.#interval);
        this.removeEventListener('mousedown', this.mDown);
        this.removeEventListener('mouseup', this.mUp);
        this.removeEventListener('dragstart', this.dStart);
        this.removeEventListener('dragend', this.dEnd);
        this.removeEventListener('drag', this.d);
        const gem = '💎';
    }

    mDown = e => {
        let target = e.target;
        target.setAttribute('draggable', true);
        target.classList.add('shadow-outer', 'text-gruvbox-gray');
    }

    mUp = e => {
        const target = e.target;
        target.classList.remove('text-gruvbox-gray', 'shadow-outer','cursor-grabbing');
        target.classList.add('cursor-pointer')
    }

    dStart = e => {
        const mainHeader = document.getElementById('main_header');
        const footer = document.getElementById('footer');
        const body = document.querySelector('body');

        clearInterval(this.#interval);
        const target = e.target;
        target.textContent = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

        const mainHeaderHeight = mainHeader.offsetHeight;
        const footerHeight = footer.offsetHeight;
        const padding = 15;

        this.#level = this.#level === 0 ? 1 : 2;

        let maxHeight = window.innerHeight - footerHeight - padding;
        let minHeight = mainHeaderHeight + padding;

        this.#rngX = Math.random() *
            (window.innerWidth - padding - padding) + padding;
        this.#rngY = Math.random() *
            (maxHeight - minHeight) + minHeight;

        const key = document.createElement('div');
        key.innerHTML = '💡';
        key.classList.add('absolute', 'z-50', 'text-5xl');
        key.id = 'key';

        body.appendChild(key);
        target.classList.remove('cursor-pointer', 'shadow-outer');
        target.classList.add('cursor-grabbing');
    }

    dEnd = e => {
        setTimeout(() => {
        this.glimmerHint();
        }, 1500);

        const target = e.target;
        const body = document.querySelector('body');

        this.#level = 0;

        target.textContent = this.dataset.content;
        target.classList.remove('text-gruvbox-gray', 'shadow-outer','cursor-grabbing');
        target.classList.add('cursor-pointer');
        target.setAttribute('draggable', false);
        body.removeChild(document.getElementById('key'))
    }

    d = e => {
        const target = e.target;
        const key = document.getElementById('key');
        const eh = document.getElementById('eh');

        let mouseX = e.clientX;
        let mouseY = e.clientY;

        key.style.left = `${mouseX - 20}px`;
        key.style.top = `${mouseY - 40}px`;

        const ehPosition = eh.getBoundingClientRect();

        let deltaX = this.#rngX - mouseX;
        let deltaY = this.#rngY - mouseY;

        if (this.#level === 2) {
            deltaX = (ehPosition.x + (ehPosition.width / 2)) - mouseX;
            deltaY = (ehPosition.y +(ehPosition.height / 2)) - mouseY;
        }

        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        let theta = Math.atan2(deltaY, deltaX);
        let angle = (theta / Math.PI) * 180 + (theta > 0 ? 0 : 360);

        // the added 225 degrees is to account for the emoji being already rotated
        let rotate = 0;
        if (this.#level === 2 && this.#held === null) {
            rotate = angle + 225;
        }

        key.style.transform = `rotate(${rotate}deg)`;

        if (
            mouseX > this.#rngX &&
            mouseX < this.#rngX + ehPosition.width &&
            mouseY > this.#rngY &&
            mouseY < this.#rngY + ehPosition.height
        ) {
            target.classList.remove('cursor-grabbing');
            target.classList.add('cursor-progress');
            key.style.textShadow = `0 0 10px #cc241d, 0 0 18px #cc241d, 0 0 20px #cc241d`;

            if (this.#held === null) {
                this.#held = new Date();
                this.#held = this.#held.setSeconds(
                    this.#held.getSeconds() + 2
                );
            } else if (this.#held < new Date().getTime()) {
                this.#level = 2;
                this.#held = null;
                this.#rngX = ehPosition.x - mouseX;
                this.#rngY = ehPosition.y - mouseY;

                key.innerHTML = '🔑';
                key.style.textShadow = `none`;
                key.style.color = `#000000`;
            }

        } else if (distance <= 400 && this.#level === 1) {
            this.#held = null;
            let spread = distance < 100 ? 0.5 : 0.1;
            if (distance < 25) {
                key.style.textShadow = `0 0 ${distance / spread}px #fe8019, 0 0 ${
                    distance / spread
                }px #fe8019, 0 0 ${distance / spread}px #EDD205`;
                key.style.color = `#fe8019`;
            } else {
                key.style.textShadow = `0 0 ${distance / spread}px #FFE205, 0 0 ${
                    distance / spread
                }px #FFE205, 0 0 ${distance / spread}px #EDD205`;
                key.style.color = `#FFE205`;
            }
        } else if (this.#level !== 2) {
            this.#held = null;
            key.style.textShadow = `none`;
            key.style.color = `#000000`;
            eh.classList.remove('text-gruvbox-yellow');
            eh.classList.add('text-gruvbox-gray');
        }

        if (target.classList.contains('cursor-progress')) {
            target.classList.remove('cursor-progress')
            target.classList.add('cursor-grabbing')
        }

        if (this.#level === 2 &&
            mouseX > ehPosition.x &&
            mouseX < ehPosition.x + ehPosition.width &&
            mouseY > ehPosition.y &&
            mouseY < ehPosition.y + ehPosition.height
        ) {
            eh.classList.remove('text-gruvbox-gray')
            eh.classList.add('text-gruvbox-yellow')
            if (this.#held === null) {
                this.#held = new Date();
                this.#held = this.#held.setSeconds(
                    this.#held.getSeconds() + 2
                );
            } else if (this.#held < new Date().getTime()) {
                this.#held = null;
                key.innerHTML = '🔓';
                this.#level = 3;
                let detail = {
                    'hintCount': this.#hintCount,
                    'time': (new Date() - this.#time) / 1000
                }
                window.dispatchEvent(new CustomEvent(
                    'won',
                    { detail: detail })
                );
                this.removeEventListeners();
            } else if (this.#level < 3) {
                key.innerHTML = '🔐';
            }
        } else {
            if (this.#level == 2) {
                key.innerHTML = '🔑';
                this.#held = null;
            }
            eh.classList.remove('text-gruvbox-yellow');
            eh.classList.add('text-gruvbox-gray');
        }
    }
}

customElements.define('puzzle-element', PuzzleElement);
