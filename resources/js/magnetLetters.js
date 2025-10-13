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
const LETTER_HORIZONTAL_TOLERANCE = 15;
const LETTER_VERTICAL_TOLERANCE = 15;
const OVERLAP_TOLERANCE = 5;
const SECRET_WORDS = ["hire", "reset"];

const DRAG_STATE = new WeakMap();

const LETTER_STATE = new Map();
const SPATIAL_HASH = new Map();
const STATE_CELL_SIZE = 48;

const computeCellsForBounds = (x, y, width, height) => {
    const minX = Math.floor(x / STATE_CELL_SIZE);
    const minY = Math.floor(y / STATE_CELL_SIZE);
    const maxX = Math.floor((x + width) / STATE_CELL_SIZE);
    const maxY = Math.floor((y + height) / STATE_CELL_SIZE);
    const cells = [];

    for (let cx = minX; cx <= maxX; cx++) {
        for (let cy = minY; cy <= maxY; cy++) {
            cells.push(`${cx}:${cy}`);
        }
    }

    return cells;
};

const unindexLetterState = (state) => {
    if (!state || !state.cells) return;
    state.cells.forEach((key) => {
        const bucket = SPATIAL_HASH.get(key);
        if (!bucket) return;
        bucket.delete(state);
        if (!bucket.size) {
            SPATIAL_HASH.delete(key);
        }
    });
    state.cells = [];
};

const indexLetterState = (state) => {
    const rect = getStateRect(state);
    const cells = computeCellsForBounds(rect.x, rect.y, rect.width, rect.height);
    state.cells = cells;
    cells.forEach((key) => {
        let bucket = SPATIAL_HASH.get(key);
        if (!bucket) {
            bucket = new Set();
            SPATIAL_HASH.set(key, bucket);
        }
        bucket.add(state);
    });
};

const registerLetterState = ({
    element,
    baseX,
    baseY,
    width,
    height,
    collisionTopInset,
    collisionBottomInset,
    collisionLeftInset,
    collisionRightInset,
}) => {
    const state = {
        element,
        baseX,
        baseY,
        offsetX: 0,
        offsetY: 0,
        width,
        height,
        collisionTopInset,
        collisionBottomInset,
        collisionLeftInset,
        collisionRightInset,
        cells: [],
    };
    LETTER_STATE.set(element, state);
    indexLetterState(state);
};

const updateLetterStateBase = (element, baseX, baseY, offsetX, offsetY) => {
    const state = LETTER_STATE.get(element);
    if (!state) return;
    unindexLetterState(state);
    state.baseX = baseX;
    state.baseY = baseY;
    state.offsetX = offsetX;
    state.offsetY = offsetY;
    indexLetterState(state);
};

const updateLetterStateOffsets = (element, offsetX, offsetY) => {
    const state = LETTER_STATE.get(element);
    if (!state) return;
    unindexLetterState(state);
    state.offsetX = offsetX;
    state.offsetY = offsetY;
    indexLetterState(state);
};

const getLetterState = (element) => LETTER_STATE.get(element);

const resetLetterState = () => {
    LETTER_STATE.clear();
    SPATIAL_HASH.clear();
};

const containerBounds = {
    width: 0,
    height: 0,
};

const updateContainerBounds = () => {
    if (!leadContainer) {
        containerBounds.width = 0;
        containerBounds.height = 0;
        return;
    }
    containerBounds.width = leadContainer.clientWidth || 0;
    containerBounds.height = leadContainer.clientHeight || 0;
};

const CONTACT_EPSILON = 0.5;
const AXIS_OVERLAP_EPSILON = 0.5;
const MAX_PROPAGATED_PUSH = 1.2;

const getStateRect = (state) => {
    const left =
        state.baseX +
        state.offsetX +
        (state.collisionLeftInset ?? 0);
    const top =
        state.baseY +
        state.offsetY +
        (state.collisionTopInset ?? 0);
    const right =
        state.baseX +
        state.offsetX +
        state.width -
        (state.collisionRightInset ?? 0);
    const bottom =
        state.baseY +
        state.offsetY +
        state.height -
        (state.collisionBottomInset ?? 0);
    return {
        x: left,
        y: top,
        right,
        bottom,
        width: Math.max(0, right - left),
        height: Math.max(0, bottom - top),
    };
};

