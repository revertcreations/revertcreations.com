import { gsap } from "gsap";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * FancyButtonElement
 *
 * Takes a standard anchor link and splits its label text into individual
 * span elements to run complex staggered GSAP animations on hover/press.
 * Alternatively, wraps a container with `data-fancy-letters` and applies
 * animations to its pre-existing SVG path children natively.
 */
export class FancyButtonElement extends HTMLElement {
    #label = null;
    #link = null;
    #usingPointerEvents = false;
    #placeholder = null;
    #letterLayer = null;
    #letters = [];
    #placeholderLetters = [];
    #letterAnchors = [];
    #letterSizes = [];
    #placeholderRect = null;
    #containerRect = null;
    #pressTimeline = null;
    #releaseTimeline = null;
    #hoverAnimation = null;

    // Fine-tune the hover animation feel here
    #config = {
        waveHeight: 15, // How high the letters jump (positive is up)
        staggerAmount: 0.05, // Delay cascade between each letter
        duration: 0.4, // Base animation duration
    };

    connectedCallback() {
        this.#hydrateStructure();

        if (!this.#link || (!this.#label && !this.#letters.length)) {
            return;
        }

        this.#usingPointerEvents =
            typeof window !== "undefined" && window.PointerEvent !== undefined;

        if (getComputedStyle(this).display === "inline") {
            this.style.display = "block";
        }

        this.style.touchAction = this.style.touchAction || "none";

        // Pointer events should pass through the label so the link remains clickable
        if (this.#label) {
            this.#label.style.pointerEvents = "none";
        }

        this.#applyLayoutStyles();

        this.#updateMetrics();
        this.#adjustLayoutDimensions();
        this.#initializeTweens();

        if (this.#usingPointerEvents) {
            this.addEventListener("pointerenter", this.#handlePointerEnter);
            this.addEventListener("pointerdown", this.#handlePointerDown);
            this.addEventListener("pointerleave", this.#handlePointerLeave);
            this.addEventListener("pointercancel", this.#handlePointerUp);
            this.addEventListener("pointerup", this.#handlePointerUp);
        } else {
            this.addEventListener("mouseenter", this.#handlePointerEnter);
            this.addEventListener("mouseleave", this.#handlePointerLeave);
            this.addEventListener("touchstart", this.#handleTouchStart, {
                passive: false,
            });
            this.addEventListener("touchend", this.#handleTouchEnd);
            this.addEventListener("touchcancel", this.#handleTouchEnd);
        }

        window.addEventListener("resize", this.#handleResize);
    }

    disconnectedCallback() {
        if (this.#usingPointerEvents) {
            this.removeEventListener("pointerenter", this.#handlePointerEnter);
            this.removeEventListener("pointerdown", this.#handlePointerDown);
            this.removeEventListener("pointerleave", this.#handlePointerLeave);
            this.removeEventListener("pointercancel", this.#handlePointerUp);
            this.removeEventListener("pointerup", this.#handlePointerUp);
        } else {
            this.removeEventListener("mouseenter", this.#handlePointerEnter);
            this.removeEventListener("mouseleave", this.#handlePointerLeave);
            this.removeEventListener("touchstart", this.#handleTouchStart);
            this.removeEventListener("touchend", this.#handleTouchEnd);
            this.removeEventListener("touchcancel", this.#handleTouchEnd);
        }

        window.removeEventListener("resize", this.#handleResize);

        this.#cancelPressEffect(true);
    }

    #hydrateStructure() {
        this.#link = this.querySelector("a");

        if (!this.#link) {
            const href = this.dataset.href;
            if (!href) {
                return;
            }

            this.#link = document.createElement("a");
            this.#link.href = href;
            this.#link.classList.add("block", "h-full", "w-full", "relative");
            this.appendChild(this.#link);
        }

        const fancyLettersContainer = this.querySelector("[data-fancy-letters]");
        if (fancyLettersContainer) {
            this.#placeholder = fancyLettersContainer;
            this.#letterLayer = fancyLettersContainer;
            this.#letters = Array.from(fancyLettersContainer.children);
            return;
        }

        this.#label = this.querySelector("[data-fancy-label]") || this.querySelector("span, h2");

        if (!this.#label) {
            this.#label = document.createElement("span");
            this.#label.dataset.fancyLabel = "";
            this.#label.textContent = this.dataset.label || "";
            this.#link.appendChild(this.#label);
        } else if (!this.#label.dataset.fancyLabel) {
            this.#label.dataset.fancyLabel = "";
        }

        this.#prepareLabelLayers();
    }

    #prepareLabelLayers() {
        if (!this.#label) return;

        const originalText = this.#label.textContent ?? "";
        this.#label.innerHTML = "";
        this.#label.classList.add("relative", "inline-block");
        this.#label.style.position = "absolute";
        this.#label.style.left = "0";
        this.#label.style.top = "0";
        this.#label.style.width = "100%";
        this.#label.style.height = "100%";
        this.#label.style.display = "flex";
        this.#label.style.alignItems = "center";
        this.#label.style.justifyContent = "center";
        this.#label.setAttribute("aria-label", originalText.trim());

        this.#placeholder = document.createElement("span");
        this.#placeholder.dataset.fancyPlaceholder = "";
        this.#placeholder.setAttribute("aria-hidden", "true");
        this.#placeholder.style.visibility = "hidden";
        this.#placeholder.style.pointerEvents = "none";
        this.#placeholder.style.display = "inline-block";
        this.#placeholder.style.whiteSpace = "pre";
        this.#label.appendChild(this.#placeholder);

        this.#letterLayer = document.createElement("span");
        this.#letterLayer.dataset.fancyLayer = "";
        this.#letterLayer.style.position = "absolute";
        this.#letterLayer.style.left = "0";
        this.#letterLayer.style.top = "0";
        this.#letterLayer.style.display = "block";
        this.#letterLayer.style.whiteSpace = "pre";
        this.#letterLayer.style.pointerEvents = "none";
        this.#letterLayer.style.color = "inherit";
        this.#label.appendChild(this.#letterLayer);

        this.#letters = [];
        this.#placeholderLetters = [];

        const characters = [...originalText];

        characters.forEach((char) => {
            const safeChar = char === " " ? "\u00A0" : char;

            const placeholderLetter = document.createElement("span");
            placeholderLetter.dataset.fancyPlaceholderLetter = "";
            placeholderLetter.textContent = safeChar;
            placeholderLetter.style.display = "inline-block";
            placeholderLetter.style.whiteSpace = "pre";
            this.#placeholder.appendChild(placeholderLetter);
            this.#placeholderLetters.push(placeholderLetter);

            const interactiveLetter = document.createElement("span");
            interactiveLetter.dataset.fancyLetter = "";
            interactiveLetter.textContent = safeChar;
            interactiveLetter.style.position = "absolute";
            interactiveLetter.style.display = "inline-block";
            interactiveLetter.style.whiteSpace = "pre";
            interactiveLetter.style.pointerEvents = "none";
            interactiveLetter.style.willChange = "transform";
            interactiveLetter.style.transformOrigin = "50% 50%";
            this.#letterLayer.appendChild(interactiveLetter);
            this.#letters.push(interactiveLetter);
        });

        if (!this.#letters.length) {
            const fallback = document.createElement("span");
            fallback.dataset.fancyLetter = "";
            fallback.textContent = originalText || "";
            fallback.style.position = "absolute";
            fallback.style.left = "0";
            fallback.style.top = "0";
            fallback.style.display = "inline-block";
            fallback.style.whiteSpace = "pre";
            fallback.style.pointerEvents = "none";
            this.#letterLayer.appendChild(fallback);
            this.#letters.push(fallback);
        }
    }

    #initializeTweens() {
        if (!this.#letters.length) return;

        if (!this.#letterAnchors.length) {
            this.#updateMetrics();
        }

        this.#letters.forEach((letter, index) => {
            const anchor = this.#letterAnchors[index] || { x: 0, y: 0 };
            gsap.set(letter, {
                x: anchor.x,
                y: anchor.y,
                transformOrigin: "50% 100%",
            });
        });
    }

    #handlePointerEnter = (event) => {
        this.#startHoverAnimation();
    };

    #handlePointerDown = (event) => {
        this.#startPressEffect();
    };

    #handlePointerLeave = () => {
        this.#endHoverAnimation();
        this.#cancelPressEffect();
    };

    #handlePointerUp = (event) => {
        this.#endPressEffect(true);
    };

    #handleTouchStart = (event) => {
        if (!event.touches || event.touches.length === 0) return;
        this.#startHoverAnimation();
        this.#startPressEffect();
    };

    #handleTouchEnd = () => {
        this.#endHoverAnimation();
        this.#endPressEffect(true);
    };

    #handleResize = () => {
        this.#updateMetrics();
        this.#adjustLayoutDimensions();
        this.#resetLettersToAnchors();
    };

    #applyLayoutStyles() {
        if (!this.#link || (!this.#label && !this.#letters.length)) return;

        this.style.display = this.style.display || "block";
        this.style.position = this.style.position || "relative";
        this.style.overflow = this.style.overflow || "hidden";

        this.#link.style.position = "relative";
        this.#link.style.display = "flex";
        this.#link.style.alignItems = "center";
        this.#link.style.justifyContent = "center";
        this.#link.style.width = "100%";
        this.#link.style.height = "100%";
        this.#link.style.overflow = "hidden";

        if (this.#label) {
            this.#label.style.position = "absolute";
            this.#label.style.left = "0";
            this.#label.style.top = "0";
            this.#label.style.width = "100%";
            this.#label.style.height = "100%";
            this.#label.style.display = "flex";
            this.#label.style.alignItems = "center";
            this.#label.style.justifyContent = "center";
        }
    }

    #hoverTweens = [];

    #startHoverAnimation() {
        if (this.#hoverAnimation) {
            this.#hoverAnimation.kill();
        }
        this.#hoverTweens.forEach((t) => t.kill());
        this.#hoverTweens = [];

        // Ensure starting from anchors before animating to avoid jumping
        this.#resetLettersToAnchors({ immediate: true });

        // Expand up and bounce down
        this.#letters.forEach((letter, index) => {
            const letterTl = gsap.timeline({
                delay: index * this.#config.staggerAmount,
            });

            // Calculate jump based on the config.waveHeight.
            // We add a random factor so it feels organic, not perfectly uniform.
            const jumpOffset = gsap.utils.random(
                this.#config.waveHeight * 0.5,
                this.#config.waveHeight,
            );
            // Subtract offset to move visually upwards within DOM coordinates
            const targetY = this.#letterAnchors[index].y - jumpOffset;

            // Pop upward
            letterTl.to(letter, {
                y: targetY,
                rotationZ: () => gsap.utils.random(-30, 30),
                scale: () => gsap.utils.random(1.1, 1.3),
                color: "#b16286", // High contrast accent color
                fill: "#b16286", // Used for SVG paths
                duration: this.#config.duration * 0.5, // Fast pop-up
                ease: "power2.out",
            });

            // Fall back to original resting position
            letterTl.to(letter, {
                y: () => this.#letterAnchors[index].y,
                rotationZ: 0,
                scale: 1,
                color: "inherit",
                fill: "",
                duration: this.#config.duration * 1.5, // Slower fall with bounce
                ease: "bounce.out",
            });

            this.#hoverTweens.push(letterTl);
        });
    }

    #endHoverAnimation() {
        if (this.#hoverAnimation) {
            this.#hoverAnimation.kill();
            this.#hoverAnimation = null;
        }
        this.#hoverTweens.forEach((t) => t.kill());
        this.#hoverTweens = [];

        gsap.to(this.#letters, {
            y: (index) => this.#letterAnchors[index]?.y || 0,
            rotationZ: 0,
            scale: 1,
            color: "inherit",
            fill: "",
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
        });
    }

    #resetLettersToAnchors(options = {}) {
        if (!this.#letters.length) return;

        this.#letters.forEach((letter, index) => {
            const anchor = this.#letterAnchors[index] || { x: 0, y: 0 };

            if (options.immediate) {
                gsap.set(letter, { x: anchor.x, y: anchor.y, rotationZ: 0 });
            } else {
                gsap.to(letter, {
                    x: anchor.x,
                    y: anchor.y,
                    rotationZ: 0,
                    duration: 0.4,
                    ease: "power2.out",
                });
            }
        });
    }

    #updateMetrics() {
        if (!this.#placeholder || !this.#link) return;

        this.#containerRect = this.#link.getBoundingClientRect();
        this.#placeholderRect = this.#placeholder.getBoundingClientRect();
        if (this.#letterLayer && this.#containerRect) {
            this.#letterLayer.style.width = `${this.#containerRect.width}px`;
            this.#letterLayer.style.height = `${this.#containerRect.height}px`;
        }
        this.#letterAnchors = [];
        this.#letterSizes = [];

        const offsetX = this.#placeholderRect.left - this.#containerRect.left;
        const offsetY = this.#placeholderRect.top - this.#containerRect.top;

        if (this.#placeholderLetters.length) {
            this.#placeholderLetters.forEach((placeholderLetter, index) => {
                const rect = placeholderLetter.getBoundingClientRect();
                this.#letterAnchors[index] = {
                    x: offsetX + (rect.left - this.#placeholderRect.left),
                    y: offsetY + (rect.top - this.#placeholderRect.top),
                };
                this.#letterSizes[index] = {
                    width: rect.width,
                    height: rect.height,
                };
            });
        } else if (this.querySelector("[data-fancy-letters]")) {
            // For SVG SVGs or manual opt-ins, their layout origin is naturally `{ x: 0, y: 0 }`
            this.#letters.forEach((l, index) => {
                this.#letterAnchors[index] = { x: 0, y: 0 };
            });
        } else {
            const rect = this.#placeholderRect;
            this.#letterAnchors[0] = { x: offsetX, y: offsetY };
            this.#letterSizes[0] = { width: rect.width, height: rect.height };
        }
    }

    #adjustLayoutDimensions() {
        if (!this.#placeholder || !this.#link) return;

        const linkStyles = getComputedStyle(this.#link);
        const paddingX = parseFloat(linkStyles.paddingLeft) + parseFloat(linkStyles.paddingRight);
        const paddingY = parseFloat(linkStyles.paddingTop) + parseFloat(linkStyles.paddingBottom);

        const { width, height } = this.#placeholder.getBoundingClientRect();
        const totalWidth = width + paddingX;
        const totalHeight = height + paddingY;

        this.style.minHeight = `${totalHeight}px`;
        this.#link.style.minHeight = `${totalHeight}px`;
        this.#link.style.minWidth = `${totalWidth}px`;

        if (this.#label) {
            this.#label.style.minHeight = `${height}px`;
            this.#label.style.minWidth = `${width}px`;
        }
    }

    #startPressEffect() {
        if (!this.#letters.length) return;

        if (this.#releaseTimeline) {
            this.#releaseTimeline.kill();
            this.#releaseTimeline = null;
        }
        if (this.#pressTimeline) {
            this.#pressTimeline.kill();
        }

        const tl = gsap.timeline();

        tl.to(this.#letters, {
            scale: 0.7,
            duration: 0.12,
            ease: "power2.out",
        });

        tl.to(this.#letters, {
            scale: 0.92,
            duration: 0.08,
            ease: "power1.out",
        });

        this.#pressTimeline = tl;

        gsap.to(this.#link, {
            backgroundColor: "rgba(0,0,0,0.05)",
            duration: 0.12,
            ease: "power2.out",
        });
    }

    #endPressEffect(withRelease = true) {
        if (!withRelease) {
            this.#cancelPressEffect();
            return;
        }

        if (this.#pressTimeline) {
            this.#pressTimeline.kill();
            this.#pressTimeline = null;
        }
        if (this.#releaseTimeline) {
            this.#releaseTimeline.kill();
        }

        const tl = gsap.timeline({
            onComplete: () => {
                this.#releaseTimeline = null;
            },
        });

        tl.to(this.#letters, {
            scale: 1.2,
            duration: 0.1,
            ease: "back.out(2)",
        });

        tl.to(this.#letters, {
            scale: 1,
            duration: 0.2,
            ease: "power3.out",
        });

        this.#releaseTimeline = tl;

        gsap.to(this.#link, {
            backgroundColor: "rgba(0,0,0,0)",
            duration: 0.24,
            ease: "power2.out",
        });
    }

    #cancelPressEffect(silent = false) {
        if (this.#pressTimeline) {
            this.#pressTimeline.kill();
            this.#pressTimeline = null;
        }

        if (this.#releaseTimeline) {
            this.#releaseTimeline.kill();
            this.#releaseTimeline = null;
        }

        gsap.to(this.#letters, {
            scale: 1,
            duration: silent ? 0 : 0.12,
            ease: "power2.out",
        });

        gsap.to(this.#link, {
            backgroundColor: "rgba(0,0,0,0)",
            duration: silent ? 0 : 0.12,
            ease: "power2.out",
        });
    }
}

if (!customElements.get("fancy-button-element")) {
    customElements.define("fancy-button-element", FancyButtonElement);
}
