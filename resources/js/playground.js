const POINTER_OPTS = { passive: false };

const Playground = {
    initialized: false,
    playground: null,
    homepageTag: null,
    pageTitle: null,
    skills: [],
    fontScale: 25,
    placedSkills: [],
    speedLimit: 12,
    homepageTagHtml: false,
    requestAnimationFrameID: null,
    originalSkills: [],
    playfieldBounds: null,
    resizeTimeoutId: null,

    createSkillState: (skill) => {
        const experience = Number(skill && skill.experience);

        return {
            ...skill,
            experience: Number.isFinite(experience) ? experience : 0,
            element: null,
            nameSpan: null,
            active: false,
            isPositioned: false,
            currentX: 0,
            currentY: 0,
            initialX: undefined,
            initialY: undefined,
            xOffset: 0,
            yOffset: 0,
        };
    },

    normalizeSkills: (skills) => {
        if (!Array.isArray(skills)) {
            return [];
        }

        const seenIds = new Set();
        const seenNames = new Set();
        const normalized = [];

        for (const skill of skills) {
            if (!skill) continue;

            const hasId = skill.id !== undefined && skill.id !== null;
            const normalizedName = typeof skill.name === "string"
                ? skill.name.trim().toLowerCase()
                : null;

            if (hasId && seenIds.has(skill.id)) {
                continue;
            }

            if (normalizedName && seenNames.has(normalizedName)) {
                continue;
            }

            if (hasId) seenIds.add(skill.id);
            if (normalizedName) seenNames.add(normalizedName);

            normalized.push({ ...skill });
        }

        return normalized;
    },

    shuffleArray: (array) => {
        for (let index = array.length - 1; index > 0; index--) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
        }
        return array;
    },

    updateSkillFontSizes: () => {
        Playground.skills.forEach((skill) => {
            if (skill.element) {
                skill.element.style.fontSize =
                    Playground.getFontSizeBasedOnExperience(skill.experience);
            }
        });
    },

    setup({ playground, homepageTag, pageTitle }) {
        Playground.playground = playground || Playground.playground;
        Playground.homepageTag = homepageTag || Playground.homepageTag;
        Playground.pageTitle = pageTitle || Playground.pageTitle;
        if (!Playground.homepageTag) {
            Playground.homepageTag =
                document.querySelector("name-element") || document.createElement("div");
        }
        if (!Playground.pageTitle) {
            Playground.pageTitle =
                document.querySelector("#title > h1") || document.createElement("h1");
        }
        if (Playground.playground) {
            Playground.playground.style.touchAction = 'none';
            Playground.playground.style.position = Playground.playground.style.position || 'relative';
        }
        Playground.playgroundLoading = null;
    },

    detachResizeListener: () => {
        if (Playground.resizeHandler) {
            window.removeEventListener('resize', Playground.resizeHandler);
            Playground.resizeHandler = null;
        }
        if (Playground.resizeTimeoutId) {
            clearTimeout(Playground.resizeTimeoutId);
            Playground.resizeTimeoutId = null;
        }
    },

    attachResizeListener: () => {
        Playground.detachResizeListener();
        Playground.resizeHandler = () => {
            if (!Playground.playground || !Playground.playground.offsetParent) {
                return;
            }
            if (Playground.resizeTimeoutId) {
                clearTimeout(Playground.resizeTimeoutId);
            }
            Playground.showLoadingIndicator();
            Playground.resizeTimeoutId = setTimeout(() => {
                Playground.reset("resize");
            }, 300);
        };
        window.addEventListener('resize', Playground.resizeHandler, { passive: true });
    },

    clearPlayground: () => {
        if (!Playground.playground) {
            return;
        }
        while (Playground.playground.firstChild) {
            Playground.playground.removeChild(Playground.playground.firstChild);
        }
    },

    showLoadingIndicator: () => {
        if (!Playground.playground || Playground.loadingVisible) {
            return;
        }

        Playground.clearPlayground();

        const loader = document.createElement('div');
        loader.id = '__playground-loading';
        loader.classList.add(
            'absolute',
            'inset-0',
            'flex',
            'items-center',
            'justify-center',
            'bg-gruvbox-black/80',
            'backdrop-blur-sm'
        );

        const inner = document.createElement('div');
        inner.classList.add(
            'flex',
            'flex-col',
            'items-center',
            'justify-center',
            'space-y-4'
        );

        const spinner = document.createElement('div');
        spinner.classList.add(
            'h-10',
            'w-10',
            'border-4',
            'border-gruvbox-yellow/40',
            'border-t-gruvbox-yellow',
            'rounded-full',
            'animate-spin'
        );

        const text = document.createElement('span');
        text.classList.add('text-gruvbox-white', 'text-lg');
        text.innerText = 'Rearranging skills…';

        inner.appendChild(spinner);
        inner.appendChild(text);
        loader.appendChild(inner);

        Playground.playground.appendChild(loader);
        Playground.loadingVisible = true;
    },

    hideLoadingIndicator: () => {
        if (!Playground.playground) {
            return;
        }

        const loader = Playground.playground.querySelector('#__playground-loading');
        if (loader) {
            Playground.playground.removeChild(loader);
        }
        Playground.loadingVisible = false;
    },

    computePlayfieldBounds: () => {
        if (!Playground.playground) {
            return null;
        }

        const rect = Playground.playground.getBoundingClientRect();
        const styles = window.getComputedStyle(Playground.playground);

        const paddingLeft = parseFloat(styles.paddingLeft) || 0;
        const paddingRight = parseFloat(styles.paddingRight) || 0;
        const paddingTop = parseFloat(styles.paddingTop) || 0;
        const paddingBottom = parseFloat(styles.paddingBottom) || 0;

        let width =
            rect.width && rect.width > 0
                ? rect.width - paddingLeft - paddingRight
                : Playground.playground.clientWidth - paddingLeft - paddingRight;
        let height =
            rect.height && rect.height > 0
                ? rect.height - paddingTop - paddingBottom
                : Playground.playground.clientHeight - paddingTop - paddingBottom;

        if (!width || width <= 0) {
            width = window.innerWidth - rect.left - paddingLeft - paddingRight - 24;
        }

        if (!height || height <= 0) {
            const footer = document.getElementById("footer");
            const footerHeight = footer
                ? footer.getBoundingClientRect().height
                : 0;
            height =
                window.innerHeight -
                rect.top -
                footerHeight -
                paddingTop -
                paddingBottom -
                48;
        }

        width = Math.max(width, 240);
        height = Math.max(height, 240);

        Playground.playground.style.minHeight = `${height + paddingTop + paddingBottom}px`;
        Playground.playground.style.position =
            Playground.playground.style.position || "relative";

        return {
            width,
            height,
            paddingLeft,
            paddingTop,
        };
    },

    destroy: () => {
        Playground.detachResizeListener();

        if (!Playground.playground) {
            return;
        }

        Playground.reset('destroy');
        Playground.playground = null;
        Playground.homepageTag = null;
        Playground.pageTitle = null;
        Playground.initialized = false;
        Playground.playfieldBounds = null;
        Playground.originalSkills = [];
        Playground.skills = [];
    },

    init: (data) => {
        if (!Playground.playground || !Playground.homepageTag || !Playground.pageTitle) {
            const fallbackPlayground =
                Playground.playground ||
                document.getElementById("lead") ||
                document.getElementById("playground");
            const fallbackHomepageTag =
                Playground.homepageTag || document.querySelector("name-element");
            const fallbackTitle =
                Playground.pageTitle || document.querySelector("#title > h1");

            if (fallbackPlayground) {
                Playground.setup({
                    playground: fallbackPlayground,
                    homepageTag: fallbackHomepageTag,
                    pageTitle: fallbackTitle,
                });
            }

            if (!Playground.playground) {
                return;
            }
        }

        if (Array.isArray(data) && data.length) {
            Playground.originalSkills = Playground.normalizeSkills(data).map(
                (skill) => {
                    const experience = Number(skill && skill.experience);
                    return {
                        ...skill,
                        experience: Number.isFinite(experience)
                            ? experience
                            : 0,
                    };
                },
            );
        }

        if (!Playground.originalSkills.length) {
            return;
        }

        Playground.detachResizeListener();
        Playground.clearPlayground();

        Playground.initialized = true;
        Playground.fontScale = 25;
        Playground.placedSkills = [];
        Playground.requestAnimationFrameID = null;

        Playground.skills = Playground.normalizeSkills(
            Playground.originalSkills,
        ).map(Playground.createSkillState);

        Playground.shuffleArray(Playground.skills);

        for (const skill of Playground.skills) {
            skill.element = document.createElement("div");
            Playground.styleElement(skill);
            Playground.playground.appendChild(skill.element);
            Playground.addClickListener(skill);
        }

        const layoutSucceeded = Playground.layoutSkills();

        if (!layoutSucceeded) {
            Playground.renderFallbackLayout(true);
            return;
        }

        Playground.attachResizeListener();
        Playground.hideLoadingIndicator();
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
        skill.element.classList.add(
            "hover:animate-float-text",
            "text-bold",
            "text-center",
            "select-none",
            "cursor-pointer",
        );
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
                POINTER_OPTS,
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
                POINTER_OPTS,
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

    layoutSkills: () => {
        const MAX_SCALE_ATTEMPTS = 8;
        const MAX_POSITION_ATTEMPTS = 250;
        const SAFETY_PADDING = 8;

        for (let attempt = 0; attempt <= MAX_SCALE_ATTEMPTS; attempt++) {
            const bounds = Playground.computePlayfieldBounds();
            if (!bounds) {
                return false;
            }

            Playground.playfieldBounds = bounds;
            Playground.updateSkillFontSizes();

            const placements = [];
            let failed = false;

            for (const skill of Playground.skills) {
                const width = skill.element.offsetWidth;
                const height = skill.element.offsetHeight;

                if (!width || !height) {
                    failed = true;
                    break;
                }

                const maxX = Math.max(bounds.width - width - SAFETY_PADDING, 0);
                const maxY = Math.max(bounds.height - height - SAFETY_PADDING, 0);

                let placed = false;
                for (let positionAttempt = 0; positionAttempt < MAX_POSITION_ATTEMPTS; positionAttempt++) {
                    const x =
                        bounds.paddingLeft +
                        (maxX > 0 ? Math.random() * maxX : 0);
                    const y =
                        bounds.paddingTop +
                        (maxY > 0 ? Math.random() * maxY : 0);

                    const candidate = {
                        name: skill.name,
                        x: x,
                        y: y,
                        width: width + SAFETY_PADDING,
                        height: height + SAFETY_PADDING,
                    };

                    const overlaps = placements.some((placed) =>
                        Playground.skillsOverlap(candidate, placed),
                    );

                    if (!overlaps) {
                        placements.push(candidate);
                        skill.element.style.left = `${x}px`;
                        skill.element.style.top = `${y}px`;
                        skill.originalLeft = `${x}px`;
                        skill.originalTop = `${y}px`;
                        skill.isPositioned = true;
                        Playground.addRandomFloatEffect(skill);
                        placed = true;
                        break;
                    }
                }

                if (!placed) {
                    failed = true;
                    break;
                }
            }

            if (!failed) {
                Playground.placedSkills = placements.map((placement) => ({
                    name: placement.name,
                    x: placement.x,
                    y: placement.y,
                    width: placement.width,
                    height: placement.height,
                }));

                const bottoms = placements.map(
                    (placement) => placement.y + placement.height,
                );
                const maxBottom = bottoms.length
                    ? Math.max(...bottoms)
                    : bounds.height;

                Playground.playground.style.minHeight = `${Math.ceil(
                    Math.max(maxBottom + SAFETY_PADDING, bounds.height),
                )}px`;

                return true;
            }

            Playground.fontScale += 3;
        }

        return false;
    },

    reset: (hire) => {
        hire = hire || false;

        if (Playground.requestAnimationFrameID !== null) {
            cancelAnimationFrame(Playground.requestAnimationFrameID);
            Playground.requestAnimationFrameID = null;
        }

        Playground.placedSkills = [];

        if (Playground.skills && Playground.skills.length) {
            Playground.skills.forEach((skill) => {
                if (!skill || !skill.element) return;

                skill.element.removeEventListener(
                    "pointerdown",
                    Playground.dragStart,
                    POINTER_OPTS,
                );
                skill.element.removeEventListener(
                    "pointerup",
                    Playground.dragEnd,
                    POINTER_OPTS,
                );
                skill.element.removeEventListener(
                    "pointermove",
                    Playground.drag,
                    POINTER_OPTS,
                );

                if (Playground.playground?.contains(skill.element)) {
                    Playground.playground.removeChild(skill.element);
                }

                delete skill.element;
            });
        }

        Playground.clearPlayground();

        if (Playground.playground) {
            Playground.playground.style.touchAction =
                hire === "hire" ? "auto" : "none";
        }

        if (hire === "hire") {
            Playground.buildForm();
            return;
        }

        if (hire === "destroy") {
            Playground.initialized = false;
            return;
        }

        if (!Playground.originalSkills.length) {
            return;
        }

        Playground.init();
    },

    resetSkillPosition: (skill) => {
        const placed = Playground.placedSkills.find(
            (item) => item.name === skill.name,
        );

        if (!placed) {
            return;
        }

        skill.currentX = 0;
        skill.currentY = 0;
        skill.initialX = undefined;
        skill.initialY = undefined;
        skill.xOffset = 0;
        skill.yOffset = 0;

        Playground.setTranslate(0, 0, skill.element);

        delete skill.pointerId;
        delete skill.prevClientX;
        delete skill.prevClientY;
    },

    getSkillBasedOnName: (name) => {
        for (const skill of Playground.skills) {
            if (skill.name === name) {
                return skill;
            }
        }
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
            POINTER_OPTS,
        );
        skill.element.style.touchAction = 'none';
    },

    renderFallbackLayout: (forceRebuild = false) => {
        if (!Playground.playground) {
            return;
        }

        Playground.clearPlayground();
        Playground.playground.style.position = 'relative';
        Playground.playground.style.touchAction = 'none';
        Playground.playground.style.minHeight = 'auto';

        const rawSourceSkills =
            forceRebuild || !Playground.skills.length
                ? Playground.originalSkills
                : Playground.skills;

        const sourceSkills = Playground.normalizeSkills(rawSourceSkills);

        if (!Array.isArray(sourceSkills) || !sourceSkills.length) {
            return;
        }

        Playground.skills = sourceSkills.map((skill) =>
            Playground.createSkillState(skill),
        );

        Playground.updateSkillFontSizes();

        Playground.placedSkills = [];

        const rootRect = Playground.playground.getBoundingClientRect();
        const computedStyles = window.getComputedStyle(Playground.playground);
        const paddingLeft = parseFloat(computedStyles.paddingLeft) || 0;
        const paddingTop = parseFloat(computedStyles.paddingTop) || 0;
        const gutter = 16;
        const columns = rootRect.width > 1200 ? 4 : rootRect.width > 900 ? 3 : 2;
        const columnWidth = Math.max((rootRect.width - gutter * (columns - 1)) / columns, 140);
        const rowHeight = 96;

        Playground.skills.forEach((skill, index) => {
            skill.element = document.createElement('div');
            Playground.styleElement(skill);

            const row = Math.floor(index / columns);
            const col = index % columns;
            skill.element.style.position = 'absolute';
            const leftPx = col * (columnWidth + gutter) + paddingLeft;
            const topPx = row * (rowHeight + gutter) + paddingTop;
            const left = `${leftPx}px`;
            const top = `${topPx}px`;
            skill.element.style.width = `${columnWidth}px`;
            skill.element.style.left = left;
            skill.element.style.top = top;
            skill.originalLeft = left;
            skill.originalTop = top;
            skill.isPositioned = true;

            Playground.playground.appendChild(skill.element);
            Playground.addClickListener(skill);

            const renderedWidth =
                skill.element.offsetWidth || columnWidth;
            const renderedHeight =
                skill.element.offsetHeight || rowHeight;

            Playground.placedSkills.push({
                name: skill.name,
                x: leftPx,
                y: topPx,
                width: renderedWidth,
                height: renderedHeight,
            });
        });

        const rows = Math.ceil(Playground.skills.length / columns);
        Playground.playground.style.minHeight = `${rows * (rowHeight + gutter) + rowHeight}px`;
        Playground.playfieldBounds = null;
        Playground.attachResizeListener();
    },

    dragStart: (e) => {
        e.preventDefault();

        let skill = Playground.getSkillBasedOnName(e.target.id);
        if (!skill || !skill.element) {
            return;
        }

        if (Playground.homepageTag) {
            Playground.homepageTag.setAttribute("data-content", skill.name);
            Playground.homepageTag.classList.add(
                "border",
                "border-dashed",
                "border-4",
            );
        }
        if (Playground.pageTitle) {
            Playground.pageTitle.innerText = "Drag & Drop";
        }

        skill.pointerId = e.pointerId;
        try {
            skill.element.setPointerCapture(e.pointerId);
        } catch (error) {
            /* ignore pointer capture errors */
        }
        skill.element.addEventListener(
            "pointerup",
            Playground.dragEnd,
            POINTER_OPTS,
        );
        skill.element.addEventListener(
            "pointermove",
            Playground.dragElement,
            POINTER_OPTS,
        );

        skill.element.style.zIndex = "11";
        skill.element.classList.remove("cursor-pointer");
        skill.element.classList.add("cursor-move");

        if (skill.heldCounter && skill.heldCounter > 2) {
            clearInterval(skill.heldCounter);
        }

        const { clientX = 0, clientY = 0 } = e;
        skill.initialX = clientX - skill.xOffset;
        skill.initialY = clientY - skill.yOffset;

        skill.dragActive = e.target === skill.element;
    },

    dragEnd: (e) => {
        let skill = Playground.getSkillBasedOnName(e.target.id);

        if (skill && skill.element) {
            try {
                if (e.pointerId !== undefined) {
                    skill.element.releasePointerCapture(e.pointerId);
                }
            } catch (error) {
                // ignore release errors
            }

            skill.element.classList.remove("cursor-move");
            skill.element.removeEventListener("pointerup", Playground.dragEnd, POINTER_OPTS);
            skill.element.removeEventListener(
                "pointermove",
                Playground.dragElement,
                POINTER_OPTS,
            );

            skill.element.style.zIndex = "1";
            skill.dragActive = false;
            skill.infoShowing = false;

            if (skill.name == "hire me") Playground.removeHireHint(skill);

            Playground.removeHint(skill);
            Playground.resetSkillPosition(skill);

            if (skill.atTarget) {
                //Playground.homepageTag.classList.add("text-gruvbox-green");

                if (skill.name == "hire me") {
                    Playground.reset("hire");
                } else if (skill.name == "reset();") {
                    Playground.reset();
                } else {
                    Playground.displayInfoCard(skill);
                }

                skill.atTarget = false;
            } else {
                //resetHomepageDeveloperTag();
            }
            //Playground.homepageTag.setAttribute("data-content", "Trever");
            if (Playground.pageTitle) {
                Playground.pageTitle.innerText = "Hi. I'm";
            }
            if (Playground.homepageTag) {
                Playground.homepageTag.classList.remove(
                    "border",
                    "border-dashed",
                    "border-4",
                );
            }
            //    "text-gruvbox-gray",
            //    "border-gruvbox-green",
            //    "shadow-inner",
            //);
        }

        if (Playground.requestAnimationFrameID !== null) {
            cancelAnimationFrame(Playground.requestAnimationFrameID);
            Playground.requestAnimationFrameID = null;
        }
    },

    dragElement: (e) => {
        if (Playground.requestAnimationFrameID !== null) return;

        Playground.requestAnimationFrameID = window.requestAnimationFrame(() => {
            Playground.requestAnimationFrameID = null;
            Playground.drag(e);
        });
    },

    drag: (e) => {
        e.preventDefault();

        let skill = Playground.getSkillBasedOnName(e.target.id);

        if (skill && skill.dragActive) {
            if (skill.pointerId !== undefined && e.pointerId !== undefined && e.pointerId !== skill.pointerId) {
                return;
            }
            if (!skill.elementChild) Playground.buildInfoCard(skill);

            let isForm = Playground.draggingEvents(e, skill);

            const { clientX = 0, clientY = 0 } = e;
            skill.currentX = clientX - skill.initialX;
            skill.currentY = clientY - skill.initialY;

            if (!isForm)
                Playground.setTranslate(
                    skill.currentX,
                    skill.currentY,
                    skill.element,
                );
        }
    },

    draggingEvents: (e, skill) => {
        if (!Playground.homepageTag) {
            return false;
        }

        if (
            Playground.skillsOverlap(
                e.target.getBoundingClientRect(),
                Playground.homepageTag.getBoundingClientRect(),
            )
        ) {
            skill.atTarget = true;
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
        } else {
            Playground.skillActive = skill;
            skill.atTarget = false;
            Playground.homepageTag.classList.remove("border-gruvbox-green");
        }
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

    handleShakeEvents: (e, skill) => {
        const { clientX = 0, clientY = 0 } = e;
        const movementX = clientX - (skill.prevClientX ?? clientX);
        const movementY = clientY - (skill.prevClientY ?? clientY);
        skill.prevClientX = clientX;
        skill.prevClientY = clientY;

        if (movementX > Playground.speedLimit) {
            skill.elementMovementRightExceeded = true;
            skill.elementMovementXTimeout = setTimeout(function () {
                skill.elementMovementRightExceeded = false;
            }, 200);
        }

        if (movementX < -Playground.speedLimit) {
            skill.elementMovementLeftExceeded = true;
            skill.elementMovementXTimeout = setTimeout(function () {
                skill.elementMovementLeftExceeded = false;
            }, 200);
        }

        if (skill.name == "hire me") {
            if (movementY > Playground.speedLimit - 4) {
                skill.elementMovementUpExceeded = true;
                skill.elementMovementYTimeout = setTimeout(function () {
                    skill.elementMovementUpExceeded = false;
                }, 200);
            }

            if (movementY < Playground.speedLimit - 4) {
                skill.elementMovementDownExceeded = true;
                skill.elementMovementYTimeout = setTimeout(function () {
                    skill.elementMovementDownExceeded = false;
                }, 200);
            }

            if (
                skill.elementMovementDownExceeded &&
                skill.elementMovementUpExceeded &&
                skill.infoShowing
            ) {
                e.stopPropagation();
                Playground.dragEnd(e);
                Playground.reset("hire");
                return false;
            }
        }

        if (skill.name == "GitHub") {
            if (movementY > Playground.speedLimit - 4) {
                skill.elementMovementUpExceeded = true;
                skill.elementMovementYTimeout = setTimeout(function () {
                    skill.elementMovementUpExceeded = false;
                }, 200);
            }

            if (movementY < Playground.speedLimit - 4) {
                skill.elementMovementDownExceeded = true;
                skill.elementMovementYTimeout = setTimeout(function () {
                    skill.elementMovementDownExceeded = false;
                }, 200);
            }

            if (
                skill.elementMovementDownExceeded &&
                skill.elementMovementUpExceeded &&
                skill.infoShowing
            ) {
                e.stopPropagation();
                Playground.dragEnd(e);
                window.open("https://github.com/revertcreations");
                return false;
            }
        }

        if (
            skill.elementMovementLeftExceeded &&
            skill.elementMovementRightExceeded &&
            !skill.infoShowing
        ) {
            if (skill.name == "reset();") {
                e.stopPropagation();
                Playground.dragEnd(e);
                Playground.reset("manual");
                return false;
            }

            Playground.displayInfoCard(skill);
            // Playground.removeHint(skill)
        }
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
        skill.elementChildExcerpt.innerHTML = skill.excerpt;
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
        skill.closeInfoCard.innerHTML =
            "<span onclick='Playground.closeInfoCard(" +
            '"' +
            skill.name +
            '"' +
            ")' class='text-gruvbox-red hover:text-red-400'>&times;</span>";
    },

    closeInfoCard: (skill_name) => {
        let skill = Playground.getSkillBasedOnName(skill_name);

        skill.element.removeChild(skill.elementChild);
        skill.element.removeChild(skill.closeInfoCard);

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
        if (Playground.homepageTag) {
            Playground.homepageTag.setAttribute("data-content", "Trever");
        }
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
                "pointerdown",
                Playground.dragStart,
                POINTER_OPTS,
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

    buildForm: () => {
        window.onresize = false;

        let closeForm = document.createElement("div");
        closeForm.classList.add("cursor-pointer", "text-6xl", "text-right");
        closeForm.innerHTML =
            "<span onclick='Playground.reset()' class='text-gruvbox-red hover:text-red-400'>&times;</span>";

        let formWrap = document.createElement("div");
        formWrap.classList.add("m-auto", "lg:w-5/12", "md:w-7/12", "w-11/12", "overflow-y-auto");

        let hireMeForm = document.createElement("form");
        hireMeForm.id = "hire_me_form";
        hireMeForm.classList.add("flex", "flex-col", "m-8");

        let formInfo = document.createElement("p");
        formInfo.innerText =
            "First of all, I'm very excited to hear that you are interested in working with me! I love hearing new project ideas, so go ahead and fill out the form below with your contact info, and a brief overview of the project in mind, and I will get back to you asap!";
        formInfo.classList.add("text-gruvbox-white", "mb-4");

        let submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.innerText = "Submit";
        submitButton.classList.add(
            "hover:bg-gruvbox-purple",
            "bg-gruvbox-green",
            "text-gruvbox-black",
            "text-2xl",
            "font-bold",
            "p-4",
            "mt-4",
            "mb-4",
        );

        let formTitle = document.createElement("h2");
        formTitle.innerText = "hire me";
        formTitle.classList.add(
            "text-gruvbox-green",
            "text-4xl",
            "mt-4",
            "mb-4",
        );

        let emailInput = document.createElement("input");
        emailInput.name = "email";
        emailInput.type = "email";
        emailInput.classList.add("p-4", "m-4");
        let emailLabel = document.createElement("label");
        emailLabel.innerText = "Email";
        emailLabel.classList.add("text-gruvbox-green");

        let organizationInput = document.createElement("input");
        organizationInput.name = "name";
        organizationInput.type = "text";
        organizationInput.classList.add("p-4", "m-4");
        let organizationLabel = document.createElement("label");
        organizationLabel.classList.add("text-gruvbox-green");
        organizationLabel.innerText = "Organization";

        let firstNameInput = document.createElement("input");
        firstNameInput.name = "first_name";
        firstNameInput.type = "text";
        firstNameInput.classList.add("p-4", "m-4");
        let firstNameLabel = document.createElement("label");
        firstNameLabel.innerText = "First Name";
        firstNameLabel.classList.add("text-gruvbox-green");

        let lastNameInput = document.createElement("input");
        lastNameInput.name = "last_name";
        lastNameInput.type = "text";
        lastNameInput.classList.add("p-4", "m-4");
        let lastNameLabel = document.createElement("label");
        lastNameLabel.innerText = "Last Name";
        lastNameLabel.classList.add("text-gruvbox-green");

        let phoneInput = document.createElement("input");
        phoneInput.type = "tel";
        phoneInput.classList.add("p-4", "m-4");
        //phoneInputpattern = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
        let phoneLabel = document.createElement("label");
        phoneLabel.innerText = "Phone Number";
        phoneLabel.classList.add("text-gruvbox-green");

        let descriptionInput = document.createElement("textarea");
        descriptionInput.name = "description";
        descriptionInput.classList.add("p-4", "m-4");
        let descriptionLabel = document.createElement("label");
        descriptionLabel.innerText = "Description";
        descriptionLabel.classList.add("text-gruvbox-green");

        if (Playground.playground) {
            Playground.playground.style.touchAction = 'auto';
        }

        Playground.playground.appendChild(formWrap);
        formWrap.appendChild(closeForm);
        formWrap.appendChild(hireMeForm);

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
};

export function bootPlayground(skills) {
    const playgroundRoot = document.getElementById('lead');
    const homepageTag = document.querySelector('name-element');
    const title = document.querySelector('#title > h1');

    if (!playgroundRoot || !Array.isArray(skills)) {
        return null;
    }

    Playground.destroy();
    Playground.setup({ playground: playgroundRoot, homepageTag, pageTitle: title });
    Playground.init(skills);

    if (typeof window !== 'undefined') {
        window.Playground = Playground;
    }

    return Playground;
}

export function destroyPlayground() {
    Playground.destroy();
}

if (typeof window !== 'undefined') {
    window.Playground = Playground;
}

export { Playground };
