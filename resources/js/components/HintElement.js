import { gsap } from "gsap";
import { notifySourceUnlock } from "../view-source/stateSignals";
import { track } from "../analytics";

export class HintElement extends HTMLElement {
    #time = new Date();
    #level = 0;
    #huntCount = 0;
    #held = false;
    #scoring = false;
    #animating = false;
    #rngX = null;
    #rngY = null;
    #targetPosition = null;
    #emoji = document.createElement("div");
    #disableRotateEmoji = false;
    #treasureElement = null;
    #gemOverlay = null;
    #levelTwoTimeline = null;
    #isAnimatingReturn = false;
    #dragHintText = null;
    #dragHintArrow = null;
    #huntTrackedForCurrentDrag = false;
    #sourceUnlockBroadcasted = false;
    #puzzleStartTracked = false;

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
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    // Global dragover handler to prevent the browser from doing the 300ms
    // "ghost snap-back" animation on unhandled drops, which delays dragend.
    #globalDragOverHandler = (e) => {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = "none";
        }
    };

    loadEventListeners = () => {
        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mouseup", this.handleMouseUp);
        this.addEventListener("touchcancel", this.handleMouseUp);
        this.addEventListener("dragstart", this.handleDragStart);
        this.addEventListener("touchstart", this.handleDragStart, {
            passive: true,
        });
        this.addEventListener("dragend", this.handleDragEnd);
        this.addEventListener("touchend", this.handleDragEnd, { passive: true });
        this.addEventListener("drag", this.handleDrag);
        this.addEventListener("touchmove", this.handleDrag, { passive: true });
        document.addEventListener("dragenter", this.#globalDragOverHandler);
        document.addEventListener("dragover", this.#globalDragOverHandler);
        document.addEventListener("drop", this.#globalDragOverHandler);
    };

    removeEventListeners = () => {
        this.removeEventListener("mousedown", this.handleMouseDown);
        this.removeEventListener("mouseup", this.handleMouseUp);
        this.removeEventListener("touchcancel", this.handleMouseUp);
        this.removeEventListener("dragstart", this.handleDragStart);
        this.removeEventListener("dragend", this.handleDragEnd);
        this.removeEventListener("drag", this.handleDrag);
        this.removeEventListener("touchstart", this.handleDragStart);
        this.removeEventListener("touchend", this.handleDragEnd);
        this.removeEventListener("touchmove", this.handleDrag);
        document.removeEventListener("dragenter", this.#globalDragOverHandler);
        document.removeEventListener("dragover", this.#globalDragOverHandler);
        document.removeEventListener("drop", this.#globalDragOverHandler);
    };

    handleMouseDown = (e) => {
        let target = e.target;
        target.setAttribute("draggable", true);
        target.classList.replace("cursor-pointer", "cursor-grab");
        target.classList.add("shadow-outer", "text-gruvbox-gray");
    };

    handleMouseUp = (e) => {
        const target = e.target;
        target.classList.remove(
            "text-gruvbox-gray",
            "shadow-outer",
            "cursor-grab",
            "cursor-grabbing",
            "cursor-progress",
        );
        target.classList.add("cursor-pointer");
        target.setAttribute("draggable", false);
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
        target.textContent = "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";

        this.#rngX = Math.random() * (window.innerWidth - padding - padding) + padding;
        this.#rngY = Math.random() * (maxHeight - minHeight) + minHeight;

        this.levelUp();

        if (!this.#puzzleStartTracked) {
            this.#puzzleStartTracked = true;
            track("treasure_puzzle_started");
        }

        gsap.killTweensOf(this.#emoji);
        gsap.set(this.#emoji, { clearProps: "all" });

        this.#emoji.innerHTML = "🧭";
        this.#emoji.className = "absolute z-50 text-5xl pointer-events-none m-0";
        this.#emoji.style.position = "absolute";

        const startX =
            e.clientX !== undefined
                ? e.clientX
                : e.touches && e.touches.length > 0
                  ? e.touches[0].clientX
                  : 0;
        const startY =
            e.clientY !== undefined
                ? e.clientY
                : e.touches && e.touches.length > 0
                  ? e.touches[0].clientY
                  : 0;

        this.#emoji.style.left = `${startX - 45}px`;
        this.#emoji.style.top = `${startY - 45}px`;
        this.#emoji.id = "emoji";
        body.appendChild(this.#emoji);

        target.classList.remove("cursor-grab", "cursor-pointer", "shadow-outer");
        target.classList.add("cursor-grabbing");
        this.#huntTrackedForCurrentDrag = false;

        this.#dragHintText = document.getElementById("drag-hint-text");
        this.#dragHintArrow = document.getElementById("drag-hint-arrow");
        if (this.#dragHintText) {
            this.#dragHintText.textContent = "x marks the spot...";
            if (this.#dragHintArrow) {
                this.#dragHintArrow.style.display = "none";
            }
        }
    };

    handleDrag = (e) => {
        const target = e.target;
        const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
        const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;

        if (!this.#huntTrackedForCurrentDrag) {
            this.#huntTrackedForCurrentDrag = true;
            this.#huntCount++;
        }

        if (clientX === 0 && clientY === 0) {
            // Start the return animation identically to when the mouse is let go
            if (!this.#isAnimatingReturn) {
                this.executeReturnAnimation(target, "drag(0,0)");
            }
            return;
        }

        const emojiOffset = 45;

        this.#emoji.style.left = `${clientX - emojiOffset}px`;
        this.#emoji.style.top = `${clientY - emojiOffset}px`;

        let distanceToTreasure = this.rotateKeyAndReturnDistanceToTarget(clientX, clientY);

        if (this.isInTarget(clientX, clientY)) {
            if (!this._wasInTarget) {
                this._wasInTarget = true;
            }
            this.#emoji.style.transform = "none";
            target.classList.remove("cursor-grabbing");
            target.classList.add("cursor-progress");

            if (!this.#held) {
                const duration = parseInt(this.dataset.holdDuration) || 1000;
                this.#held = Date.now() + duration;
                this.#dragHintText.textContent =
                    this.#level == 1 ? "investigating..." : "unlocking...";
            } else if (this.#held < Date.now()) {
                target.classList.remove("cursor-progress");
                this.levelUp();
                if (this.#level == 2) {
                    target.classList.add("cursor-grabbing");
                    this.#dragHintText.textContent = "a key!";
                    this.animateLevelTwo();
                } else {
                    this.animateLevelThree();
                }
            } else {
                this.#level == 1 ? (this.#emoji.innerHTML = "⏳") : (this.#emoji.innerHTML = "🔐");
            }
        } else {
            if (this._wasInTarget) {
                this._wasInTarget = false;
            }
            this.#held = false;
            if (this.isInTreasureElement(clientX, clientY)) {
                if (this.#level < 2) this.#disableRotateEmoji = true;
                this.#emoji.style.transform = "none";
                this.#dragHintText.textContent = "it's locked";
                this.#emoji.innerHTML = "🔒";
            } else if (!this.#animating) {
                this.#disableRotateEmoji = false;
                this.#dragHintText.textContent =
                    this.#level == 1 ? "x marks the spot..." : "a key!";
                this.#emoji.innerHTML = this.#level == 1 ? "🧭" : "🔑";
            }
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
        const target = e.target;

        if (!this.#isAnimatingReturn) {
            this.executeReturnAnimation(target, "dragend");
        }

        // Reset the animating lock for the next interaction
        this.#isAnimatingReturn = false;
        this.#huntTrackedForCurrentDrag = false;
    };

    executeReturnAnimation = (target, sourceEvent) => {
        this.#isAnimatingReturn = true;

        const emojiEl = document.getElementById("emoji");

        this.#level = 0;

        target.textContent = this.dataset.content;
        target.classList.remove(
            "text-gruvbox-gray",
            "shadow-outer",
            "cursor-grab",
            "cursor-grabbing",
            "cursor-progress",
        );
        target.classList.add("cursor-pointer");

        if (this.#dragHintText) {
            this.#dragHintText.textContent = "Drag me!";
            if (this.#dragHintArrow) {
                this.#dragHintArrow.style.display = "block";
            }
        }

        if (emojiEl) {
            // Record where the emoji currently is visually on screen before we swap it
            const emojiRect = emojiEl.getBoundingClientRect();

            // Get the final destination of the inline text
            const rect = target.getBoundingClientRect();

            // Swap the flying emoji out for the actual word
            emojiEl.innerHTML = this.dataset.content;

            // Optimize the swap to prevent DOM repaint lag.
            // We manually assign the exact classes it needs instead of copying the target's entire classList
            emojiEl.className =
                "absolute z-50 pointer-events-none m-0 text-gruvbox-gray select-none text-lg leading-[3rem] md:text-xl md:leading-[3.5rem] lg:text-2xl lg:leading-[4.5rem]";

            // Instantly snap the element's actual position to the destination using left/top (which are slow to animate)
            emojiEl.style.left = `${rect.left + window.scrollX}px`;
            emojiEl.style.top = `${rect.top + window.scrollY}px`;

            // Hide the actual inline text temporarily so we don't see double
            target.style.opacity = "0";

            // Calculate the delta distance
            const deltaX = emojiRect.left - rect.left;
            const deltaY = emojiRect.top - rect.top;

            // Look up what angle the compass had at the moment it was dropped
            let currentRotation = 0;
            if (emojiEl.style.transform && emojiEl.style.transform.includes("rotate")) {
                const match = emojiEl.style.transform.match(/rotate\(([-\d.]+)deg\)/);
                if (match) currentRotation = parseFloat(match[1]);
            }

            // Magnetically pull the flying text back into the sentence using hardware-accelerated transforms (x/y)
            gsap.fromTo(
                emojiEl,
                {
                    x: deltaX,
                    y: deltaY,
                    rotation: currentRotation,
                },
                {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    duration: 0.35,
                    ease: "power2.out",
                    onComplete: () => {
                        if (emojiEl.parentNode) {
                            emojiEl.parentNode.removeChild(emojiEl);
                        }
                        // Restore visibility seamlessly
                        target.style.opacity = "1";
                    },
                },
            );
        }
    };

    rotateKeyAndReturnDistanceToTarget = (mouseX, mouseY) => {
        if (!this.#targetPosition) return;
        const deltaX = this.#targetPosition.x + this.#targetPosition.width / 2 - mouseX;
        const deltaY = this.#targetPosition.y + this.#targetPosition.height / 2 - mouseY;

        let distanceToTreasure = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        let theta = Math.atan2(deltaY, deltaX);
        let angle = (theta / Math.PI) * 180 + (theta > 0 ? 0 : 360);

        // adjusting the initial rotation of the emojis
        let rotate = 0;
        if (!this.#disableRotateEmoji) {
            if (this.#level == 1 && !this.#held) {
                rotate = angle + 45;
            } else if (this.#level == 2 && !this.#held) {
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

    isInTreasureElement = (mouseX, mouseY) => {
        if (!this.#treasureElement) return false;
        const treasureRect = this.#treasureElement.getBoundingClientRect();
        return (
            mouseX > treasureRect.x &&
            mouseX < treasureRect.x + treasureRect.width &&
            mouseY > treasureRect.y &&
            mouseY < treasureRect.y + treasureRect.height
        );
    };

    animateLevelTwo = () => {
        if (this.#animating) return;
        if (!document.body.contains(this.#emoji)) return;
        this.#dragHintText.textContent = "investigating...";

        this.#held = null;
        this.#animating = true;

        if (this.#levelTwoTimeline) {
            this.#levelTwoTimeline.kill();
            this.#levelTwoTimeline = null;
        }

        let previousFontClass = null;

        gsap.set(this.#emoji, { transformOrigin: "50% 50%" });

        const cleanup = () => {
            this.#animating = false;
            this.#levelTwoTimeline = null;
        };

        const timeline = gsap.timeline({
            defaults: { ease: "back.out(1.6)" },
            onComplete: cleanup,
        });

        this.#levelTwoTimeline = timeline;

        const updateEmoji = (fontSize, emoji) => {
            if (!document.body.contains(this.#emoji)) {
                timeline.kill();
                cleanup();
                return;
            }

            if (previousFontClass) {
                this.#emoji.classList.remove(previousFontClass);
            }

            this.#emoji.classList.add(fontSize);
            previousFontClass = fontSize;
            this.#emoji.innerHTML = emoji;
        };

        timeline
            .call(updateEmoji, ["text-5xl", "⌛"])
            .fromTo(
                this.#emoji,
                { scale: 1, opacity: 1.2 },
                { scale: 1, opacity: 1, duration: 0.3, overwrite: "auto" },
            )
            .call(updateEmoji, ["text-xl", "✨"])
            .fromTo(
                this.#emoji,
                { scale: 0.15, opacity: 0.5 },
                { scale: 1.8, opacity: 1, duration: 0.75, overwrite: "auto" },
            )
            .call(updateEmoji, ["text-5xl", "🔑"])
            .fromTo(
                this.#emoji,
                { scale: 0.3, opacity: 0.6 },
                { scale: 1, opacity: 1, duration: 0.3, overwrite: "auto" },
            );

        timeline.play(0);
    };

    animateLevelThree = () => {
        this.#animating = true;
        this.#emoji.innerHTML = "🔓";
        const lead = document.getElementById("lead");
        if (!lead) {
            return;
        }

        lead.innerHTML = "Loading high scores...    ";

        setTimeout(() => {
            this.#emoji.innerHTML = "🎉";
            this.#animating = false;

            this.analyticsTreasure(
                {
                    huntCount: this.#huntCount,
                    time: (new Date() - this.#time) / 1000,
                },
                lead,
            );
        }, 300);
    };

    levelUp = () => {
        ++this.#level;
        if (this.#level === 1) {
            this.#targetPosition = {
                x: this.#rngX,
                y: this.#rngY,
                width: 20,
                height: 20,
            };
        } else if (this.#treasureElement) {
            this.#targetPosition = this.#treasureElement.getBoundingClientRect();
        } else {
            this.#targetPosition = null;
        }

        if (this.#level === 2) {
            track("treasure_puzzle_key_obtained");
        }
    };

    inRangeOfTreasureHintAndOfLevel = (distanceToTreasure) => {
        return distanceToTreasure <= 400 && this.#level == 2;
    };

    calculateLocalScore = (huntCount, solveTimeSeconds) => {
        const minScore = 80;
        const maxScore = 1000;
        const huntCeiling = 12;
        const timeCeilingSeconds = 180;
        const huntWeight = 0.35;
        const timeWeight = 0.7;

        const normalizedHunts = Math.min(Math.max(huntCount, 0) / huntCeiling, 1);
        const normalizedTime = Math.min(Math.max(solveTimeSeconds, 0) / timeCeilingSeconds, 1);

        const huntPerformance = (1 - normalizedHunts) ** 2;
        const timePerformance = (1 - normalizedTime) ** 2;
        const weightedPerformance = timePerformance * timeWeight + huntPerformance * huntWeight;

        return Math.round(
            minScore + (maxScore - minScore) * (weightedPerformance / (timeWeight + huntWeight)),
        );
    };

    analyticsTreasure = (detail, lead) => {
        this.#animating = false;
        if (!this.#scoring) {
            this.#scoring = true;
            this.removeEventListeners();

            // Calculate score locally and fire the visual gem explosion INSTANTLY
            // instead of waiting 90ms for the two API network requests to round-trip.
            const localScore = this.calculateLocalScore(detail.huntCount, detail.time);
            track("treasure_puzzle_solved", {
                hunt_count: detail.huntCount,
                solve_time_seconds: Math.round(detail.time),
                score: localScore,
            });
            this.populateGems(localScore);
            if (!this.#sourceUnlockBroadcasted) {
                notifySourceUnlock("hint-element", { score: localScore });
                this.#sourceUnlockBroadcasted = true;
            }

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const checkUrl = new URL("/puzzle/1/check", window.location.origin);

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

                    const solvedUrl = new URL(
                        `/puzzle/1/solved/${json.token}`,
                        window.location.origin,
                    );

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

                            // Keep the visual gems falling even though we reset the interactive state mechanics
                            this.reset({ preserveGems: true });
                            this.renderCelebration(json, lead);
                        });
                })
                .catch((error) => {
                    console.error(error);
                    this.reset();
                });
        }
    };

    renderCelebration = (result, lead) => {
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

        let gemOverlay = document.getElementById("puzzle-gem-overlay");
        if (!gemOverlay) {
            gemOverlay = document.createElement("div");
            gemOverlay.id = "puzzle-gem-overlay";
            document.body.appendChild(gemOverlay);
        }

        gemOverlay.innerHTML = "";
        Object.assign(gemOverlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: "9999",
        });

        const leadRect = lead.getBoundingClientRect();

        let gemsProcessed = 0;
        const CHUNK_SIZE = 50;

        // Process gems in batches using requestAnimationFrame
        // to prevent GSAP from locking the main thread parsing 3,000 tweens synchronously.
        const processChunk = () => {
            const fragment = document.createDocumentFragment();
            const currentBatch = [];

            const processCount = Math.min(CHUNK_SIZE, score - gemsProcessed);

            for (let i = 0; i < processCount; i++) {
                const gem = document.createElement("span");
                gem.classList.add("puzzle-gem");
                gem.textContent = "💎";

                const sizeRem = 1.3 + Math.random() * 1.2;
                gem.style.fontSize = `${sizeRem}rem`;

                const maxLeft = Math.max(leadRect.width - sizeRem * 16, 0);
                const startX = leadRect.left + Math.random() * maxLeft;
                const startY = -(Math.random() * (window.innerHeight * 0.5) + sizeRem * 16);

                gem.style.left = `${startX}px`;
                gem.style.transform = `translateY(${startY}px)`;
                gem.style.opacity = "1";

                fragment.appendChild(gem);
                currentBatch.push(gem);
            }

            gemOverlay.appendChild(fragment);

            gsap.to(currentBatch, {
                y: window.innerHeight + 100,
                duration: () => 1.5 + Math.random() * 2.5,
                delay: () => Math.random() * 2, // Keeps visuals chaotic even when batched
                ease: "none",
                onComplete: function () {
                    const target = this.targets()[0];
                    if (target) {
                        target.remove();
                    }
                },
            });

            gemsProcessed += processCount;

            if (gemsProcessed < score) {
                // If there are more gems, defer the next batch to the next frame
                // This keeps the user's browser perfectly smooth while the explosion builds.
                requestAnimationFrame(processChunk);
            }
        };

        // Start processing the very first chunk instantly
        processChunk();
        this.#gemOverlay = gemOverlay;
    };

    stopGemAnimation = () => {
        if (this.#gemOverlay) {
            // Kill any active GSAP tweens on gems if the component is resetting
            const activeGems = this.#gemOverlay.querySelectorAll(".puzzle-gem");
            if (activeGems.length) {
                gsap.killTweensOf(activeGems);
                activeGems.forEach((gem) => gem.remove());
            }
            this.#gemOverlay.innerHTML = "";
        }
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
            population.textContent = `Across ${result.totalPlayers} solve${
                result.totalPlayers === 1 ? "" : "s"
            }.`;
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
            const hunts = entry.hunt_count ?? 0;
            const time = typeof entry.time === "number" ? entry.time.toFixed(1) : entry.time;
            right.textContent = `${hunts} hunt${hunts === 1 ? "" : "s"}, ${time ?? "0.0"}s`;

            item.appendChild(left);
            item.appendChild(right);
            list.appendChild(item);
        });

        container.appendChild(list);
    };

    reset = (options = {}) => {
        this.#time = new Date();
        this.#level = 0;
        this.#huntCount = 0;
        this.#held = false;
        this.#rngX = null;
        this.#rngY = null;
        this.#targetPosition = null;
        this.#emoji = document.createElement("div");
        this.#disableRotateEmoji = false;
        this.#huntTrackedForCurrentDrag = false;
        const body = document.querySelector("body");

        if (document.getElementById("emoji")) body.removeChild(document.getElementById("emoji"));

        // Only destroy the visual celebration overlay if explicitly clearing
        if (!options.preserveGems) {
            if (this.#gemOverlay) {
                this.#gemOverlay.remove();
                this.#gemOverlay = null;
            }
            this.stopGemAnimation();
        }

        this.loadEventListeners();
        return;
    };
}

customElements.define("hint-element", HintElement);
