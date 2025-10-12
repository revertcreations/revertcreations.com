const Playground = {
    initialized: false,
    playground: null,
    dynamicNodeClass: "playground-dynamic",
    formWrap: null,
    hireOverlay: null,
    hireKeyListener: null,
    skillLookup: {},
    activeSkill: null,
    dropZoneRect: null,
    resizeListener: null,
    resizeTimeoutId: null,
    homepageTag: document.querySelector("name-element"),
    pageTitle: document.querySelector("#title > h1"),
    skills: [],
    needsReset: false,
    fontScale: 25,
    placedSkills: [],
    placedSkillAttempts: 0,
    speedLimit: 12,
    homepageTagHtml: false,

    init: (data) => {
        Playground.initialized = true;

        if (!Playground.playground)
            Playground.playground = document.getElementById("lead");

        if (!Playground.playground)
            Playground.playground = document.getElementById("content");

        if (!Playground.playground) {
            console.warn("Playground container (#lead/#content) not found.");
            return;
        }

        Playground.clearDynamicNodes();
        Playground.skillLookup = Object.create(null);
        Playground.activeSkill = null;
        Playground.dropZoneRect = null;

        if (Playground.playground.id === "lead") {
            const leadHeight = Playground.playground.offsetHeight;
            Playground.playground.innerHTML = "";
            Playground.playground.style.minHeight = `${leadHeight}px`;
        } else {
            const leadContainer = document.getElementById("lead");
            if (leadContainer) leadContainer.innerHTML = "";
        }

        Playground.skills = data;

        Playground.playground.style.position = "relative";
        Playground.playground.style.overflow = "visible";
        Playground.attachResizeListener();

        const header = document.getElementById("main_header");
        const footer = document.getElementById("footer");
        const viewportHeight = window.innerHeight;
        const contentPaddingTop = 0;
        const availableHeight = Math.max(
            viewportHeight -
                (header ? header.offsetHeight : 0) -
                (footer ? footer.offsetHeight : 0) -
                contentPaddingTop,
            420,
        );
        Playground.playground.style.height = `${availableHeight}px`;

        const computedStyle = getComputedStyle(Playground.playground);
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
        const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;

        const placementBounds = {
            width: Playground.playground.clientWidth - paddingLeft - paddingRight,
            height: Playground.playground.clientHeight - paddingTop - paddingBottom,
            paddingLeft,
            paddingTop,
        };

        for (let skill in Playground.skills) {
            Playground.needsReset = false;
            Playground.skills[skill].element = document.createElement("div");

            Playground.skills[skill].active = false;
            Playground.skills[skill].isPositioned = false;
            Playground.skills[skill].currentX;
            Playground.skills[skill].currentY;
            Playground.skills[skill].initialX;
            Playground.skills[skill].initialY;
            Playground.skills[skill].xOffset = 0;
            Playground.skills[skill].yOffset = 0;
            Playground.skills[skill].pointerId = null;

            Playground.styleElement(Playground.skills[skill]);
            Playground.playground.appendChild(Playground.skills[skill].element);
            Playground.skillLookup[Playground.skills[skill].name] =
                Playground.skills[skill];

            if (!Playground.positionElement(Playground.skills[skill], placementBounds)) break;

            Playground.addClickListener(Playground.skills[skill]);
        }

        if (Playground.needsReset) Playground.reset("exceeded");
    },

    styleElement: (skill) => {
        skill.nameSpan = document.createElement("span");
        skill.nameSpan.classList.add("pointer-events-none");
        skill.nameSpan.innerText = skill.name;
        skill.element.appendChild(skill.nameSpan);
        skill.element.id = skill.name;
        skill.element.style.position = "absolute";
        skill.element.style.color = Playground.getColorBasedOnExperience(
            skill.experience,
            "hex",
        );
        skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(
            skill.experience,
        );
        skill.element.style.setProperty(
            "--experience-color",
            Playground.getColorBasedOnExperience(skill.experience, "hex"),
        );
        skill.element.style.touchAction = "none";
        skill.element.classList.add(
            "hover:animate-float-text",
            "text-bold",
            "text-center",
            "select-none",
            "cursor-pointer",
            Playground.dynamicNodeClass,
            "skill-item",
        );
    },

    clearDynamicNodes: () => {
        if (!Playground.playground) return;

        const removableNodes = Playground.playground.querySelectorAll(
            "." + Playground.dynamicNodeClass,
        );

        removableNodes.forEach((node) => node.remove());

        Playground.formWrap = null;
    },

    attachResizeListener: () => {
        if (Playground.resizeListener) return;

        Playground.resizeListener = () => {
            if (!Playground.playground || !Playground.playground.offsetParent)
                return;

            if (Playground.resizeTimeoutId)
                clearTimeout(Playground.resizeTimeoutId);

            Playground.resizeTimeoutId = window.setTimeout(
                () => Playground.reset("resize"),
                1000,
            );
        };

        window.addEventListener("resize", Playground.resizeListener);
    },

    detachResizeListener: () => {
        if (!Playground.resizeListener) return;

        window.removeEventListener("resize", Playground.resizeListener);
        Playground.resizeListener = null;

        if (Playground.resizeTimeoutId) {
            clearTimeout(Playground.resizeTimeoutId);
            Playground.resizeTimeoutId = null;
        }
    },

    disableSkills: () => {
        Playground.skills.forEach((skill) => {
            skill.element.classList.remove(
                "text-" +
                    Playground.getColorBasedOnExperience(skill.experience),
                "hover:animate-float-text",
                "cursor-pointer",
            );
            skill.element.classList.add("text-gruvbox-black");

            if (skill.name != Playground.skillActive.name)
                skill.element.classList.add("animate-blur-text");

            skill.element.removeEventListener(
                "pointerdown",
                Playground.dragStart,
                false,
            );
        });
    },

    enableSkills: () => {
        Playground.skills.forEach((skill) => {
            setTimeout(() => {
                skill.element.classList.remove("animate-sharpen-text");
                skill.element.classList.add("hover:animate-float-text");
            }, 800);

            skill.element.classList.remove(
                "text-gruvbox-black",
                "animate-blur-text",
            );
            skill.element.classList.add(
                "text-" +
                    Playground.getColorBasedOnExperience(skill.experience),
                "cursor-pointer",
                "animate-sharpen-text",
            );

            skill.element.addEventListener(
                "pointerdown",
                Playground.dragStart,
                false,
            );
        });
    },

    addRandomFloatEffect: (skill) => {
        let animationTime = Math.random() * (15 - 2) + 2 + "s";
        let x = Math.random() * (10 - -10) + -10 + "px";
        let y = Math.random() * (10 - -10) + -10 + "px";

        skill.element.style.setProperty(
            "--float-animation-time",
            animationTime,
        );
        skill.element.style.setProperty("--float-fifty-percent-y", x);
        skill.element.style.setProperty("--float-fifty-percent-x", y);
    },

    positionElement: (skill, bounds = null) => {
        while (!skill.isPositioned) {
            if (Playground.placedSkillAttempts > 200) {
                Playground.fontScale = Playground.fontScale + 2;
                Playground.needsReset = true;
                return false;
            }

            const playgroundBounds = bounds ?? {
                width: Playground.playground.clientWidth,
                height: Playground.playground.clientHeight,
                paddingLeft: 0,
                paddingTop: 0,
            };

            let width = skill.element.offsetWidth;
            let height = skill.element.offsetHeight;

            const maxX = Math.max(playgroundBounds.width - width, 0);
            const maxY = Math.max(playgroundBounds.height - height, 0);

            const textXBound = playgroundBounds.paddingLeft + (maxX > 0 ? Math.random() * maxX : 0);
            const textYBound = playgroundBounds.paddingTop + (maxY > 0 ? Math.random() * maxY : 0);

            let cords = {
                width: width,
                height: height,
                x: textXBound,
                y: textYBound,
            };

            let overlaps = false;

            for (let position in Playground.placedSkills) {
                if (
                    Playground.skillsOverlap(
                        cords,
                        Playground.placedSkills[position].cords,
                    )
                ) {
                    Playground.placedSkillAttempts++;
                    overlaps = true;
                    break;
                }
            }

            if (overlaps) continue;

            if (!skill.isPositioned) {
                Playground.placedSkills.push({
                    name: skill.element.innerText,
                    cords: cords,
                });

                skill.originalTop = textYBound + "px";
                skill.originalLeft = textXBound + "px";

                skill.element.style.top = skill.originalTop;
                skill.element.style.left = skill.originalLeft;
                skill.isPositioned = true;
            }

            return true;
        }
    },

    reset: (mode) => {
        mode = mode || false;

        if (mode === "hire") {
            Playground.showHireForm();
            return;
        }

        Playground.closeHireForm();

        if (
            Playground.activeSkill &&
            Playground.activeSkill.element &&
            typeof Playground.activeSkill.element.releasePointerCapture ===
                "function" &&
            Playground.activeSkill.pointerId !== undefined &&
            Playground.activeSkill.pointerId !== null
        ) {
            try {
                Playground.activeSkill.element.releasePointerCapture(
                    Playground.activeSkill.pointerId,
                );
            } catch (err) {
                // ignore release errors (pointer already released)
            }
        }

        window.removeEventListener("pointermove", Playground.drag);
        window.removeEventListener("pointerup", Playground.dragEnd);
        window.removeEventListener("pointercancel", Playground.dragEnd);

        Playground.placedSkillAttempts = 0;
        Playground.placedSkills = [];
        if (mode != "exceeded") Playground.fontScale = 25;

        if (typeof document !== "undefined" && document.body) {
            document.body.classList.remove("hire-modal-open");
        }

        for (let skill in Playground.skills) {
            Playground.skills[skill].active = false;
            if (Playground.skills[skill].element) {
                Playground.skills[skill].element.removeEventListener(
                    "pointerdown",
                    Playground.dragStart,
                );

                if (
                    Playground.playground &&
                    Playground.skills[skill].element.parentNode ===
                        Playground.playground
                ) {
                    Playground.playground.removeChild(
                        Playground.skills[skill].element,
                    );
                }

                delete Playground.skills[skill].element;
            }
        }

        Playground.clearDynamicNodes();
        Playground.formWrap = null;
        Playground.hireOverlay = null;
        Playground.skillLookup = Object.create(null);
        Playground.activeSkill = null;
        Playground.dropZoneRect = null;
        if (Playground.resizeTimeoutId) {
            clearTimeout(Playground.resizeTimeoutId);
            Playground.resizeTimeoutId = null;
        }

        if (Playground.initialized) {
            Playground.init(Playground.skills);
        }
    },

    resetSkillPosition: (skill) => {
        for (let position in Playground.placedSkills) {
            if (Playground.placedSkills[position].name == skill.name) {
                skill.currentX = 0;
                skill.currentY = 0;
                skill.initialX;
                skill.initialY;
                skill.xOffset = 0;
                skill.yOffset = 0;

                Playground.setTranslate(
                    skill.currentX,
                    skill.currentY,
                    skill.element,
                );
            }
        }
    },

    getSkillBasedOnName: (name) => {
        if (!name) return null;
        if (Playground.skillLookup && Playground.skillLookup[name])
            return Playground.skillLookup[name];

        for (let skill in Playground.skills) {
            if (Playground.skills[skill].name == name)
                return Playground.skills[skill];
        }

        return null;
    },

    getFontSizeBasedOnExperience: (experience) => {
        return experience / Playground.fontScale + "em";
    },

    getColorBasedOnExperience: (experience, type) => {
        switch (true) {
            case experience == 101:
                if (type == "hex") return "#b16286";
                return "gruvbox-purple";

            case experience == 102:
                if (type == "hex") return "#cc241d";
                return "gruvbox-red";

            case experience == 100:
                if (type == "hex") return "#fbf1c7";
                return "gruvbox-white";

            default:
                if (type == "hex") return "#b8bb26";
                return "gruvbox-green";
        }
    },

    skillsOverlap: (rect1, rect2) => {
        if (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        ) {
            return true;
        }

        return false;
    },

    addClickListener: (skill) => {
        skill.element.addEventListener(
            "pointerdown",
            Playground.dragStart,
            false,
        );
    },

    dragStart: (e) => {
        const hostElement = e.currentTarget;
        const skill =
            (hostElement && Playground.getSkillBasedOnName(hostElement.id)) ||
            Playground.getSkillBasedOnName(e.target?.id);

        if (!skill || !skill.element) return;

        if (!skill.element.contains(e.target)) return;

        if (Playground.homepageTag)
            Playground.homepageTag.setAttribute("data-content", skill.name);
        if (Playground.pageTitle) Playground.pageTitle.innerText = "Drag & Drop";

        if (Playground.homepageTag)
            Playground.homepageTag.classList.add(
                "border",
                "border-dashed",
                "border-4",
                "border-gruvbox-green"
            );
        if (Playground.homepageTag)
            Playground.homepageTag.classList.remove("border-transparent");

        if (Playground.homepageTag)
            Playground.homepageTag.classList.add(
                "border",
                "border-4",
                "border-dashed",
                "border-gruvbox-green"
            );

        Playground.activeSkill = skill;
        Playground.dropZoneRect =
            Playground.homepageTag &&
            Playground.homepageTag.getBoundingClientRect();

        if (e.pointerType === "touch") e.preventDefault();

        if (typeof e.pointerId !== "undefined") {
            skill.pointerId = e.pointerId;
        } else {
            skill.pointerId = null;
        }

        try {
            if (
                typeof e.pointerId !== "undefined" &&
                skill.element.setPointerCapture
            ) {
                skill.element.setPointerCapture(e.pointerId);
            }
        } catch (err) {
            // pointer capture optional; ignore failures
        }

        window.addEventListener("pointermove", Playground.drag);
        window.addEventListener("pointerup", Playground.dragEnd);
        window.addEventListener("pointercancel", Playground.dragEnd);

        skill.element.style.zIndex = "11";
        skill.element.classList.remove("cursor-pointer");
        skill.element.classList.add("cursor-move");

        if (skill.heldCounter && skill.heldCounter > 2) {
            clearInterval(skill.heldCounter);
        }

        skill.initialX = e.clientX - (skill.xOffset || 0);
        skill.initialY = e.clientY - (skill.yOffset || 0);
        skill.dragActive = true;
    },

    dragEnd: (e) => {
        const skill =
            Playground.activeSkill ||
            Playground.getSkillBasedOnName(e.target?.id);

        if (!skill || !skill.element) return;

        if (
            typeof e.pointerId !== "undefined" &&
            skill.pointerId !== undefined &&
            skill.pointerId !== null &&
            skill.pointerId !== e.pointerId
        ) {
            return;
        }

        window.removeEventListener("pointermove", Playground.drag);
        window.removeEventListener("pointerup", Playground.dragEnd);
        window.removeEventListener("pointercancel", Playground.dragEnd);

        try {
            if (
                skill.pointerId !== undefined &&
                skill.pointerId !== null &&
                typeof skill.element.releasePointerCapture === "function" &&
                (!skill.element.hasPointerCapture ||
                    skill.element.hasPointerCapture(skill.pointerId))
            ) {
                skill.element.releasePointerCapture(skill.pointerId);
            }
        } catch (err) {
            // ignore pointer capture release failures
        }

        skill.pointerId = null;
        skill.element.classList.remove("cursor-move");
        skill.element.classList.add("cursor-pointer");
        skill.element.style.zIndex = "1";
        skill.dragActive = false;
        skill.infoShowing = false;

        if (skill.name == "hire me") Playground.removeHireHint(skill);

        Playground.removeHint(skill);
        Playground.resetSkillPosition(skill);

        if (skill.atTarget) {
            if (skill.name == "hire me") {
                Playground.reset("hire");
            } else if (skill.name == "reset();") {
                Playground.reset();
            } else {
                Playground.displayInfoCard(skill);
            }

            skill.atTarget = false;
        }

        if (Playground.pageTitle) Playground.pageTitle.innerText = "Hi. I'm";
        if (Playground.homepageTag)
            Playground.homepageTag.classList.remove(
                "border",
                "border-dashed",
                "border-gruvbox-green"
            );
        if (Playground.homepageTag)
            Playground.homepageTag.classList.add("border-transparent");

        Playground.activeSkill = null;
        Playground.dropZoneRect = null;
    },

    drag: (e) => {
        const skill = Playground.activeSkill;

        if (!skill || !skill.dragActive || !skill.element) return;

        if (
            typeof e.pointerId !== "undefined" &&
            skill.pointerId !== undefined &&
            skill.pointerId !== null &&
            skill.pointerId !== e.pointerId
        ) {
            return;
        }

        if (e.pointerType === "touch") e.preventDefault();

        if (!skill.elementChild) Playground.buildInfoCard(skill);

        const isForm = Playground.draggingEvents(e, skill);

        skill.currentX = e.clientX - skill.initialX;
        skill.currentY = e.clientY - skill.initialY;

        if (!isForm) {
            Playground.setTranslate(
                skill.currentX,
                skill.currentY,
                skill.element,
            );
        }
    },

    draggingEvents: (e, skill) => {
        if (!skill || !skill.element || !Playground.homepageTag) return false;

        const dropZoneRect =
            Playground.dropZoneRect ||
            Playground.homepageTag.getBoundingClientRect();

        if (!dropZoneRect) return false;

        const elementRect = skill.element.getBoundingClientRect();
        const isAtTarget = Playground.skillsOverlap(elementRect, dropZoneRect);

        if (isAtTarget && !skill.atTarget) {
            Playground.homepageTag.classList.add("border-gruvbox-green");

            if (
                Playground.homepageTag.classList.contains("text-gruvbox-gray")
            ) {
                Playground.homepageTag.classList.remove(
                    "text-gruvbox-gray",
                    "shadow-inner",
                    "border-gruvbox-green",
                );
                Playground.homepageTag.classList.add(
                    "text-" +
                        Playground.getColorBasedOnExperience(skill.experience),
                );
            }
        } else if (!isAtTarget && skill.atTarget) {
            Playground.homepageTag.classList.remove("border-gruvbox-green");
        }

        if (!isAtTarget) Playground.skillActive = skill;

        skill.atTarget = isAtTarget;

        return false;
    },

    addHint: (skill) => {
        skill.elementHint = document.createElement("div");
        skill.elementHint.classList.add(
            "self-center",
            "justify-self-center",
            "cursor-pointer",
            "text-sm",
            "text-gruvbox-white",
            "max-w-md",
            "text-center",
        );
        skill.elementHint.innerHTML = "drag and drop";
        skill.element.appendChild(skill.elementHint);
    },

    addHireHint: (skill) => {
        skill.elementHireHint = document.createElement("div");
        skill.elementHireHint.classList.add(
            "self-center",
            "justify-self-center",
            "text-sm",
            "text-gruvbox-white",
            "text-center",
            "bg-gruvbox-black",
            "m-auto",
        );
        skill.elementHireHint.innerHTML = "&uuarr; hire me! &ddarr;";
        skill.element.appendChild(skill.elementHireHint);
    },

    removeHint: (skill) => {
        //Playground.homepageTag.classList.remove(
        //    "text-gruvbox-gray",
        //    "bg-gruvbox-black",
        //);
        //Playground.homepageTag.classList.add(
        //    "text-gruvbox-green",
        //    "bg-gruvbox-black",
        //);

        skill.heldCounter = 0;

        if (skill.heldInterval) clearTimeout(skill.heldInterval);

        if (skill.elementHint) {
            skill.element.removeChild(skill.elementHint);
            delete skill.elementHint;
        }
    },

    removeHireHint: (skill) => {
        skill.heldCounter = 0;

        if (skill.heldHireInterval) clearTimeout(skill.heldHireInterval);

        if (skill.elementHireHint) {
            skill.element.removeChild(skill.elementHireHint);
            delete skill.elementHireHint;
        }
    },

    setTranslate: (xPos, yPos, el) => {
        el.style.transform = "translate(" + xPos + "px, " + yPos + "px)";
    },

    buildInfoCard: (skill) => {
        skill.elementChild = document.createElement("div");

        skill.elementChild.style.fontSize = "16px";
        skill.elementChild.classList.add(
            "flex",
            "flex-col",
            "bg-gruvbox-black",
            "p-2",
            "h-80",
            "md:h-auto",
            "overflow-y-auto",
            "overflow-x-hidden",
        );

        Playground.buildInfoCardCloseElement(skill);
        Playground.buildExperienceDiv(skill);

        skill.elementChildExcerpt = document.createElement("div");
        skill.elementChildExcerpt.classList.add(
            "m-2",
            "text-left",
            "align-top",
            "md:self-start",
            "self-center",
            "text-gruvbox-white",
        );
        skill.elementChildExcerpt.textContent = skill.excerpt;
    },

    buildInfoCardCloseElement: (skill) => {
        skill.closeInfoCard = document.createElement("div");
        skill.closeInfoCard.classList.add(
            "absolute",
            "-top-20",
            "z-20",
            "right-0",
            "cursor-pointer",
            "text-6xl",
        );
        skill.closeButton = document.createElement("span");
        skill.closeButton.classList.add(
            "text-gruvbox-red",
            "hover:text-red-400",
        );
        skill.closeButton.setAttribute("role", "button");
        skill.closeButton.setAttribute("aria-label", "Close skill details");
        skill.closeButton.textContent = "×";
        skill.closeButtonHandler = () =>
            Playground.closeInfoCard(skill.name);
        skill.closeButton.addEventListener(
            "click",
            skill.closeButtonHandler,
        );
        skill.closeInfoCard.appendChild(skill.closeButton);
    },

    closeInfoCard: (skill_name) => {
        let skill = Playground.getSkillBasedOnName(skill_name);

        skill.element.removeChild(skill.elementChild);
        skill.element.removeChild(skill.closeInfoCard);
        if (skill.closeButton) {
            skill.closeButton.removeEventListener(
                "click",
                skill.closeButtonHandler,
            );
            delete skill.closeButton;
            delete skill.closeButtonHandler;
        }

        skill.element.style.top = skill.originalTop;
        skill.element.style.left = skill.originalLeft;
        skill.element.style.zIndex = "1";
        skill.element.style.transform = "unset";
        skill.element.style.backgroundImage = "unset";
        skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(
            skill.experience,
        );
        skill.element.classList.remove(
            "animate-float-bg",
            "bg-" + Playground.getColorBasedOnExperience(skill.experience),
            "lg:w-5/12",
            "md:w-7/12",
            "w-11/12",
        );
        skill.element.classList.add(
            "hover:animate-float-text",
            "text-" + Playground.getColorBasedOnExperience(skill.experience),
        );

        skill.nameSpan.classList.remove("text-gruvbox-black");

        //resetHomepageDeveloperTag();
        Playground.homepageTag.setAttribute("data-content", "Trever");
        Playground.removeHint(skill);
        Playground.enableSkills();
    },

    buildExperienceDiv: (skill) => {
        skill.elementChildExperienceWrap = document.createElement("div");
        skill.elementChildExperienceWrap.classList.add(
            "flex",
            "flex-row",
            "cursor-pointer",
            "p-2",
        );

        skill.elementChildExperienceWrapLabel = document.createElement("div");
        skill.elementChildExperienceWrapLabel.innerHTML =
            "Experience: &nbsp; &nbsp;";
        skill.elementChildExperienceWrapLabel.classList.add(
            "text-gruvbox-gray",
            "mr-4",
        );

        skill.elementChildExperienceWrapLabelExperience =
            document.createElement("div");
        skill.elementChildExperienceWrapLabelExperience.innerText =
            skill.experience;
        skill.elementChildExperienceWrapLabelExperience.classList.add(
            "text-" +
                Playground.getColorBasedOnExperience(skill.experience) +
                "",
        );

        skill.elementChildExperienceWrapLabelExperienceSlash =
            document.createElement("div");
        skill.elementChildExperienceWrapLabelExperienceSlash.innerHTML =
            "&nbsp;/&nbsp;";
        skill.elementChildExperienceWrapLabelExperienceSlash.classList.add(
            "text-gruvbox-white",
        );

        skill.elementChildExperienceWrapLabelExperienceFull =
            document.createElement("div");
        skill.elementChildExperienceWrapLabelExperienceFull.innerText = "100";
        skill.elementChildExperienceWrapLabelExperienceFull.classList.add(
            "text-gruvbox-white",
        );
    },

    removeAllClickListeners: () => {
        Playground.skills.forEach((skill) => {
            skill.element.removeEventListener(
                "mousedown",
                Playground.dragStart,
                false,
            );
            skill.element.removeEventListener(
                "touchstart",
                Playground.dragStart,
                false,
            );
        });
    },

    displayInfoCard: (skill) => {
        Playground.removeAllClickListeners();
        Playground.disableSkills();

        skill.element.style.top = "20%";
        skill.element.style.left = "50%";
        skill.element.style.transform = "translate(-50%, 0)";
        skill.element.style.zIndex = "12";

        skill.element.style.fontSize =
            Playground.getFontSizeBasedOnExperience(100);

        skill.element.classList.remove(
            "hover:animate-float-text",
            "text-" + Playground.getColorBasedOnExperience(skill.experience),
        );

        for (let index = 0; index < 101; index++)
            skill.element.style.setProperty(
                "--experience-percent-" + index,
                skill.experience > index ? index + "%" : skill.experience + "%",
            );

        skill.nameSpan.classList.add("text-gruvbox-black");
        skill.element.classList.add(
            "animate-float-bg",
            "lg:w-5/12",
            "md:w-7/12",
            "w-11/12",
        );
        skill.element.appendChild(skill.elementChild);
        skill.element.appendChild(skill.closeInfoCard);

        if (skill.name != "README.md" && skill.name != "hire me") {
            skill.elementChild.appendChild(skill.elementChildExperienceWrap);
            skill.elementChildExperienceWrap.appendChild(
                skill.elementChildExperienceWrapLabel,
            );
            skill.elementChildExperienceWrap.appendChild(
                skill.elementChildExperienceWrapLabelExperience,
            );
            skill.elementChildExperienceWrap.appendChild(
                skill.elementChildExperienceWrapLabelExperienceSlash,
            );
            skill.elementChildExperienceWrap.appendChild(
                skill.elementChildExperienceWrapLabelExperienceFull,
            );
        }

        skill.elementChild.appendChild(skill.elementChildExcerpt);

        skill.infoShowing = true;
    },

    showHireForm: () => {
        if (Playground.hireOverlay) return;

        Playground.detachResizeListener();

        if (!Playground.playground)
            Playground.playground = document.getElementById("lead");

        if (!Playground.playground)
            Playground.playground = document.getElementById("content");

        if (!Playground.playground) {
            console.warn("Playground container (#lead/#content) not found.");
            return;
        }

        if (typeof document !== "undefined" && document.body) {
            document.body.classList.add("hire-modal-open");
        }

        const overlay = document.createElement("div");
        overlay.classList.add("hire-modal-overlay");
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) Playground.closeHireForm();
        });

        const modal = document.createElement("div");
        modal.classList.add("hire-modal");
        overlay.appendChild(modal);

        const modalHeader = document.createElement("div");
        modalHeader.classList.add("hire-modal-header");
        const closeFormButton = document.createElement("button");
        closeFormButton.type = "button";
        closeFormButton.classList.add("hire-modal-close");
        closeFormButton.setAttribute("aria-label", "Close hire form");
        closeFormButton.innerHTML = "&times;";
        closeFormButton.addEventListener("click", () => Playground.closeHireForm());
        modalHeader.appendChild(closeFormButton);
        modal.appendChild(modalHeader);

        const formWrap = document.createElement("div");
        formWrap.classList.add("hire-modal-body");
        Playground.formWrap = formWrap;
        modal.appendChild(formWrap);

        let hireMeForm = document.createElement("form");
        hireMeForm.id = "hire_me_form";
        hireMeForm.classList.add(
            "flex",
            "flex-col",
            "items-center",
            "gap-4",
            "px-6",
            "pb-6",
            "w-full",
        );

        let formInfo = document.createElement("p");
        formInfo.innerText =
            "First of all, I'm very excited to hear that you are interested in working with me! I love hearing new project ideas, so go ahead and fill out the form below with your contact info, and a brief overview of the project in mind, and I will get back to you asap!";
        formInfo.classList.add("text-gruvbox-white", "text-center", "mb-2");

        let submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.innerText = "Submit";
        submitButton.classList.add(
            "hover:bg-gruvbox-purple",
            "bg-gruvbox-green",
            "text-gruvbox-black",
            "text-2xl",
            "font-bold",
            "px-6",
            "py-3",
            "mt-4",
            "self-center",
        );

        let formTitle = document.createElement("h2");
        formTitle.id = "hire-form-title";
        formTitle.innerText = "hire me";
        formTitle.classList.add(
            "text-gruvbox-green",
            "text-4xl",
            "text-center",
            "mt-2",
        );

        let emailInput = document.createElement("input");
        emailInput.name = "email";
        emailInput.type = "email";
        emailInput.classList.add("w-full", "p-4", "bg-gruvbox-black", "text-gruvbox-white");
        let emailLabel = document.createElement("label");
        emailLabel.innerText = "Email";
        emailLabel.classList.add("text-gruvbox-green", "w-full", "text-left", "mt-4");

        let organizationInput = document.createElement("input");
        organizationInput.name = "name";
        organizationInput.type = "text";
        organizationInput.classList.add("w-full", "p-4", "bg-gruvbox-black", "text-gruvbox-white");
        let organizationLabel = document.createElement("label");
        organizationLabel.classList.add("text-gruvbox-green", "w-full", "text-left", "mt-4");
        organizationLabel.innerText = "Organization";

        let firstNameInput = document.createElement("input");
        firstNameInput.name = "first_name";
        firstNameInput.type = "text";
        firstNameInput.classList.add("w-full", "p-4", "bg-gruvbox-black", "text-gruvbox-white");
        let firstNameLabel = document.createElement("label");
        firstNameLabel.innerText = "First Name";
        firstNameLabel.classList.add("text-gruvbox-green", "w-full", "text-left", "mt-4");

        let lastNameInput = document.createElement("input");
        lastNameInput.name = "last_name";
        lastNameInput.type = "text";
        lastNameInput.classList.add("w-full", "p-4", "bg-gruvbox-black", "text-gruvbox-white");
        let lastNameLabel = document.createElement("label");
        lastNameLabel.innerText = "Last Name";
        lastNameLabel.classList.add("text-gruvbox-green", "w-full", "text-left", "mt-4");

        let phoneInput = document.createElement("input");
        phoneInput.type = "tel";
        phoneInput.classList.add("w-full", "p-4", "bg-gruvbox-black", "text-gruvbox-white");
        //phoneInputpattern = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
        let phoneLabel = document.createElement("label");
        phoneLabel.innerText = "Phone Number";
        phoneLabel.classList.add("text-gruvbox-green", "w-full", "text-left", "mt-4");

        let descriptionInput = document.createElement("textarea");
        descriptionInput.name = "description";
        descriptionInput.classList.add("w-full", "p-4", "bg-gruvbox-black", "text-gruvbox-white");
        descriptionInput.style.minHeight = "8rem";
        let descriptionLabel = document.createElement("label");
        descriptionLabel.innerText = "Description";
        descriptionLabel.classList.add("text-gruvbox-green", "w-full", "text-left", "mt-4");

        Playground.playground.classList.remove("touch-action-none");

        Playground.hireOverlay = overlay;
        document.body.appendChild(overlay);
        modal.setAttribute("aria-labelledby", formTitle.id);
        const handleKeydown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                Playground.closeHireForm();
            }
        };
        Playground.hireKeyListener = handleKeydown;
        document.addEventListener("keydown", handleKeydown);
        if (Playground.playground) {
            Playground.playground.dataset.hireModalShown = "true";
        }
        if (typeof window !== "undefined") {
            window.requestAnimationFrame(() => {
                closeFormButton.focus();
            });
        }
        formWrap.appendChild(hireMeForm);

        hireMeForm.appendChild(formTitle);
        hireMeForm.appendChild(formInfo);
        hireMeForm.appendChild(organizationLabel);
        hireMeForm.appendChild(organizationInput);
        hireMeForm.appendChild(firstNameLabel);
        hireMeForm.appendChild(firstNameInput);
        hireMeForm.appendChild(lastNameLabel);
        hireMeForm.appendChild(lastNameInput);
        hireMeForm.appendChild(emailLabel);
        hireMeForm.appendChild(emailInput);
        hireMeForm.appendChild(phoneLabel);
        hireMeForm.appendChild(phoneInput);
        hireMeForm.appendChild(descriptionLabel);
        hireMeForm.appendChild(descriptionInput);
        hireMeForm.appendChild(submitButton);

        submitButton.onclick = function (event) {
            submitButton.disabled = true;
            event = event || window.event;

            event.preventDefault();

            if (firstNameLabel.classList.contains("text-gruvbox-red")) {
                firstNameLabel.classList.remove("text-gruvbox-red");
                firstNameLabel.classList.add("text-gruvbox-green");
                firstNameLabel.innerText = "First Name";
            }
            if (lastNameLabel.classList.contains("text-gruvbox-red")) {
                lastNameLabel.classList.remove("text-gruvbox-red");
                lastNameLabel.classList.add("text-gruvbox-green");
                lastNameLabel.innerText = "Last Name";
            }
            if (emailLabel.classList.contains("text-gruvbox-red")) {
                emailLabel.classList.remove("text-gruvbox-red");
                emailLabel.classList.add("text-gruvbox-green");
                emailLabel.innerText = "Last Name";
            }
            if (formInfo.classList.contains("text-gruvbox-yellow")) {
                formInfo.classList.remove("text-gruvbox-orange");
                formInfo.classList.remove("text-gruvbox-green");
            }

            let hireMeForm = document.getElementById("hire_me_form");
            // console.log(hireMeForm[0])
            let data = new FormData(hireMeForm);
            // console.log(data)

            let csrf_token = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");
            let url = "/developer";

            fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json, text-plain, */*",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": csrf_token,
                },
                method: "POST",
                credentials: "same-origin",
                body: JSON.stringify({
                    first_name: firstNameInput.value,
                    last_name: lastNameInput.value,
                    organization: organizationInput.value,
                    phone: phoneInput.value,
                    description: descriptionInput.value,
                    email: emailInput.value,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.errors) {
                        if (data.errors["first_name"]) {
                            firstNameLabel.classList.remove(
                                "text-gruvbox-green",
                            );
                            firstNameLabel.innerText = "First Name *required";
                            firstNameLabel.classList.add("text-gruvbox-red");
                        }
                        if (data.errors["last_name"]) {
                            lastNameLabel.classList.remove(
                                "text-gruvbox-green",
                            );
                            lastNameLabel.innerText = "Last Name *required";
                            lastNameLabel.classList.add("text-gruvbox-red");
                        }
                        if (
                            data.errors["email"] &&
                            data.errors["email"][0] !==
                                "The email has already been taken."
                        ) {
                            emailLabel.classList.remove("text-gruvbox-green");
                            emailLabel.innerText = "Email *required";
                            emailLabel.classList.add("text-gruvbox-red");
                        }
                        if (
                            data.errors["email"] &&
                            data.errors["email"][0] ==
                                "The email has already been taken."
                        ) {
                            formInfo.classList.remove("text-gruvbox-green");
                            formInfo.classList.add("text-gruvbox-orange");
                            formInfo.innerHTML =
                                '<span class="text-gruvbox-yellow">Oh, ' +
                                (firstNameInput.value.length > 0
                                    ? firstNameInput.value + ","
                                    : ",") +
                                " it looks like you have already contacted me. I will get to reviewing it right away!</span>";
                        }
                        submitButton.removeAttribute("disabled");
                    }
                    if (data.status == "ok") {
                        formWrap.removeChild(hireMeForm);

                        let formInfo = document.createElement("p");
                        formInfo.innerText = data.message;
                        formInfo.classList.add("text-gruvbox-white", "mb-4");

                        formWrap.appendChild(formInfo);
                    }
                })
                .catch((errors) => {
                    let formInfo = document.createElement("p");
                    formInfo.innerText = errors.message;
                    formInfo.classList.add("text-gruvbox-red", "mb-4");

                    formWrap.appendChild(formInfo);
                });
        };
    },

    closeHireForm: () => {
        if (typeof document !== "undefined" && document.body) {
            document.body.classList.remove("hire-modal-open");
        }

        if (Playground.hireOverlay) {
            Playground.hireOverlay.remove();
            Playground.hireOverlay = null;
        }

        if (Playground.hireKeyListener) {
            document.removeEventListener("keydown", Playground.hireKeyListener);
            Playground.hireKeyListener = null;
        }

        Playground.formWrap = null;
        Playground.attachResizeListener();
    },
};

window.Playground = Playground;
//export { Playground };