const gatherNearbyStates = (state) => {
    const rect = getStateRect(state);
    const padding = 0.5;
    const cells = computeCellsForBounds(
        rect.x - padding,
        rect.y - padding,
        rect.width + padding * 2,
        rect.height + padding * 2,
    );
    const candidates = new Set();
    cells.forEach((key) => {
        const bucket = SPATIAL_HASH.get(key);
        if (!bucket) return;
        bucket.forEach((candidate) => {
            if (candidate !== state) candidates.add(candidate);
        });
    });
    return Array.from(candidates);
};

const clampAxisOffset = (state, axis, offset) => {
    if (!leadContainer) return offset;
    const boundsSize = axis === "x" ? containerBounds.width : containerBounds.height;
    if (!boundsSize) return offset;

    const base = axis === "x" ? state.baseX : state.baseY;
    const size = axis === "x" ? state.width : state.height;
    const insetStart =
        axis === "x"
            ? state.collisionLeftInset ?? 0
            : state.collisionTopInset ?? 0;
    const insetEnd =
        axis === "x"
            ? state.collisionRightInset ?? 0
            : state.collisionBottomInset ?? 0;
    const minOffset = -(base + insetStart);
    const maxOffset = boundsSize - (base + size - insetEnd);
    if (maxOffset < minOffset) return minOffset;
    if (offset < minOffset) return minOffset;
    if (offset > maxOffset) return maxOffset;
    return offset;
};

const clampOffsetsForState = (state, offsetX, offsetY) => ({
    offsetX: clampAxisOffset(state, "x", offsetX),
    offsetY: clampAxisOffset(state, "y", offsetY),
});

const applyOffsetsToState = (state, offsetX, offsetY) => {
    const clamped = clampOffsetsForState(state, offsetX, offsetY);
    if (clamped.offsetX === state.offsetX && clamped.offsetY === state.offsetY) {
        return clamped;
    }
    state.element.style.transform = `translate3d(${clamped.offsetX}px, ${clamped.offsetY}px, 0)`;
    updateLetterStateOffsets(state.element, clamped.offsetX, clamped.offsetY);
    return clamped;
};

const applyAxisMove = (state, axis, delta) => {
    if (!delta) return;
    const newOffsetX =
        axis === "x" ? state.offsetX + delta : state.offsetX;
    const newOffsetY =
        axis === "y" ? state.offsetY + delta : state.offsetY;
    applyOffsetsToState(state, newOffsetX, newOffsetY);
};

const getAxisLimits = (state, axis) => {
    if (!leadContainer) {
        return { min: -Infinity, max: Infinity };
    }
    const boundsSize = axis === "x" ? containerBounds.width : containerBounds.height;
    if (!boundsSize) {
        return { min: -Infinity, max: Infinity };
    }
    const base = axis === "x" ? state.baseX : state.baseY;
    const size = axis === "x" ? state.width : state.height;
    const insetStart =
        axis === "x"
            ? state.collisionLeftInset ?? 0
            : state.collisionTopInset ?? 0;
    const insetEnd =
        axis === "x"
            ? state.collisionRightInset ?? 0
            : state.collisionBottomInset ?? 0;
    const min = -(base + insetStart);
    const max = boundsSize - (base + size - insetEnd);
    return { min, max };
};

const limitMoveByBounds = (state, axis, amount) => {
    const direction = Math.sign(amount);
    if (!direction) {
        return { move: 0, leftover: 0 };
    }
    const current = axis === "x" ? state.offsetX : state.offsetY;
    const { min, max } = getAxisLimits(state, axis);
    let target = current + amount;
    if (target < min) target = min;
    if (target > max) target = max;
    const move = target - current;
    return {
        move,
        leftover: amount - move,
    };
};

