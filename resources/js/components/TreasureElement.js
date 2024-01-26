export class TreasureElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        window.addEventListener('treasureHint', this.treasureHint);
    }

    treasureHint = (data) => {
        let distanceToTreasure = data.detail.distanceToTreasure;
        let spread = distanceToTreasure < 40 ? 0.5 : 0.1;

        if (distanceToTreasure < 25) {
            this.style.textShadow = `0 0 ${distanceToTreasure / spread}px #fe8019, 0 0 ${
                distanceToTreasure / spread
            }px #fe8019, 0 0 ${distanceToTreasure / spread}px #EDD205`;
            this.style.color = `#fe8019`;
        } else {
            //this.style.textShadow = '';
            this.style.textShadow = `0 0 ${distanceToTreasure / spread}px #FFE205, 0 0 ${
                distanceToTreasure / spread
            }px #FFE205, 0 0 ${distanceToTreasure / spread}px #EDD205`;
            this.style.color = `#FFE205`;
        }


    }

}

customElements.define('treasure-element', TreasureElement);
