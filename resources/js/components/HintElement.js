const treasure = document.getElementsByTagName("treasure-element")[0];

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

        treasure.addEventListener("dragenter", this.handleDragEnter);
        treasure.addEventListener("dragleave", this.handleDragLeave);
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

        treasure.removeEventListener("dragenter", this.handleDragEnter);
        treasure.removeEventListener("dragleave", this.handleDragLeave);
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
        const mainHeaderHeight = mainHeader.offsetHeight;
        const footerHeight = footer.offsetHeight;
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
        this.#targetPosition =
            this.#level == 1
                ? { x: this.#rngX, y: this.#rngY, width: 20, height: 20 }
                : treasure.getBoundingClientRect();
    };

    inRangeOfTreasureHintAndOfLevel = (distanceToTreasure) => {
        return distanceToTreasure <= 400 && this.#level == 2;
    };

    analyticsTreasure = (detail) => {
        this.#animating = false;
        if (!this.#scoring) {
            this.#scoring = true;
            this.removeEventListeners();
            const request = new Request(window.location.href + "puzzle/1/check", {
                method: "GET",
            });

            fetch(request)
                .then((response) => response.json())
                .then((json) => {
                    if (json.error && json.error == "session expired") {
                        window.location.reload();
                    } else {
                        const request = new Request(
                            window.location.href + "puzzle/1/solved/" + json.token,
                            {
                                method: "POST",
                                headers: {
                                    "X-CSRF-TOKEN": document.querySelector(
                                        'meta[name="csrf-token"]',
                                    ).content,
                                },
                                body: JSON.stringify(detail),
                            },
                        );
                        fetch(request)
                            .then((response) => response.json())
                            .then((json) => {
                                if (json.error) {
                                    this.reset();
                                    console.error(json.error);
                                } else {
                                    this.reset();
                                    const lead = document.getElementById("lead");
                                    while (lead.firstChild) {
                                        lead.removeChild(lead.firstChild);
                                    }

                                    document.querySelector("#title > h1").innerHTML = `Score: ${json.score}`;
                                    document.querySelector('name-element').remove();
                                    const score = json.score;
                                    for (let i = 0; i < score; i++) {
                                        const scoreElement = document.createElement("span");
                                        scoreElement.innerHTML = "💎";
                                        scoreElement.style.setProperty(
                                                    "--screen-height",
                                                    window.innerHeight + "px"
                                                );

                                        scoreElement.classList.add(
                                            "absolute",
                                            "top-0",
                                            "text-2xl",
                                            "z-50",
                                            "animate-falling"
                                        );
                                        //place the scoreElement in a random x position on the screen
                                        scoreElement.style.left = Math.random() * 100 + "vw";
                                        //animate the scoreElement falling to the bottom of the screen
                                        //with a random duration from 1 to 5 seconds
                                        let animationDuration = Math.random() * 4 + 1;
                                        scoreElement.style.animationDuration = animationDuration + "s";

                                        lead.appendChild(scoreElement);
                                    }
                                    setTimeout(() => {
                                        while (lead.firstChild) {
                                            lead.removeChild(lead.firstChild);
                                        }
                                    }, 6000);

                                }
                            });
                    }
                });
        }
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

        this.loadEventListeners();
        return;
    };
}

customElements.define("hint-element", HintElement);