const findNearestNeighbor = (state, axis, direction) => {
    if (!direction) return null;
    const originRect = getStateRect(state);
    const candidates = gatherNearbyStates(state);
    let closest = null;
    let closestDistance = Infinity;

    candidates.forEach((candidate) => {
        const rect = getStateRect(candidate);
        if (axis === "x") {
            const verticalOverlap =
                Math.min(originRect.bottom, rect.bottom) -
                Math.max(originRect.y, rect.y);
            if (verticalOverlap <= AXIS_OVERLAP_EPSILON) return;
            const distance =
                direction > 0
                    ? rect.x - originRect.right
                    : originRect.x - rect.right;
            if (distance < -CONTACT_EPSILON) return;
            const adjustedDistance = Math.max(0, distance);
            if (adjustedDistance < closestDistance) {
                closest = candidate;
                closestDistance = adjustedDistance;
            }
        } else {
            const horizontalOverlap =
                Math.min(originRect.right, rect.right) -
                Math.max(originRect.x, rect.x);
            if (horizontalOverlap <= AXIS_OVERLAP_EPSILON) return;
            const distance =
                direction > 0
                    ? rect.y - originRect.bottom
                    : originRect.y - rect.bottom;
            if (distance < -CONTACT_EPSILON) return;
            const adjustedDistance = Math.max(0, distance);
            if (adjustedDistance < closestDistance) {
                closest = candidate;
                closestDistance = adjustedDistance;
            }
        }
    });

    if (!closest || closestDistance === Infinity) return null;
    return {
        state: closest,
        distance: Math.max(0, closestDistance),
    };
};

const moveStateRecursively = (state, axis, amount, visited = new Set()) => {
    const direction = Math.sign(amount);
    if (!direction) return { applied: 0, leftover: 0 };
    if (visited.has(state)) return { applied: 0, leftover: amount };

    visited.add(state);
    const { move: boundedMove, leftover: boundsLeftover } = limitMoveByBounds(
        state,
        axis,
        amount,
    );

    if (Math.abs(boundedMove) <= CONTACT_EPSILON) {
        visited.delete(state);
        return { applied: 0, leftover: amount };
    }

    const neighborInfo = findNearestNeighbor(state, axis, direction);
    if (!neighborInfo || neighborInfo.distance >= Math.abs(boundedMove)) {
        applyAxisMove(state, axis, boundedMove);
        visited.delete(state);
        return { applied: boundedMove, leftover: boundsLeftover };
    }

    const distanceToNeighbor = Math.max(0, neighborInfo.distance);
    let appliedMove = 0;
    if (distanceToNeighbor > 0) {
        const advance = direction * Math.min(Math.abs(boundedMove), distanceToNeighbor);
        applyAxisMove(state, axis, advance);
        appliedMove += advance;
    }

    const remaining = boundedMove - appliedMove;
    const neighborResult = moveStateRecursively(
        neighborInfo.state,
        axis,
        remaining,
        visited,
    );

    const neighborApplied = remaining - neighborResult.leftover;
    if (Math.abs(neighborApplied) > CONTACT_EPSILON) {
        applyAxisMove(state, axis, neighborApplied);
        appliedMove += neighborApplied;
    }

    visited.delete(state);
    return {
        applied: appliedMove,
        leftover: boundsLeftover + neighborResult.leftover,
    };
};

const moveStateAlongAxis = (state, delta, axis) => {
    if (!delta) return;
    moveStateRecursively(state, axis, delta, new Set());
};

const resolveOverlapPair = (firstState, secondState) => {
    const firstRect = getStateRect(firstState);
    const secondRect = getStateRect(secondState);
    const overlapWidth =
        Math.min(firstRect.right, secondRect.right) -
        Math.max(firstRect.x, secondRect.x);
    const overlapHeight =
        Math.min(firstRect.bottom, secondRect.bottom) -
        Math.max(firstRect.y, secondRect.y);
    if (overlapWidth <= 0 || overlapHeight <= 0) return false;

    if (overlapWidth < overlapHeight) {
        const direction = firstRect.x < secondRect.x ? -1 : 1;
        moveStateAlongAxis(firstState, direction * overlapWidth, "x");
        moveStateAlongAxis(secondState, -direction * overlapWidth, "x");
    } else {
        const direction = firstRect.y < secondRect.y ? -1 : 1;
        moveStateAlongAxis(firstState, direction * overlapHeight, "y");
        moveStateAlongAxis(secondState, -direction * overlapHeight, "y");
    }
    return true;
};

