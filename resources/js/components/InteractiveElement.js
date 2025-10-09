import { MagnetLetters } from "../magnetLetters.js";

export class InteractiveElement extends HTMLElement {
    #cycleInterval = null;
    #characters = [];
    #baseSpan = null;
    #overlay = null;
    #tick = 0;
    #originalText = "";
    #resizeObserver = null;
    #resizeRAF = null;
    #badge = null;
    #badgeTimeout = null;
    #hasActivated = false;

    #fontFamilies = [
        '"Trebuchet MS", sans-serif',
        '"Courier New", monospace',
        '"Georgia", serif',
        '"Lucida Console", monospace',
        '"Times New Roman", serif',
        '"Gill Sans", sans-serif',
        '"Andale Mono", monospace',
        '"Palatino Linotype", serif',
        '"Comic Sans MS", cursive',
    ];

    #palette = [
        "#2a2727",
        "#c1bfbe",
        "#f0d43a",
        "#c1e718",
        "#22b2da",
        "#fb3934",
        "#cc241d",
        "#d79921",
        "#fabd2f",
        "#d65d0e",
        "#fe8019",
        "#458588",
        "#83a598",
        "#689d6a",
        "#8ec07c",
        "#a89984",
        "#98971a",
        "#b8bb26",
        "#d3869b",
        "#b16286",
        "#282828",
        "#32302f",
        "#fbf1c7",
        "#b9cc33",
        "#f13a44",
    ];

    connectedCallback() {
        this.classList.add("interactive-element");
        this.setAttribute("tabindex", this.getAttribute("tabindex") ?? "0");
        this.#originalText = (this.textContent ?? "").trim();
        this.dataset.original = this.#originalText;
        this.prepareCharacters();

        this.addEventListener("pointerenter", this.startCycle);
        this.addEventListener("pointerleave", this.stopCycle);
        this.addEventListener("click", this.handleClickHint);
        this.addEventListener("pointerdown", this.startCycle);
        this.addEventListener("pointerup", this.stopCycle);
        this.addEventListener("pointercancel", this.stopCycle);
        this.addEventListener("focus", this.startCycle);
        this.addEventListener("blur", this.stopCycle);
        this.addEventListener("dblclick", this.handleDoubleClick);
        this.addEventListener("touchend", this.handleDoubleTap, {
            passive: true,
        });
        this.observeResize();
    }

    disconnectedCallback() {
        this.stopCycle();
        this.removeEventListener("pointerenter", this.startCycle);
        this.removeEventListener("pointerleave", this.stopCycle);
        this.removeEventListener("click", this.handleClickHint);
        this.removeEventListener("pointerdown", this.startCycle);
        this.removeEventListener("pointerup", this.stopCycle);
        this.removeEventListener("pointercancel", this.stopCycle);
        this.removeEventListener("focus", this.startCycle);
        this.removeEventListener("blur", this.stopCycle);
        this.removeEventListener("dblclick", this.handleDoubleClick);
        this.removeEventListener("touchend", this.handleDoubleTap);
        this.disconnectResizeObserver();
        if (this.#badgeTimeout) {
            window.clearTimeout(this.#badgeTimeout);
            this.#badgeTimeout = null;
        }
    }

    prepareCharacters() {
        if (this.#characters.length) return;

        const text = this.#originalText;
        if (!text.length) return;

        if (!this.#baseSpan) {
            this.innerHTML = "";
            this.style.position = "relative";
            this.style.display = "inline-block";
            this.style.verticalAlign = "baseline";

            this.#baseSpan = document.createElement("span");
            this.#baseSpan.classList.add("interactive-base");
            this.appendChild(this.#baseSpan);

            this.#overlay = document.createElement("span");
            this.#overlay.classList.add("interactive-overlay");
            this.appendChild(this.#overlay);
        }

        this.#baseSpan.textContent = text;
        this.#overlay.innerHTML = "";

        this.ensureBadge();
        const measurements = this.measureCharacters(text);
        this.style.setProperty("--interactive-base-width", `${measurements.totalWidth}px`);
        this.style.setProperty("--interactive-base-height", `${measurements.height}px`);
        this.style.setProperty("--interactive-line-height", `${measurements.height}px`);

        this.#characters = [];
        text.split("").forEach((char, index) => {
            const span = document.createElement("span");
            span.classList.add("interactive-char");
            span.dataset.colorIndex = `${index % this.#palette.length}`;
            span.dataset.fontIndex = `${index % this.#fontFamilies.length}`;
            span.textContent = char === " " ? "\u00A0" : char;

            const width = measurements.widths[index] ?? measurements.averageWidth;
            span.style.width = `${width}px`;
            span.style.minWidth = `${width}px`;

            this.#overlay.appendChild(span);
            this.#characters.push(span);
        });
    }

    measureCharacters(text) {
        const charCount = Math.max(text.length, 1);
        const rect = this.#baseSpan.getBoundingClientRect();
        const totalWidth = rect.width || 0;
        const height =
            rect.height ||
            parseFloat(getComputedStyle(this).lineHeight) ||
            parseFloat(getComputedStyle(this).fontSize) ||
            0;
        const averageWidth = charCount > 0 ? totalWidth / charCount : totalWidth;
        const widths = new Array(charCount).fill(averageWidth);

        const node = this.#baseSpan.firstChild;
        if (node && node.nodeType === Node.TEXT_NODE) {
            const range = document.createRange();
            for (let i = 0; i < charCount; i++) {
                range.setStart(node, i);
                range.setEnd(node, i + 1);
                const glyphRect = range.getBoundingClientRect();
                widths[i] = glyphRect.width || averageWidth;
            }
            range.detach();
        }

        return { totalWidth, height, averageWidth, widths };
    }

    startCycle = () => {
        if (this.#cycleInterval) return;
        this.prepareCharacters();
        this.classList.add("interactive-cycling");
        this.#tick = 0;
        this.tickCharacters();

        const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        if (prefersReducedMotion) return;

        this.#cycleInterval = window.setInterval(() => {
            this.tickCharacters();
        }, 170);
    };

    tickCharacters() {
        this.#tick += 1;
        const wobbleSeed = this.#tick % 7;

        this.#characters.forEach((char, index) => {
            const colorIndex =
                (parseInt(char.dataset.colorIndex || "0", 10) + 1) % this.#palette.length;
            const fontIndex =
                (parseInt(char.dataset.fontIndex || "0", 10) + 1) % this.#fontFamilies.length;

            char.dataset.colorIndex = `${colorIndex}`;
            char.dataset.fontIndex = `${fontIndex}`;

            char.style.color = this.#palette[colorIndex];
            char.style.fontFamily = this.#fontFamilies[fontIndex];

            const wobble = ((wobbleSeed + index) % 5) - 2;
            char.style.transform = `rotate(${wobble * 1.2}deg) skewY(${wobble * 0.6}deg)`;
        });
    }

    stopCycle = () => {
        if (this.#cycleInterval) {
            window.clearInterval(this.#cycleInterval);
            this.#cycleInterval = null;
        }

        this.classList.remove("interactive-cycling");
        this.#characters.forEach((char) => {
            char.style.color = "";
            char.style.fontFamily = "";
            char.style.transform = "";
        });
    };

    observeResize() {
        if (this.#resizeObserver || !window.ResizeObserver) return;

        this.#resizeObserver = new ResizeObserver(() => {
            if (this.#resizeRAF) window.cancelAnimationFrame(this.#resizeRAF);
            this.#resizeRAF = window.requestAnimationFrame(() => {
                this.recalculate();
            });
        });

        this.#resizeObserver.observe(this);
    }

    disconnectResizeObserver() {
        if (!this.#resizeObserver) return;
        this.#resizeObserver.disconnect();
        this.#resizeObserver = null;
        if (this.#resizeRAF) {
            window.cancelAnimationFrame(this.#resizeRAF);
            this.#resizeRAF = null;
        }
    }

    recalculate() {
        const text = (this.#originalText || "").trim();
        if (!text.length) return;

        this.stopCycle();

        if (!this.#baseSpan || !this.#overlay) return;

        this.#characters = [];
        this.#baseSpan.textContent = text;
        this.#overlay.innerHTML = "";

        this.ensureBadge();
        const measurements = this.measureCharacters(text);
        this.style.setProperty("--interactive-base-width", `${measurements.totalWidth}px`);
        this.style.setProperty("--interactive-base-height", `${measurements.height}px`);
        this.style.setProperty("--interactive-line-height", `${measurements.height}px`);

        text.split("").forEach((char, index) => {
            const span = document.createElement("span");
            span.classList.add("interactive-char");
            span.dataset.colorIndex = `${index % this.#palette.length}`;
            span.dataset.fontIndex = `${index % this.#fontFamilies.length}`;
            span.textContent = char === " " ? "\u00A0" : char;

            const width = measurements.widths[index] ?? measurements.averageWidth;
            span.style.width = `${width}px`;
            span.style.minWidth = `${width}px`;

            this.#overlay.appendChild(span);
            this.#characters.push(span);
        });
    };

    handleClickHint = (event) => {
        if (this.#hasActivated) return;
        if (event.detail > 1) return;
        this.ensureBadge();
        this.showBadge();
    };

    handleDoubleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.toggleMagnetMode();
    };

    handleDoubleTap = (event) => {
        if (!event || !event.changedTouches || event.touches?.length) return;

        const touch = event.changedTouches[0];
        const timestamp = event.timeStamp;

        if (!this.lastTouchTimestamp) {
            this.lastTouchTimestamp = timestamp;
            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;
            return;
        }

        const deltaTime = timestamp - this.lastTouchTimestamp;
        const deltaX = Math.abs(touch.clientX - this.lastTouchX);
        const deltaY = Math.abs(touch.clientY - this.lastTouchY);

        if (deltaTime < 300 && deltaX < 30 && deltaY < 30) {
            event.preventDefault();
            event.stopPropagation();
            this.toggleMagnetMode();
            this.lastTouchTimestamp = null;
            return;
        }

        this.lastTouchTimestamp = timestamp;
        this.lastTouchX = touch.clientX;
        this.lastTouchY = touch.clientY;
    };

    ensureBadge() {
        if (this.#badge) return this.#badge;
        const badge = document.createElement("span");
        badge.classList.add("interactive-badge");
        badge.innerHTML = `<span aria-hidden="true">2x</span><span class="sr-only">Double click or double tap to scramble</span>`;
        this.appendChild(badge);
        this.#badge = badge;
        return badge;
    }

    showBadge() {
        if (this.dataset.badgeDismissed === "true") return;
        const badge = this.ensureBadge();
        if (!badge) return;

        badge.classList.add("is-visible");
        if (this.#badgeTimeout) window.clearTimeout(this.#badgeTimeout);
        this.#badgeTimeout = window.setTimeout(() => {
            this.hideBadge();
        }, 2200);
    }

    hideBadge(force = false) {
        if (!this.#badge) return;
        this.#badge.classList.remove("is-visible");
        if (this.#badgeTimeout) {
            window.clearTimeout(this.#badgeTimeout);
            this.#badgeTimeout = null;
        }
        if (force) {
            this.dataset.badgeDismissed = "true";
        }
    }

    toggleMagnetMode() {
        this.stopCycle();

        if (MagnetLetters.isActive()) {
            MagnetLetters.deactivate();
            this.hideBadge(true);
            return;
        }

        this.hideBadge(true);
        MagnetLetters.activate();
        this.#hasActivated = true;
    }
}

customElements.define("interactive-element", InteractiveElement);
