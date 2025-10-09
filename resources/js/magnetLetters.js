const palette = [
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

const LETTER_CLASS = "magnet-letter";
const ACTIVE_CLASS = "magnet-active";
const LETTER_HORIZONTAL_TOLERANCE = 35;
const LETTER_VERTICAL_TOLERANCE = 20;
const OVERLAP_TOLERANCE = 5;
const SECRET_WORDS = ["hire", "reset"];

const DRAG_STATE = new WeakMap();

let originalMarkup = null;
let leadContainer = null;
let pointerMoveListener = null;
let pointerUpListener = null;
let animationFrame = null;
let resizeObserver = null;
let lastPointerEvent = null;
let activeLetter = null;
let resetFrame = null;

const randomFromPalette = () =>
    palette[Math.floor(Math.random() * palette.length)];

const parseTranslate = (element) => {
    const transform = element.style.transform;
    if (!transform || transform === "none") return { x: 0, y: 0 };
    const match = transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px/);
    if (!match) return { x: 0, y: 0 };
    return { x: parseFloat(match[1]) || 0, y: parseFloat(match[2]) || 0 };
};

const createLetterSpan = (char, rect, containerRect, computedStyle) => {
    const span = document.createElement("span");
    span.classList.add(LETTER_CLASS);
    span.textContent = char === "\n" ? "" : char;
    span.dataset.char = char;

    span.style.position = "absolute";
    span.style.left = `${rect.left - containerRect.left}px`;
    span.style.top = `${rect.top - containerRect.top}px`;
    span.style.width = `${rect.width}px`;
    span.style.height = `${rect.height}px`;
    span.style.display = "flex";
    span.style.alignItems = "center";
    span.style.justifyContent = "center";
    span.style.userSelect = "none";
    span.style.touchAction = "none";
    span.style.cursor = "grab";
    if (computedStyle.font && computedStyle.font !== "inherit") {
        span.style.font = computedStyle.font;
    } else {
        span.style.fontFamily = computedStyle.fontFamily;
        span.style.fontSize = computedStyle.fontSize;
        span.style.fontWeight = computedStyle.fontWeight;
    }
    span.style.lineHeight =
        computedStyle.lineHeight === "normal"
            ? computedStyle.fontSize
            : computedStyle.lineHeight;
    span.style.letterSpacing = computedStyle.letterSpacing;
    span.style.color = randomFromPalette();
    span.style.textTransform = "none";
    span.style.transform = "translate3d(0px, 0px, 0)";
    span.style.transition = "color 120ms ease";

    return span;
};

const letterizeNode = (node, containerRect, fragments, computedStyle) => {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? "";
        const range = document.createRange();

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char.trim() === "" && char !== " ") {
                continue;
            }

            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const rects = range.getClientRects();
            if (!rects.length) continue;

            const rect = rects[0];
            const letterSpan = createLetterSpan(
                char,
                rect,
                containerRect,
                computedStyle,
            );
            fragments.push(letterSpan);
        }

        range.detach();
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        if (element.classList.contains(LETTER_CLASS)) {
            return;
        }

        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden") return;

        Array.from(node.childNodes).forEach((child) =>
            letterizeNode(child, containerRect, fragments, style),
        );
    }
};

const buildLetters = () => {
    if (!leadContainer) return;
    const containerRect = leadContainer.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(leadContainer);
    const fragments = [];

    Array.from(leadContainer.childNodes).forEach((child) =>
        letterizeNode(child, containerRect, fragments, computedStyle),
    );

    leadContainer.innerHTML = "";
    fragments.forEach((fragment) => leadContainer.appendChild(fragment));
};

const flattenInteractiveElements = (container) => {
    const interactiveNodes = container.querySelectorAll("interactive-element");
    interactiveNodes.forEach((node) => {
        const text = node.dataset?.original || node.textContent || "";
        const span = document.createElement("span");
        span.textContent = text;
        if (node.className) span.className = node.className;
        if (node.hasAttribute("style"))
            span.setAttribute("style", node.getAttribute("style"));
        node.replaceWith(span);
    });
};

