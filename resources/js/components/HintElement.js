const getTreasureElement = () => {
    if (typeof document === "undefined") return null;
    const elements = document.getElementsByTagName("treasure-element");
    return elements && elements.length ? elements[0] : null;
};

const LEVEL_ONE_TARGET_SIZE = 140;
let INITIAL_LEAD_HTML = null;
let INITIAL_TITLE_HTML = null;

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
    #restorationTimeout = null;

    constructor() {
        super();
        this.dataset.content;
    }

    connectedCallback() {
        this.innerText = this.dataset.content;
        this.loadEventListeners();
        this.#glimmerHintTimeout = setTimeout(() => {
            this.glimmerHint();
        }, 500);

        if (INITIAL_LEAD_HTML === null) {
            const lead = document.getElementById("lead");
            if (lead) INITIAL_LEAD_HTML = lead.innerHTML;
        }

        if (INITIAL_TITLE_HTML === null) {
            const title = document.querySelector("#title");
            if (title) INITIAL_TITLE_HTML = title.innerHTML;
        }
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

        const treasure = getTreasureElement();
        if (treasure) {
            treasure.addEventListener("dragenter", this.handleDragEnter);
            treasure.addEventListener("dragleave", this.handleDragLeave);
        }
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

        const treasure = getTreasureElement();
        if (treasure) {
            treasure.removeEventListener("dragenter", this.handleDragEnter);
            treasure.removeEventListener("dragleave", this.handleDragLeave);
        }
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
        this.#emoji.innerHTML = this.#level >= 2 ? "🔑" : "🧭";
    };

    handleDragStart = (e) => {
        const target = e.target;
        const mainHeader = document.getElementById("main_header");
        const footer = document.getElementById("footer");
        const body = document.querySelector("body");
        const mainHeaderHeight = mainHeader.offsetHeight;
        const footerHeight = footer.offsetHeight;
        const padding = 15;
        const maxHeight = window.innerHeight - footerHeight - padding;
        const minHeight = mainHeaderHeight + padding;

        clearInterval(this.#hintInterval);
        target.textContent = "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";

        const availableWidth =
            Math.max(window.innerWidth - padding * 2 - LEVEL_ONE_TARGET_SIZE, 0);
        const availableHeight =
            Math.max(maxHeight - minHeight - LEVEL_ONE_TARGET_SIZE, 0);

        this.#rngX =
            padding + (availableWidth > 0 ? Math.random() * availableWidth : 0);
        this.#rngY =
            minHeight + (availableHeight > 0 ? Math.random() * availableHeight : 0);

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

        this.updateProximityFeedback(distanceToTreasure);

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

        this.updateProximityFeedback();
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
        if (!this.#targetPosition) return null;
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
        if (!this.#targetPosition) return false;
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

        let accumulatedDelay = 0;
        animationSteps.forEach((step, index) => {
            const delay = index === 0 ? 0 : animationSteps[index - 1].timeout;
            accumulatedDelay += delay;
            setTimeout(() => {
                this.#emoji.classList.remove(`text-${animationSteps[index - 1]?.fontSize}`);
                this.#emoji.classList.add(`text-${step.fontSize}`);
                this.#emoji.innerHTML = step.emoji;
            }, accumulatedDelay);
        });

        const totalDuration = animationSteps.reduce((total, step) => total + step.timeout, 0);
        setTimeout(() => {
            this.#animating = false;
        }, totalDuration);
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
        this.#level += 1;

        if (this.#level === 1) {
            this.#targetPosition = {
                x: this.#rngX,
                y: this.#rngY,
                width: LEVEL_ONE_TARGET_SIZE,
                height: LEVEL_ONE_TARGET_SIZE,
            };
            this.updateProximityFeedback();
        } else {
            const treasureElement = getTreasureElement();
            this.#targetPosition = treasureElement
                ? treasureElement.getBoundingClientRect()
                : null;
            this.updateProximityFeedback();
        }
    };

    inRangeOfTreasureHintAndOfLevel = (distanceToTreasure) => {
        return distanceToTreasure <= 400 && this.#level == 2;
    };

    updateProximityFeedback = (distance) => {
        if (this.#level !== 1 || typeof distance !== "number") {
            this.style.color = "";
            this.removeAttribute("data-hint-status");
            return;
        }

        if (distance <= 60) {
            this.style.color = "#b8bb26";
            this.setAttribute("data-hint-status", "hot");
        } else if (distance <= 140) {
            this.style.color = "#fabd2f";
            this.setAttribute("data-hint-status", "warm");
        } else {
            this.style.color = "#83a598";
            this.setAttribute("data-hint-status", "cool");
        }
    };

    showCelebration = (result, leaderboardData = null) => {
        this.removeEventListeners();
        this.reset(false);

        if (this.#restorationTimeout) {
            clearTimeout(this.#restorationTimeout);
            this.#restorationTimeout = null;
        }

        const lead = document.getElementById("lead");
        const title = document.querySelector("#title");

        if (!lead || !title) {
            return;
        }

        if (INITIAL_TITLE_HTML !== null) {
            title.innerHTML = INITIAL_TITLE_HTML;
        }

        const rawScore = Number(result?.score);
        const score = Number.isFinite(rawScore) ? rawScore : 0;
        const hintCountValue = Number(result?.hintCount);
        const hintCount = Number.isFinite(hintCountValue) ? hintCountValue : null;
        const solveTimeValue = Number(result?.time);
        const solveTime = Number.isFinite(solveTimeValue) ? solveTimeValue : null;

        lead.innerHTML = "";
        lead.style.display = "flex";
        lead.style.flexDirection = "column";
        lead.style.minHeight = "60vh";

        const layout = document.createElement("div");
        layout.classList.add("flex", "flex-col", "gap-6");
        layout.style.flexGrow = "1";
        layout.style.width = "100%";

        const summarySection = document.createElement("section");
        summarySection.classList.add("space-y-2");

        const heading = document.createElement("h2");
        heading.classList.add("text-4xl", "font-semibold", "text-gruvbox-white");
        heading.textContent = "Treasure Found!";
        summarySection.appendChild(heading);

        const scoreLine = document.createElement("p");
        scoreLine.classList.add("text-2xl", "text-gruvbox-yellow");
        scoreLine.textContent = `Score: ${score.toLocaleString()}`;
        summarySection.appendChild(scoreLine);

        if (hintCount !== null) {
            const hintLine = document.createElement("p");
            hintLine.classList.add("text-base", "text-gruvbox-gray");
            hintLine.textContent = `Hints used: ${hintCount}`;
            summarySection.appendChild(hintLine);
        }

        if (solveTime !== null) {
            const timeLine = document.createElement("p");
            timeLine.classList.add("text-base", "text-gruvbox-gray");
            timeLine.textContent = `Solve time: ${solveTime.toFixed(1)}s`;
            summarySection.appendChild(timeLine);
        }

        const leaderboardEntries = Array.isArray(leaderboardData?.leaderboard)
            ? leaderboardData.leaderboard
            : [];

        const totalEntries =
            Number(leaderboardData?.totalEntries) || leaderboardEntries.length;
        const currentRank = leaderboardData?.currentRank;

        if (totalEntries > 0) {
            const standing = document.createElement("p");
            standing.classList.add("text-base", "text-gruvbox-gray");
            standing.textContent = currentRank
                ? `You are currently ranked #${currentRank} out of ${totalEntries} treasure hunters.`
                : `This puzzle has been completed ${totalEntries} times.`;
            summarySection.appendChild(standing);
        }

        layout.appendChild(summarySection);

        if (leaderboardEntries.length) {
            const leaderboardSection = document.createElement("section");
            leaderboardSection.classList.add("flex", "flex-col", "gap-3");

            const leaderboardHeading = document.createElement("h3");
            leaderboardHeading.classList.add(
                "text-xl",
                "font-semibold",
                "text-gruvbox-white",
            );
            leaderboardHeading.textContent = "Leaderboard";
            leaderboardSection.appendChild(leaderboardHeading);

            const tableWrapper = document.createElement("div");
            tableWrapper.style.maxHeight = "320px";
            tableWrapper.style.overflowY = "auto";
            tableWrapper.style.border = "1px solid rgba(168, 153, 132, 0.35)";
            tableWrapper.style.borderRadius = "0.75rem";
            tableWrapper.style.backgroundColor = "rgba(40, 40, 40, 0.85)";

            const table = document.createElement("table");
            table.classList.add("w-full");
            table.style.borderCollapse = "collapse";

            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            const headers = ["Rank", "Score", "Hints", "Time"];
            headers.forEach((label) => {
                const th = document.createElement("th");
                th.textContent = label;
                th.style.fontSize = "0.75rem";
                th.style.fontWeight = "600";
                th.style.letterSpacing = "0.05em";
                th.style.textTransform = "uppercase";
                th.style.padding = "0.75rem";
                th.style.position = "sticky";
                th.style.top = "0";
                th.style.backgroundColor = "rgba(40, 40, 40, 0.95)";
                th.style.borderBottom = "1px solid rgba(168, 153, 132, 0.35)";
                th.style.color = "#fbf1c7";
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement("tbody");
            leaderboardEntries.forEach((entry) => {
                const row = document.createElement("tr");
                row.style.borderBottom = "1px solid rgba(168, 153, 132, 0.2)";
                if (entry.isCurrentSession) {
                    row.style.backgroundColor = "rgba(250, 189, 47, 0.15)";
                }

                const cells = [
                    `#${entry.rank}`,
                    Number(entry.score || 0).toLocaleString(),
                    Number.isFinite(Number(entry.hintCount))
                        ? Number(entry.hintCount)
                        : entry.hintCount,
                    `${Number(entry.solveTimeInSeconds || 0).toFixed(1)}s`,
                ];

                cells.forEach((value) => {
                    const td = document.createElement("td");
                    td.textContent = `${value}`;
                    td.style.padding = "0.65rem 0.75rem";
                    td.style.color = "#fbf1c7";
                    td.style.fontSize = "0.95rem";
                    row.appendChild(td);
                });

                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            tableWrapper.appendChild(table);
            leaderboardSection.appendChild(tableWrapper);
            layout.appendChild(leaderboardSection);
        } else {
            const emptyState = document.createElement("p");
            emptyState.classList.add("text-base", "text-gruvbox-gray");
            emptyState.textContent =
                "You're the very first adventurer to solve this puzzle!";
            layout.appendChild(emptyState);
        }

        const gemContainer = document.createElement("section");
        gemContainer.classList.add("flex", "flex-wrap", "justify-center", "items-end", "gap-1");
        gemContainer.style.marginTop = "auto";
        gemContainer.style.flexGrow = "1";
        gemContainer.style.alignContent = "flex-end";
        gemContainer.style.paddingTop = "1.5rem";
        gemContainer.style.paddingBottom = "1.5rem";
        gemContainer.style.borderTop = "1px solid rgba(168, 153, 132, 0.35)";
        gemContainer.setAttribute("aria-label", "Treasure haul");

        const gemCount = Math.max(0, Math.floor(score));
        const gemFragment = document.createDocumentFragment();
        const gemSizeClass = gemCount > 500 ? "text-xs" : gemCount > 200 ? "text-sm" : gemCount > 50 ? "text-lg" : "text-2xl";

        for (let i = 0; i < gemCount; i++) {
            const gem = document.createElement("span");
            gem.textContent = "💎";
            gem.setAttribute("aria-hidden", "true");
            gem.classList.add(gemSizeClass);
            gem.style.lineHeight = "1";
            gem.style.flex = "0 0 auto";
            gem.style.filter = "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45))";
            gemFragment.appendChild(gem);
        }

        if (gemCount === 0) {
            const encouragement = document.createElement("p");
            encouragement.classList.add("text-base", "text-gruvbox-gray");
            encouragement.textContent =
                "No gems yet — try again to start a collection.";
            gemContainer.appendChild(encouragement);
        } else {
            gemContainer.appendChild(gemFragment);
        }

        layout.appendChild(gemContainer);
        lead.appendChild(layout);
    };

    restoreOriginalLayout = () => {
        if (this.#restorationTimeout) {
            clearTimeout(this.#restorationTimeout);
            this.#restorationTimeout = null;
        }

        const lead = document.getElementById("lead");
        const title = document.querySelector("#title");

        if (lead && INITIAL_LEAD_HTML !== null) {
            lead.innerHTML = INITIAL_LEAD_HTML;
        }

        if (title && INITIAL_TITLE_HTML !== null) {
            title.innerHTML = INITIAL_TITLE_HTML;
        }

        const nameElements = document.querySelectorAll("name-element");
        nameElements.forEach((element, index) => {
            if (index > 0) {
                element.remove();
            }
        });

        this.#scoring = false;

        if (this.isConnected && this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };

    analyticsTreasure = async (detail) => {
        this.#animating = false;
        if (this.#scoring) {
            return;
        }

        this.#scoring = true;
        this.removeEventListeners();

        try {
            const checkUrl = new URL("/puzzle/1/check", window.location.origin);
            const checkResponse = await fetch(checkUrl.toString(), {
                method: "GET",
                credentials: "same-origin",
            });

            const checkJson = await checkResponse.json();

            if (checkJson?.error === "session expired") {
                window.location.reload();
                return;
            }

            if (!checkJson?.token) {
                throw new Error("Unable to start scoring session.");
            }

            const solvedUrl = new URL(
                `/puzzle/1/solved/${checkJson.token}`,
                window.location.origin,
            );

            const solvedResponse = await fetch(solvedUrl.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    )?.content,
                },
                credentials: "same-origin",
                body: JSON.stringify(detail),
            });

            const solvedJson = await solvedResponse.json();

            if (!solvedResponse.ok || solvedJson?.error) {
                const message = solvedJson?.error || "Unable to record score.";
                throw new Error(message);
            }

            let leaderboard = null;

            try {
                const leaderboardUrl = new URL(
                    "/puzzle/1/leaderboard",
                    window.location.origin,
                );

                const leaderboardResponse = await fetch(
                    leaderboardUrl.toString(),
                    {
                        method: "GET",
                        credentials: "same-origin",
                    },
                );

                if (leaderboardResponse.ok) {
                    leaderboard = await leaderboardResponse.json();
                }
            } catch (leaderboardError) {
                console.warn("Unable to load leaderboard", leaderboardError);
            }

            this.showCelebration(solvedJson, leaderboard);
        } catch (error) {
            console.error(error);
            this.reset();
            this.#scoring = false;
        }
    };

    reset = (reactivate = true) => {
        this.#time = new Date();
        this.#level = 0;
        this.#hintCount = 0;
        if (this.#hintInterval) {
            clearInterval(this.#hintInterval);
            this.#hintInterval = null;
        }
        this.#held = false;
        this.#rngX = null;
        this.#rngY = null;
        this.#targetPosition = null;
        this.#emoji = document.createElement("div");
        this.#disableRotateEmoji = false;
        this.#levelTwoAnimationTimeout = null;
        this.updateProximityFeedback();
        this.style.color = "";
        this.#scoring = false;
        const body = document.querySelector("body");

        const existingEmoji = document.getElementById("emoji");
        if (existingEmoji) {
            body.removeChild(existingEmoji);
        }

        if (this.#glimmerHintTimeout) {
            clearTimeout(this.#glimmerHintTimeout);
            this.#glimmerHintTimeout = null;
        }

        if (reactivate) {
            this.loadEventListeners();
        }
        return;
    };
}

customElements.define("hint-element", HintElement);
