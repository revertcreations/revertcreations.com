export class TreasureElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        window.addEventListener('treasureHint', this.treasureHint);
        this.style.transition = "color 0.2s ease, text-shadow 0.2s ease";
    }

    disconnectedCallback() {
        window.removeEventListener('treasureHint', this.treasureHint);
        this.resetGlow();
    }

    resetGlow = () => {
        this.style.textShadow = "";
        this.style.color = "";
    };

    treasureHint = (data) => {
        const distanceToTreasure = data?.detail?.distanceToTreasure;
        if (typeof distanceToTreasure !== "number") {
            this.resetGlow();
            return;
        }

        if (distanceToTreasure > 240) {
            this.resetGlow();
            return;
        }

        const clamped = Math.max(0, Math.min(distanceToTreasure, 240));
        const intensity = 1 - clamped / 240;
        const radius = 8 + intensity * 24;
        const glow = `0 0 ${radius}px rgba(250,189,47,${0.3 + intensity * 0.4}), 0 0 ${radius * 1.8}px rgba(214,93,14,${0.25 + intensity * 0.3})`;

        this.style.textShadow = glow;
        this.style.color = intensity > 0.6 ? "#fabd2f" : "";
    }

}

customElements.define('treasure-element', TreasureElement);