const resolveAllOverlaps = () => {
    const states = Array.from(LETTER_STATE.values());
    let iterations = 0;
    let anyResolved = false;

    do {
        anyResolved = false;
        iterations += 1;
        for (let i = 0; i < states.length; i++) {
            const a = states[i];
            if (!a) continue;
            const rectA = getStateRect(a);
            for (let j = i + 1; j < states.length; j++) {
                const b = states[j];
                if (!b) continue;
                const rectB = getStateRect(b);
                const overlapWidth =
                    Math.min(rectA.right, rectB.right) -
                    Math.max(rectA.x, rectB.x);
                const overlapHeight =
                    Math.min(rectA.bottom, rectB.bottom) -
                    Math.max(rectA.y, rectB.y);
                if (overlapWidth <= 0 || overlapHeight <= 0) continue;
                const resolved = resolveOverlapPair(a, b);
                if (resolved) anyResolved = true;
            }
        }
    } while (anyResolved && iterations < 4);
};

let originalMarkup = null;
let leadContainer = null;
let pointerMoveListener = null;
let pointerUpListener = null;
let animationFrame = null;
let resizeObserver = null;
let lastPointerEvent = null;
let activeLetter = null;

const DEBUG_MAGNET = false;
const debugLog = (...args) => {
    if (!DEBUG_MAGNET) return;
    // eslint-disable-next-line no-console
    console.log("[Magnet]", ...args);
};
const debugCount = (label) => {
    if (!DEBUG_MAGNET) return;
    // eslint-disable-next-line no-console
    console.count(`[Magnet] ${label}`);
};
const debugTimeEnd = (label, start) => {
    if (!DEBUG_MAGNET) return;
    // eslint-disable-next-line no-console
    console.log("[Magnet]", `${label} ${Math.round((performance.now() - start) * 1000) / 1000}ms`);
};

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

    const relativeLeft = rect.left - containerRect.left;
    const relativeTop = rect.top - containerRect.top;

    span.style.position = "absolute";
    span.style.left = `${relativeLeft}px`;
    span.style.top = `${relativeTop}px`;
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

    const fontSizeValue = parseFloat(computedStyle.fontSize) || rect.height;
    const collisionHeight = Math.min(rect.height, fontSizeValue);
    const verticalInset = Math.max(
        0,
        Math.min(rect.height, (rect.height - collisionHeight) / 2),
    );

    return {
        element: span,
        baseX: relativeLeft,
        baseY: relativeTop,
        width: rect.width,
        height: rect.height,
        collisionTopInset: verticalInset,
        collisionBottomInset: verticalInset,
        collisionLeftInset: 0,
        collisionRightInset: 0,
    };
};

