export class HintElement extends HTMLElement {
    #time = new Date();
    #level = 0;
    #hintCount = 0;
    #hintInterval = null;
    #held = false;
    #scoring = false;
    #animating = false;
    #rngX = null;
    #rngY = null;
    #targetPosition = null;
    #emoji = document.createElement("div");
    #disableRotateEmoji = false;
    #levelTwoAnimationTimeout = null;
    #glimmerHintTimeout = null;
    #treasureElement = null;
    #gemOverlay = null;
    #gemStates = [];
    #gemAnimationFrame = null;
    #lastGemFrameTime = null;
    #gemGravity = 1800; // pixels per second squared

    constructor() {
        super();
        this.dataset.content;
    }

    connectedCallback() {
        this.innerText = this.dataset.content;
        this.#treasureElement = document.querySelector("treasure-element");
        if (!this.#treasureElement) {
            return;
        }
        this.loadEventListeners();
        this.#glimmerHintTimeout = setTimeout(() => {
            this.glimmerHint();
        }, 500);
    }

    loadEventListeners = () => {
        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mouseup", this.handleMouseUp);
        this.addEventListener("touchcancel", this.handleMouseUp);
        this.addEventListener("dragstart", this.handleDragStart);
        this.addEventListener("touchstart", this.handleDragStart, {passive: true});
        this.addEventListener("dragend", this.handleDragEnd);
        this.addEventListener("touchend", this.handleDragEnd, {passive: true});
        this.addEventListener("drag", this.handleDrag);
        this.addEventListener("touchmove", this.handleDrag, {passive: true});

        this.#treasureElement?.addEventListener("dragenter", this.handleDragEnter);
        this.#treasureElement?.addEventListener("dragleave", this.handleDragLeave);
    };

    removeEventListeners = () => {
        clearInterval(this.#hintInterval);
        this.removeEventListener("mousedown", this.handleMouseDown);
        this.removeEventListener("mouseup", this.handleMouseUp);
        this.removeEventListener("dragstart", this.handleDragStart);
        this.removeEventListener("dragend", this.handleDragEnd);
        this.removeEventListener("drag", this.handleDrag);

        this.removeEventListener("touchstart", this.handleDragStart);
        this.removeEventListener("touchend", this.handleDragEnd);
        this.removeEventListener("touchmove", this.handleDrag);

        this.#treasureElement?.removeEventListener("dragenter", this.handleDragEnter);
        this.#treasureElement?.removeEventListener("dragleave", this.handleDragLeave);
    };

    handleMouseDown = (e) => {
        let target = e.target;
        target.setAttribute("draggable", true);
        target.classList.add("shadow-outer", "text-gruvbox-gray");
    };

    handleMouseUp = (e) => {
        const target = e.target;
        target.classList.remove(
            "text-gruvbox-gray",
            "shadow-outer",
            "cursor-grabbing",
        );
        target.classList.add("cursor-pointer");
        target.setAttribute("draggable", false);
    };

    handleDragEnter = () => {
        if (this.#level < 2) this.#disableRotateEmoji = true;
        this.#emoji.style.transform = "none";
        this.#emoji.innerHTML = "🔒";
    };

    handleDragLeave = () => {
        this.#disableRotateEmoji = false;
        this.#emoji.innerHTML = "🧭";
    };

    handleDragStart = (e) => {
        const target = e.target;
        const mainHeader = document.getElementById("main_header");
        const footer = document.getElementById("footer");
        const body = document.querySelector("body");
        const mainHeaderHeight = mainHeader ? mainHeader.offsetHeight : 0;
        const footerHeight = footer ? footer.offsetHeight : 0;
        const padding = 15;
        const maxHeight = window.innerHeight - footerHeight - padding;
        const minHeight = mainHeaderHeight + padding;

        clearInterval(this.#hintInterval);
        target.textContent = "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";

        this.#rngX =
            Math.random() * (window.innerWidth - padding - padding) + padding;
        this.#rngY = Math.random() * (maxHeight - minHeight) + minHeight;

        this.levelUp();

        this.#emoji.innerHTML = "🧭";
        this.#emoji.classList.add("absolute", "z-50", "text-5xl");
        this.#emoji.id = "emoji";
        body.appendChild(this.#emoji);

        target.classList.remove("cursor-pointer", "shadow-outer");
        target.classList.add("cursor-grabbing");
    };

    handleDrag = (e) => {
        const target = e.target;
        const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
        const clientY = e.clientY !== undefined ? e.clientY :  e.touches[0].clientY;
        const emojiOffset = clientX == 0 && clientY == 0 ? 200 : 45;

        this.#emoji.style.left = `${clientX - emojiOffset}px`;
        this.#emoji.style.top = `${clientY - emojiOffset}px`;

        if (clientX == 0 && clientY == 0) {
            return;
        }

        let distanceToTreasure = this.rotateKeyAndReturnDistanceToTarget(
            clientX,
            clientY,
        );

        if (this.isInTarget(clientX, clientY)) {
            this.#emoji.style.transform = "none";
            target.classList.remove("cursor-grabbing");
            target.classList.add("cursor-progress");

            if (this.#held === null) {
                this.#held = new Date();
                this.#held = this.#held.setSeconds(
                    this.#held.getSeconds() + 2.0,
                );
            } else if (this.#held < new Date().getTime()) {
                target.classList.remove("cursor-progress");
                this.levelUp();
                if (this.#level == 2) {
                    target.classList.add("cursor-pointer");
                    this.animateLevelTwo();
                } else {
                    this.animateLevelThree();
                }
            } else {
                this.#level == 1
                    ? (this.#emoji.innerHTML = "⏳")
                    : (this.#emoji.innerHTML = "🔐");
            }
        } else {
            this.#held = null;
            if (!this.#animating)
                this.#emoji.innerHTML = this.#level == 1 ? "🧭" : "🔑";
            target.classList.remove("text-gruvbox-yellow", "cursor-progress");
            target.classList.add("text-gruvbox-gray", "cursor-grabbing");
        }

        if (this.inRangeOfTreasureHintAndOfLevel(distanceToTreasure)) {
            window.dispatchEvent(
                new CustomEvent("treasureHint", {
                    detail: { distanceToTreasure: distanceToTreasure },
                }),
            );
        }

    };

    handleDragEnd = (e) => {
        clearTimeout(this.#glimmerHintTimeout);
        this.#glimmerHintTimeout = setTimeout(() => {
            this.glimmerHint();
        }, 10000);

        const target = e.target;
        const body = document.querySelector("body");
        if (document.getElementById('emoji'))
        body.removeChild(document.getElementById('emoji'));

        this.#level = 0;

        target.textContent = this.dataset.content;
        target.classList.remove(
            "text-gruvbox-gray",
            "shadow-outer",
            "cursor-grabbing",
        );
        target.classList.add("cursor-pointer");
        target.setAttribute("draggable", false);
    };

    glimmerHint = () => {
        const content = this.dataset.content;
        const duration = 300 / this.dataset.content.split("").length;

        this.innerHTML = "";
        this.classList.remove("cursor-pointer");
        this.classList.add("select-none");
        this.removeAttribute("draggable");
        this.removeEventListener("mousedown", this.handleMouseDown);
        clearInterval(this.#hintInterval);

        content.split("").forEach((letter, index) => {
            const offset = index * duration;
            let span = document.createElement("span");
            span.innerText = letter;
            this.appendChild(span);

            setTimeout(() => {
                if (index > 0 && index < content.length) {
                    this.childNodes[index - 1].classList.remove(
                        "text-gruvbox-white",
                    );
                }
                span.classList.add("text-gruvbox-white");
            }, offset);
        });

        setTimeout(() => {
            this.innerText = this.dataset.content;
            this.classList.remove("select-none");
            this.classList.add("cursor-pointer");
            this.setAttribute("draggable", true);
            this.addEventListener("mousedown", this.handleMouseDown);
        }, 300);

        this.#hintInterval = setInterval(this.glimmerHint, 10000);
        this.#hintCount++;
    };

    rotateKeyAndReturnDistanceToTarget = (mouseX, mouseY) => {
        if (!this.#targetPosition) return;
        const deltaX =
            this.#targetPosition.x + this.#targetPosition.width / 2 - mouseX;
        const deltaY =
            this.#targetPosition.y + this.#targetPosition.height / 2 - mouseY;

        let distanceToTreasure = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        let theta = Math.atan2(deltaY, deltaX);
        let angle = (theta / Math.PI) * 180 + (theta > 0 ? 0 : 360);

        // adjusting the initial rotation of the emojis
        let rotate = 0;
        if (!this.#disableRotateEmoji) {
            if (this.#level == 1 && this.#held === null) {
                rotate = angle + 45;
            } else if (this.#level == 2 && this.#held === null) {
                rotate = angle + 225;
            }

            this.#emoji.style.transform = `rotate(${rotate}deg)`;
        }

        return distanceToTreasure;
    };

    isInTarget = (mouseX, mouseY) => {
        if (!this.#targetPosition) return;
        return (
            mouseX > this.#targetPosition.x &&
            mouseX < this.#targetPosition.x + this.#targetPosition.width &&
            mouseY > this.#targetPosition.y &&
            mouseY < this.#targetPosition.y + this.#targetPosition.height
        );
    };

    animateLevelTwoTryAgain = () => {
        const animation = Animation();

    };
    animateLevelTwo = () => {
        this.#held = null;
        this.#animating = true;
        const animationSteps = [
            { fontSize: "5xl", emoji: "⌛", timeout: 300 },
            { fontSize: "xl", emoji: "✨", timeout: 400 },
            { fontSize: "2xl", emoji: "✨", timeout: 400 },
            { fontSize: "3xl", emoji: "✨", timeout: 400 },
            { fontSize: "5xl", emoji: "✨", timeout: 400 },
            { fontSize: "5xl", emoji: "🔑", timeout: 200 },
        ];

        animationSteps.forEach((step, index) => {
            setTimeout(() => {
                this.#emoji.classList.remove(`text-${animationSteps[index - 1]?.fontSize}`);
                this.#emoji.classList.add(`text-${step.fontSize}`);
                this.#emoji.innerHTML = step.emoji;
            }, index === 0 ? 0 : animationSteps[index - 1].timeout);
        });
    };

    animateLevelThree = () => {
        this.#animating = true;
        this.#emoji.innerHTML = "🔓";
        setTimeout(() => {
            this.#emoji.innerHTML = "🎉";
            this.#animating = false;
            this.analyticsTreasure({
                hintCount: this.#hintCount,
                time: (new Date() - this.#time) / 1000,
            });
        }, 300);

    };

    levelUp = () => {
        ++this.#level;
        if (this.#level === 1) {
            this.#targetPosition = { x: this.#rngX, y: this.#rngY, width: 20, height: 20 };
        } else if (this.#treasureElement) {
            this.#targetPosition = this.#treasureElement.getBoundingClientRect();
        } else {
            this.#targetPosition = null;
        }
    };

    inRangeOfTreasureHintAndOfLevel = (distanceToTreasure) => {
        return distanceToTreasure <= 400 && this.#level == 2;
    };

    analyticsTreasure = (detail) => {
        this.#animating = false;
        if (!this.#scoring) {
            this.#scoring = true;
            this.removeEventListeners();
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const checkUrl = new URL('/puzzle/1/check', window.location.origin);

            fetch(checkUrl.toString(), {
                credentials: "same-origin",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Puzzle check failed (${response.status})`);
                    }

                    return response.json();
                })
                .then((json) => {
                    if (json.error && json.error === "session expired") {
                        window.location.reload();
                        return;
                    }

                    const solvedUrl = new URL(`/puzzle/1/solved/${json.token}`, window.location.origin);

                    return fetch(solvedUrl.toString(), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": csrfToken ?? "",
                        },
                        credentials: "same-origin",
                        body: JSON.stringify(detail),
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Puzzle solve failed (${response.status})`);
                            }

                            return response.json();
                        })
                        .then((json) => {
                            if (json.error) {
                                this.reset();
                                console.error(json.error);
                                return;
                            }

                            this.reset();
                            this.renderCelebration(json);
                        });
                })
                .catch((error) => {
                    console.error(error);
                    this.reset();
                });
        }
    };

    renderCelebration = (result) => {
        const lead = document.getElementById("lead");
        if (!lead) {
            return;
        }

        this.populateGems(result?.score ?? 0);

        lead.innerHTML = "";

        const leaderboard = document.createElement("div");
        leaderboard.id = "puzzle-leaderboard";
        lead.appendChild(leaderboard);
        this.buildLeaderboard(leaderboard, result);
    };

    populateGems = (score) => {
        const content = document.getElementById("content");
        const lead = document.getElementById("lead");
        if (!content || !lead) return;

        this.stopGemAnimation();
        this.#gemStates = [];

        let gemOverlay = document.getElementById("puzzle-gem-overlay");
        if (!gemOverlay) {
            gemOverlay = document.createElement("div");
            gemOverlay.id = "puzzle-gem-overlay";
            content.appendChild(gemOverlay);
        }

        gemOverlay.innerHTML = "";

        const leadRect = lead.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const overlayTop = leadRect.top - contentRect.top;
        gemOverlay.style.top = `${overlayTop}px`;
        gemOverlay.style.height = `${leadRect.height}px`;

        const usedPositions = [];
        const fragment = document.createDocumentFragment();
        const now = (typeof performance !== "undefined" ? performance.now() : Date.now());

        for (let i = 0; i < score; i++) {
            const gem = document.createElement("span");
            gem.classList.add("puzzle-gem");
            gem.textContent = "💎";

            const sizeRem = 1.3 + Math.random() * 1.2;
            gem.style.fontSize = `${sizeRem}rem`;

            const gemPx = sizeRem * 16;
            const maxLeft = Math.max(leadRect.width - gemPx, 0);
            let left = 0;
            let attempts = 0;
            const minGap = gemPx + 12;

            do {
                left = maxLeft > 0 ? Math.random() * maxLeft : 0;
                attempts++;
            } while (
                attempts < 25 &&
                usedPositions.some((position) => Math.abs(position - left) < minGap)
            );

            usedPositions.push(left);

            const settleTop = Math.max(leadRect.height - gemPx - 12, 0);
            const startY = -(Math.random() * leadRect.height * 0.6 + gemPx);

            gem.style.left = `${left}px`;
            gem.style.transform = `translate(${left}px, ${startY}px)`;
            gem.style.opacity = "1";

            fragment.appendChild(gem);

            this.#gemStates.push({
                element: gem,
                x: left,
                y: startY,
                vy: 0,
                settleY: settleTop,
                startAt: now + Math.random() * 800,
                done: false,
                removed: false,
            });
        }

        gemOverlay.appendChild(fragment);

        this.#gemOverlay = gemOverlay;
        this.startGemAnimation();
    };

    startGemAnimation = () => {
        if (this.#gemAnimationFrame) {
            cancelAnimationFrame(this.#gemAnimationFrame);
        }

        const step = (time) => {
            if (!this.#gemStates.length) {
                this.stopGemAnimation();
                return;
            }

            if (this.#lastGemFrameTime === null) {
                this.#lastGemFrameTime = time;
            }

            const delta = Math.min((time - this.#lastGemFrameTime) / 1000, 0.05);
            this.#lastGemFrameTime = time;

            let anyActive = false;

            this.#gemStates.forEach((state) => {
                if (state.removed || state.done) {
                    return;
                }

                if (time < state.startAt) {
                    anyActive = true;
                    return;
                }

                state.vy += this.#gemGravity * delta;
                state.y += state.vy * delta;

                if (state.y >= state.settleY) {
                    state.y = state.settleY;
                    state.done = true;
                    state.element.style.opacity = "0";
                    setTimeout(() => {
                        state.element.remove();
                        state.removed = true;
                    }, 250);
                } else {
                    state.element.style.transform = `translate(${state.x}px, ${state.y}px)`;
                    anyActive = true;
                }
            });

            this.#gemStates = this.#gemStates.filter((state) => !state.removed);

            if (anyActive) {
                this.#gemAnimationFrame = requestAnimationFrame(step);
            } else {
                this.stopGemAnimation();
            }
        };

        this.#lastGemFrameTime = null;
        this.#gemAnimationFrame = requestAnimationFrame(step);
    };

    stopGemAnimation = () => {
        if (this.#gemAnimationFrame) {
            cancelAnimationFrame(this.#gemAnimationFrame);
            this.#gemAnimationFrame = null;
        }

        this.#lastGemFrameTime = null;
        this.#gemStates = [];
    };

    buildLeaderboard = (container, result) => {
        if (!container) {
            return;
        }

        container.classList.add("puzzle-leaderboard");

        const summary = document.createElement("div");
        summary.classList.add("puzzle-leaderboard-summary");

        const scoreLabel = document.createElement("div");
        scoreLabel.classList.add("puzzle-leaderboard-score");
        scoreLabel.textContent = `Score: ${result?.score ?? 0}`;

        const rankLabel = document.createElement("div");
        rankLabel.classList.add("puzzle-leaderboard-rank");
        if (result?.rank) {
            rankLabel.textContent = `Current Rank: #${result.rank}`;
        } else if (result?.totalPlayers) {
            rankLabel.textContent = `Current Rank: #${result.totalPlayers}`;
        } else {
            rankLabel.textContent = "Current Rank: #1";
        }

        const population = document.createElement("div");
        population.classList.add("puzzle-leaderboard-population");
        if (result?.totalPlayers) {
            population.textContent = `Across ${result.totalPlayers} solve${result.totalPlayers === 1 ? "" : "s"}.`;
        } else {
            population.textContent = "You set the first score!";
        }

        summary.appendChild(scoreLabel);
        summary.appendChild(rankLabel);
        summary.appendChild(population);
        container.appendChild(summary);

        if (!Array.isArray(result?.leaderboard) || result.leaderboard.length === 0) {
            const empty = document.createElement("p");
            empty.classList.add("puzzle-leaderboard-empty");
            empty.textContent = "No leaderboard data yet. Keep exploring!";
            container.appendChild(empty);
            return;
        }

        const list = document.createElement("ol");
        list.classList.add("puzzle-leaderboard-list");

        result.leaderboard.forEach((entry) => {
            const item = document.createElement("li");
            item.classList.add("puzzle-leaderboard-item");
            if (entry?.is_current) {
                item.classList.add("puzzle-leaderboard-current");
            }

            const left = document.createElement("span");
            left.classList.add("puzzle-leaderboard-item-rank");
            left.textContent = `#${entry.rank} • ${entry.score}`;

            const right = document.createElement("span");
            right.classList.add("puzzle-leaderboard-item-meta");
            const hints = entry.hint_count ?? 0;
            const time = typeof entry.time === "number" ? entry.time.toFixed(1) : entry.time;
            right.textContent = `${hints} hint${hints === 1 ? "" : "s"}, ${time ?? "0.0"}s`;

            item.appendChild(left);
            item.appendChild(right);
            list.appendChild(item);
        });

        container.appendChild(list);
    };

    reset = () => {
        this.#time = new Date();
        this.#level = 0;
        this.#hintCount = 0;
        this.#hintInterval = null;
        this.#held = false;
        this.#rngX = null;
        this.#rngY = null;
        this.#targetPosition = null;
        this.#emoji = document.createElement("div");
        this.#disableRotateEmoji = false;
        this.#levelTwoAnimationTimeout = null;
        const body = document.querySelector("body");

        if (document.getElementById("emoji"))
            body.removeChild(document.getElementById("emoji"));

        if (this.#gemOverlay) {
            this.#gemOverlay.remove();
            this.#gemOverlay = null;
        }

        this.stopGemAnimation();

        this.loadEventListeners();
        return;
    };
}

customElements.define("hint-element", HintElement);
