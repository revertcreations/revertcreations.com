const treasure = document.getElementsByTagName("treasure-element")[0];

export class HintElement extends HTMLElement {
    #time = new Date();
    #level = 0;
    #hintCount = 0;
    #hintInterval = null;
    #held = false;
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
        console.log("connectedCallback");
        this.innerText = this.dataset.content;
        this.loadEventListeners();
        this.#glimmerHintTimeout = setTimeout(() => {
            this.glimmerHint();
        }, 500);
    }

    loadEventListeners = () => {
        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mouseup", this.handleMouseUp);
        this.addEventListener("dragstart", this.handleDragStart);
        this.addEventListener("dragend", this.handleDragEnd);
        this.addEventListener("drag", this.handleDrag);

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
        console.log("handleDragLeave");
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
        this.#emoji.style.left = `${e.clientX - 10}px`;
        this.#emoji.style.top = `${e.clientY + 10}px`;
        let distanceToTreasure = this.rotateKeyAndReturnDistanceToTarget(
            e.clientX,
            e.clientY,
        );

        if (this.isInTarget(e.clientX, e.clientY)) {
            this.#emoji.style.transform = "none";
            target.classList.remove("cursor-grabbing");
            target.classList.add("cursor-progress");

            if (this.#held === null) {
                this.#held = new Date();
                this.#held = this.#held.setSeconds(
                    this.#held.getSeconds() + 2.0,
                );
            } else if (this.#held < new Date().getTime()) {
                this.levelUp();
                if (this.#level == 2) {
                    this.animateLevelTwo();
                } else {
                    this.animateLevelThree();
                }
            } else {
                this.#level == 1
                    ? (this.#emoji.innerHTML = "⏳")
                    : (this.#emoji.innerHTML = "🔐");
            }
        } else if (this.inRangeOfTreasureHintAndOfLevel(distanceToTreasure)) {
            this.#held = null;
            window.dispatchEvent(
                new CustomEvent("treasureHint", {
                    detail: { distanceToTreasure: distanceToTreasure },
                }),
            );
        } else {
            this.#held = null;
            this.#emoji.innerHTML = this.#level == 1 ? "🧭" : "🔑";
            treasure.classList.remove("text-gruvbox-yellow", "cursor-progress");
            treasure.classList.add("text-gruvbox-gray", "cursor-grabbing");
        }
    };

    handleDragEnd = (e) => {
        clearTimeout(this.#glimmerHintTimeout);
        this.#glimmerHintTimeout = setTimeout(() => {
            this.glimmerHint();
        }, 10000);

        const target = e.target;
        const body = document.querySelector("body");
        body.removeChild(this.#emoji);

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
        return (
            mouseX > this.#targetPosition.x &&
            mouseX < this.#targetPosition.x + this.#targetPosition.width &&
            mouseY > this.#targetPosition.y &&
            mouseY < this.#targetPosition.y + this.#targetPosition.height
        );
    };

    animateLevelTwo = () => {
        this.#held = null;
        this.#emoji.innerHTML = "⌛";
        this.#emoji.style.transform = "none";

        this.#levelTwoAnimationTimeout = setTimeout(() => {
            this.#emoji.classList.remove("text-5xl");
            this.#emoji.classList.add("text-2xl");
            this.#emoji.innerHTML = "✨";
            setTimeout(() => {
                this.#emoji.classList.remove("text-2xl");
                this.#emoji.classList.add("text-3xl");
                setTimeout(() => {
                    this.#emoji.classList.remove("text-3xl");
                    this.#emoji.classList.add("text-5xl");
                    setTimeout(() => {
                        this.#emoji.style.transform = "none";
                        this.#emoji.innerHTML = "🔑";
                        clearTimeout(this.#levelTwoAnimationTimeout);
                    }, 200);
                }, 200);
            }, 200);
        }, 400);
    };

    animateLevelThree = () => {
        this.#emoji.innerHTML = "🔓";

        this.analyticsTreasure({
            hintCount: this.#hintCount,
            time: (new Date() - this.#time) / 1000,
        });
    };

    levelUp = () => {
        ++this.#level;
        this.#targetPosition =
            this.#level == 1
                ? { x: this.#rngX, y: this.#rngY, width: 10, height: 10 }
                : treasure.getBoundingClientRect();
    };

    inRangeOfTreasureHintAndOfLevel = (distanceToTreasure) => {
        return distanceToTreasure <= 400 && this.#level == 2;
    };

    analyticsTreasure = (detail) => {
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
                                console.log("json: ", json);
                            }
                        });
                }
            });
    };

    reset = () => {
        console.log('resetting');
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
        body.removeChild(document.getElementById("emoji"));

        this.loadEventListeners();
        return;
    };
}

customElements.define("hint-element", HintElement);