const letterizeNode = (node, containerRect, fragments, computedStyle) => {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? "";
        const range = document.createRange();

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === " " || char === "\u00A0") {
                continue;
            }
            if (char.trim() === "") {
                continue;
            }

            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const rects = range.getClientRects();
            if (!rects.length) continue;

            const rect = rects[0];
            const descriptor = createLetterSpan(
                char,
                rect,
                containerRect,
                computedStyle,
            );
            fragments.push(descriptor);
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

    resetLetterState();

    Array.from(leadContainer.childNodes).forEach((child) =>
        letterizeNode(child, containerRect, fragments, computedStyle),
    );

    leadContainer.innerHTML = "";
    fragments.forEach(({ element }) => leadContainer.appendChild(element));
    fragments.forEach((descriptor) => registerLetterState(descriptor));
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

        debugCount("pointer-move-frame");

        const state = DRAG_STATE.get(activeLetter);
        if (!state) return;

        if (
            state.pointerId !== undefined &&
            state.pointerId !== null &&
            event.pointerId !== undefined &&
            state.pointerId !== event.pointerId
        ) {
            return;
        }

        const pointerX =
            lastPointerEvent.clientX ?? lastPointerEvent.touches?.[0]?.clientX ?? 0;
        const pointerY =
            lastPointerEvent.clientY ?? lastPointerEvent.touches?.[0]?.clientY ?? 0;

        const deltaX = pointerX - state.startX;
        const deltaY = pointerY - state.startY;
        const targetOffsetX = state.initialX + deltaX;
        const targetOffsetY = state.initialY + deltaY;

        const letterState = getLetterState(activeLetter);
        if (!letterState) {
            activeLetter.style.transform = `translate3d(${targetOffsetX}px, ${targetOffsetY}px, 0)`;
            updateLetterStateOffsets(activeLetter, targetOffsetX, targetOffsetY);
            return;
        }

        const moveX = targetOffsetX - letterState.offsetX;
        const moveY = targetOffsetY - letterState.offsetY;

        moveStateAlongAxis(letterState, moveX, "x");
        moveStateAlongAxis(letterState, moveY, "y");
        resolveAllOverlaps();
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

    if (event.pointerType === "touch") {
        event.preventDefault();
    }

    target.style.cursor = "grabbing";
    target.style.zIndex = "10";
};

const activateLetters = () => {
    const letters = leadContainer.querySelectorAll(`.${LETTER_CLASS}`);
    letters.forEach((letter) => {
        letter.addEventListener("pointerdown", onPointerDown, { passive: false });
        letter.addEventListener("pointerup", endDrag, { passive: true });
        letter.addEventListener("pointercancel", endDrag, { passive: true });
    });

    pointerMoveListener = onPointerMove;
    pointerUpListener = endDrag;

    window.addEventListener("pointermove", pointerMoveListener, { passive: false });
    window.addEventListener("pointerup", pointerUpListener, { passive: true });
    window.addEventListener("pointercancel", pointerUpListener, { passive: true });
};

const deactivateLetters = () => {
    window.removeEventListener("pointermove", pointerMoveListener ?? (() => {}));
    window.removeEventListener("pointerup", pointerUpListener ?? (() => {}));
    window.removeEventListener("pointercancel", pointerUpListener ?? (() => {}));

    pointerMoveListener = null;
    pointerUpListener = null;
    activeLetter = null;
};

const restoreMarkup = () => {
    if (!leadContainer || originalMarkup === null) return;

    deactivateLetters();
    resetLetterState();
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
    leadContainer = null;
    updateContainerBounds();
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
    const start = DEBUG_MAGNET ? performance.now() : 0;
    const positions = Array.from(
        leadContainer.querySelectorAll(`.${LETTER_CLASS}`),
    ).map(
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
    if (DEBUG_MAGNET) {
        debugTimeEnd("calculateLetterPositions", start);
        debugLog("letters measured", positions.length);
    }
    return positions;
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
    console.log("Magnet groups:", compact || "(space)", positions);
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

const stopResizeObserver = () => {
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
};

const initResizeObserver = () => {
    if (resizeObserver || !window.ResizeObserver) return;

    resizeObserver = new ResizeObserver((entries) => {
        const resizeStart = DEBUG_MAGNET ? performance.now() : 0;
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
            const { x: offsetX, y: offsetY } = parseTranslate(letter);
            letter.style.left = `${relativeLeft}px`;
            letter.style.top = `${relativeTop}px`;
            letter.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
            updateLetterStateBase(letter, relativeLeft, relativeTop, offsetX, offsetY);
        });
        if (DEBUG_MAGNET) {
            debugTimeEnd("resize-observer", resizeStart);
            debugLog("resize letters adjusted", letters.length);
        }
        updateContainerBounds();
        resolveAllOverlaps();
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
        updateContainerBounds();
        flattenInteractiveElements(leadContainer);
        buildLetters();
        updateContainerBounds();
        resolveAllOverlaps();
        activateLetters();
        initResizeObserver();
        checkSecretWords();
    },

    deactivate: restoreMarkup,

    isActive() {
        return originalMarkup !== null;
    },
};
