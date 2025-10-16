const defaultPalette = [
    "#fb3934", // gruvbox-light-red
    "#cc241d", // gruvbox-red
    "#d79921", // gruvbox-light-yellow
    "#fabd2f", // gruvbox-yellow
    "#d65d0e", // gruvbox-light-orange
    "#fe8019", // gruvbox-orange
    "#458588", // gruvbox-light-blue
    "#83a598", // gruvbox-blue
    "#689d6a", // gruvbox-light-aqua
    "#8ec07c", // gruvbox-aqua
    "#98971a", // gruvbox-light-green
    "#b8bb26", // gruvbox-green
    "#d3869b", // gruvbox-light-purple
    "#b16286", // gruvbox-purple
    "#fbf1c7", // gruvbox-white
];

class MagnetBoard {
    constructor(hostElement, config = {}, options = {}) {
        this.hostElement = hostElement;
        this.config = { palette: defaultPalette, ...config };

        this.originalMarkup = null;
        this.containerBounds = { width: 0, height: 0 };
        this.activeLetter = null;
        this.animationFrame = null;
        this.pointerMoveListener = null;
        this.pointerUpListener = null;
        this.resizeObserver = null;

        this.letterState = new Map();
        this.spatialHash = new Map();
        this.dragState = new WeakMap();
    }

    activate() {
        if (this.originalMarkup !== null) return;
        if (!this.hostElement) return;

        const hostElementRect = this.hostElement.getBoundingClientRect();
        this.hostElement.dataset.hireModalShown = "false";
        this.originalMarkup = this.snapshotLeadMarkup(this.hostElement);
        this.hostElement.classList.add(ACTIVE_CLASS);
        this.hostElement.style.height = `${hostElementRect.height}px`;
        this.hostElement.style.position = "relative";
        this.hostElement.style.userSelect = "none";

        updateContainerBounds();
        flattenInteractiveElements(this.hostElement);
        buildLetters();
        updateContainerBounds();
        resolveAllOverlaps();
        activateLetters();
        initResizeObserver();
        checkSecretWords();
    }

    deactivate() {
        restoreMarkup();
    }

    isActive() {
        return this.originalMarkup !== null;
    }

    snapshotLeadMarkup(container) {
        const clone = container.cloneNode(true);
        clone.querySelectorAll("interactive-element").forEach((node) => {
            const replacement = this.snapshotInteractiveElement(node);
            node.replaceWith(replacement);
        });
        return clone.innerHTML;
    }

    snapshotInteractiveElement(node) {
        const replacement = document.createElement("interactive-element");

        const originalText =
            node.dataset?.original || node.getAttribute("data-original") || node.textContent || "";

        Array.from(node.attributes).forEach((attr) => {
            const { name, value } = attr;
            if (!value) return;

            if (name === "class") {
                const filtered = value
                    .split(/\s+/)
                    .map((cls) => cls.trim())
                    .filter(
                        (cls) =>
                            cls && cls !== "interactive-element" && cls !== "interactive-cycling",
                    );
                if (filtered.length) {
                    replacement.className = filtered.join(" ");
                }
                return;
            }

            if (name === "style") {
                replacement.setAttribute(name, value);
                return;
            }

            if (name.startsWith("data-")) {
                if (name === "data-original") return;
                if (name === "data-badge-dismissed") {
                    replacement.setAttribute(name, value);
                }
                return;
            }

            if (name === "tabindex" && value === "0") return;

            replacement.setAttribute(name, value);
        });

        if (originalText) {
            replacement.textContent = originalText;
            replacement.setAttribute("data-original", originalText);
        }

        return replacement;
    }
}