const snapshotInteractiveElement = (node) => {
    const replacement = document.createElement("interactive-element");

    const originalText =
        node.dataset?.original ||
        node.getAttribute("data-original") ||
        node.textContent ||
        "";

    Array.from(node.attributes).forEach((attr) => {
        const { name, value } = attr;
        if (!value) return;

        if (name === "class") {
            const filtered = value
                .split(/\s+/)
                .map((cls) => cls.trim())
                .filter(
                    (cls) =>
                        cls &&
                        cls !== "interactive-element" &&
                        cls !== "interactive-cycling",
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
};

const snapshotLeadMarkup = (container) => {
    const clone = container.cloneNode(true);
    clone.querySelectorAll("interactive-element").forEach((node) => {
        const replacement = snapshotInteractiveElement(node);
        node.replaceWith(replacement);
    });
    return clone.innerHTML;
};

const onPointerMove = (event) => {
    if (!activeLetter) return;
    lastPointerEvent = event;

    if (animationFrame) return;

    animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        if (!activeLetter || !lastPointerEvent) return;

        const state = DRAG_STATE.get(activeLetter);
        if (!state) return;

        const pointerX =
            lastPointerEvent.clientX ?? lastPointerEvent.touches?.[0]?.clientX ?? 0;
        const pointerY =
            lastPointerEvent.clientY ?? lastPointerEvent.touches?.[0]?.clientY ?? 0;

        const deltaX = pointerX - state.startX;
        const deltaY = pointerY - state.startY;
        const x = state.initialX + deltaX;
        const y = state.initialY + deltaY;

        activeLetter.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
};

const endDrag = () => {
    if (!activeLetter) return;

    const finishedLetter = activeLetter;

    finishedLetter.style.cursor = "grab";
    finishedLetter.style.zIndex = "1";
    const state = DRAG_STATE.get(finishedLetter);
    if (state?.pointerId !== undefined && activeLetter.releasePointerCapture) {
        try {
            finishedLetter.releasePointerCapture(state.pointerId);
        } catch (_error) {
            /* ignore */
        }
    }

    evaluateLetterDrop(finishedLetter);

    activeLetter = null;
    lastPointerEvent = null;
};

const onPointerDown = (event) => {
    const target = event.currentTarget;
    activeLetter = target;
    const rect = target.getBoundingClientRect();
    const pointerX = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
    const pointerY = event.clientY ?? event.touches?.[0]?.clientY ?? 0;
    const currentTranslate = parseTranslate(target);
    DRAG_STATE.set(target, {
        startX: pointerX,
        startY: pointerY,
        initialX: currentTranslate.x,
        initialY: currentTranslate.y,
        pointerId: event.pointerId,
    });

    if (target.setPointerCapture && event.pointerId !== undefined) {
        try {
            target.setPointerCapture(event.pointerId);
        } catch (_error) {
            /* ignore */
        }
    }

    target.style.cursor = "grabbing";
    target.style.zIndex = "10";
};

const activateLetters = () => {
    const letters = leadContainer.querySelectorAll(`.${LETTER_CLASS}`);
    letters.forEach((letter) => {
        letter.addEventListener("pointerdown", onPointerDown, { passive: true });
        letter.addEventListener("pointerup", endDrag, { passive: true });
        letter.addEventListener("pointercancel", endDrag, { passive: true });
    });

    pointerMoveListener = onPointerMove;
    pointerUpListener = endDrag;

    window.addEventListener("pointermove", pointerMoveListener, { passive: true });
    window.addEventListener("pointerup", pointerUpListener, { passive: true });
    window.addEventListener("pointercancel", pointerUpListener, { passive: true });

    window.addEventListener("touchmove", pointerMoveListener, { passive: true });
    window.addEventListener("touchend", pointerUpListener, { passive: true });
    window.addEventListener("touchcancel", pointerUpListener, { passive: true });
};

const deactivateLetters = () => {
    window.removeEventListener("pointermove", pointerMoveListener ?? (() => {}));
    window.removeEventListener("pointerup", pointerUpListener ?? (() => {}));
    window.removeEventListener("pointercancel", pointerUpListener ?? (() => {}));
    window.removeEventListener("touchmove", pointerMoveListener ?? (() => {}));
    window.removeEventListener("touchend", pointerUpListener ?? (() => {}));
    window.removeEventListener("touchcancel", pointerUpListener ?? (() => {}));

    pointerMoveListener = null;
    pointerUpListener = null;
    activeLetter = null;
};

const restoreMarkup = () => {
    if (!leadContainer || originalMarkup === null) return;

    deactivateLetters();
    leadContainer.innerHTML = originalMarkup;
    leadContainer.classList.remove(ACTIVE_CLASS);
    leadContainer.style.height = "";
    leadContainer.style.position = "";
    leadContainer.style.userSelect = "";
    if (leadContainer.dataset) {
        delete leadContainer.dataset.hireModalShown;
    }
    originalMarkup = null;

    stopResizeObserver();
    stopResetPolling();
    leadContainer = null;
};

const handleHireSecret = () => {
    const scheduleHireForm = () => {
        if (typeof window === "undefined") return;
        const playground = window.Playground;
        if (playground && typeof playground.reset === "function") {
            playground.reset("hire");
        }
    };

    if (typeof window !== "undefined" && window.requestAnimationFrame) {
        window.requestAnimationFrame(scheduleHireForm);
    } else {
        scheduleHireForm();
    }
};

const SECRET_HANDLERS = {
    hire: handleHireSecret,
    reset: restoreMarkup,
};

const calculateLetterPositions = () => {
    if (!leadContainer) return [];
    return Array.from(leadContainer.querySelectorAll(`.${LETTER_CLASS}`)).map(
        (letter) => {
            const rect = letter.getBoundingClientRect();
            return {
                element: letter,
                char: letter.dataset.char ?? letter.textContent ?? "",
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
            };
        },
    );
};

const triggerSecretWord = (word) => {
    if (word === "hire" && leadContainer?.dataset?.hireModalShown === "true") {
        return true;
    }
    const handler = SECRET_HANDLERS[word];
    if (!handler) return false;
    handler();
    if (word === "hire" && leadContainer) {
        leadContainer.dataset.hireModalShown = "true";
    }
    return true;
};

const detectWord = (targetWord) => {
    if (!leadContainer) return false;
    if (!targetWord) return false;

    const letters = calculateLetterPositions();
    if (!letters.length) return false;

    const targetChars = targetWord.toLowerCase().split("");
    const matches = [];

    letters.forEach((info) => {
        const char = (info.char || "").toLowerCase();
        if (targetChars.includes(char) && char.trim() !== "") {
            matches.push(info);
        }
    });

    if (matches.length < targetChars.length) return false;

    matches.sort((a, b) => a.left - b.left);

    for (let i = 0; i <= matches.length - targetChars.length; i++) {
        const slice = matches.slice(i, i + targetChars.length);
        let isSequence = true;

        for (let j = 0; j < slice.length; j++) {
            const currentChar = (slice[j].char || "").toLowerCase();
            if (currentChar !== targetChars[j]) {
                isSequence = false;
                break;
            }

            if (
                Math.abs(slice[j].top - slice[0].top) >
                LETTER_VERTICAL_TOLERANCE
            ) {
                isSequence = false;
                break;
            }

            if (j > 0) {
                const prev = slice[j - 1];
                const prevRight = prev.left + prev.width;
                let gap = slice[j].left - prevRight;
                if (gap < 0 && Math.abs(gap) <= OVERLAP_TOLERANCE) gap = 0;
                if (gap < 0 || gap > LETTER_HORIZONTAL_TOLERANCE) {
                    isSequence = false;
                    break;
                }
            }
        }

        if (isSequence) return true;
    }

    return false;
};

const checkSecretWords = () => {
    for (const word of SECRET_WORDS) {
        if (detectWord(word)) {
            triggerSecretWord(word);
            return true;
        }
    }
    return false;
};

const logLetterGroup = (group) => {
    const text = group.map((item) => item.char ?? "").join("");
    const compact = text.replace(/\s+/g, "");
    const positions = group.map((item) => ({
        char: item.char,
        left: Math.round(item.left),
        top: Math.round(item.top),
        width: Math.round(item.width),
    }));
    // eslint-disable-next-line no-console
    console.log("Magnet group:", compact || "(space)", positions);
    return compact.toLowerCase();
};

const collectSortedLetters = () => {
    const letters = calculateLetterPositions();
    letters.sort((a, b) => a.left - b.left);
    return letters;
};

const buildGroupAround = (letters, letterElement) => {
    const index = letters.findIndex((item) => item.element === letterElement);
    if (index === -1) return [];

    const anchor = letters[index];
    const sameRow = letters
        .filter(
            (letter) =>
                Math.abs(letter.top - anchor.top) <= LETTER_VERTICAL_TOLERANCE,
        )
        .sort((a, b) => a.left - b.left);

    const rowIndex = sameRow.findIndex((item) => item.element === letterElement);
    if (rowIndex === -1) return [anchor];

    const group = [sameRow[rowIndex]];

    let currentIndex = rowIndex;
    for (let i = rowIndex - 1; i >= 0; i--) {
        const candidate = sameRow[i];
        const reference = sameRow[currentIndex];
        const candidateRight = candidate.left + candidate.width;
        const referenceLeft = reference.left;
        let gap = referenceLeft - candidateRight;
        if (gap < 0 && Math.abs(gap) <= OVERLAP_TOLERANCE) gap = 0;
        if (gap < 0 || gap > LETTER_HORIZONTAL_TOLERANCE) break;
        group.unshift(candidate);
        currentIndex = i;
    }

    currentIndex = rowIndex;
    for (let i = rowIndex + 1; i < sameRow.length; i++) {
        const candidate = sameRow[i];
        const reference = sameRow[currentIndex];
        const referenceRight = reference.left + reference.width;
        let gap = candidate.left - referenceRight;
        if (gap < 0 && Math.abs(gap) <= OVERLAP_TOLERANCE) gap = 0;
        if (gap < 0 || gap > LETTER_HORIZONTAL_TOLERANCE) break;
        group.push(candidate);
        currentIndex = i;
    }

    return group;
};

const evaluateLetterDrop = (letterElement) => {
    if (!leadContainer || !letterElement) return;

    if (leadContainer.dataset?.hireModalShown === "true") {
        leadContainer.dataset.hireModalShown = "false";
    }

    const letters = collectSortedLetters();
    const group = buildGroupAround(letters, letterElement);

    if (!group.length) {
        checkSecretWords();
        return;
    }

    const normalized = logLetterGroup(group);
    const matchedWord = SECRET_WORDS.find((word) =>
        normalized.includes(word),
    );
    if (matchedWord) {
        triggerSecretWord(matchedWord);
        return;
    }
    checkSecretWords();
};

const startResetPolling = () => {
    if (resetFrame !== null) return;

    const poll = () => {
        resetFrame = null;
        if (!leadContainer || !leadContainer.classList.contains(ACTIVE_CLASS))
            return;
        checkSecretWords();
        resetFrame = window.requestAnimationFrame(poll);
    };
    resetFrame = window.requestAnimationFrame(poll);
};

const stopResetPolling = () => {
    if (resetFrame !== null) {
        window.cancelAnimationFrame(resetFrame);
        resetFrame = null;
    }
};

const stopResizeObserver = () => {
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
};

const initResizeObserver = () => {
    if (resizeObserver || !window.ResizeObserver) return;

    resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry || !leadContainer) return;

        const node = entry.target;
        const letters = Array.from(
            node.querySelectorAll(`.${LETTER_CLASS}`),
        );
        if (!letters.length) return;

        const containerRect = leadContainer.getBoundingClientRect();
        letters.forEach((letter) => {
            const rect = letter.getBoundingClientRect();
            const relativeLeft = rect.left - containerRect.left;
            const relativeTop = rect.top - containerRect.top;
            const translate = letter.style.transform.match(
                /translate3d\\((.+)\\)/,
            );
            let offsetX = 0;
            let offsetY = 0;
            if (translate && translate[1]) {
                const parts = translate[1]
                    .split(",")
                    .map((value) => parseFloat(value) || 0);
                offsetX = parts[0];
                offsetY = parts[1];
            }
            letter.style.left = `${relativeLeft}px`;
            letter.style.top = `${relativeTop}px`;
            letter.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
        });
    });

    resizeObserver.observe(leadContainer);
};

export const MagnetLetters = {
    activate() {
        if (originalMarkup !== null) return;

        leadContainer = document.getElementById("lead");
        if (!leadContainer) return;

        const rect = leadContainer.getBoundingClientRect();
        leadContainer.dataset.hireModalShown = "false";
        originalMarkup = snapshotLeadMarkup(leadContainer);
        leadContainer.classList.add(ACTIVE_CLASS);
        leadContainer.style.height = `${rect.height}px`;
        leadContainer.style.position = "relative";
        leadContainer.style.userSelect = "none";
        flattenInteractiveElements(leadContainer);
        buildLetters();
        activateLetters();
        startResetPolling();
        initResizeObserver();
    },

    deactivate: restoreMarkup,

    isActive() {
        return originalMarkup !== null;
    },
};
