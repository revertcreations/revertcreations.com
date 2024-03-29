/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!************************************!*\
  !*** ./resources/js/playground.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var _this = undefined;
var Playground = {
  initialized: false,
  playground: document.getElementById("content"),
  homepageTag: document.getElementsByName("name-element")[0],
  skills: [],
  needsReset: false,
  fontScale: 25,
  placedSkills: [],
  placedSkillAttempts: 0,
  speedLimit: 12,
  homepageTagHtml: false,
  requestAnimationFrameID: null,
  init: function init(data) {
    console.log('init!');
    Playground.initialized = true;
    Playground.skills = data;
    while (Playground.playground.firstChild) Playground.playground.removeChild(Playground.playground.firstChild);
    for (var skill in Playground.skills) {
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
      Playground.styleElement(Playground.skills[skill]);
      Playground.playground.appendChild(Playground.skills[skill].element);
      if (!Playground.positionElement(Playground.skills[skill])) break;
      Playground.addClickListener(Playground.skills[skill]);
    }
    if (Playground.needsReset) Playground.reset("exceeded");
    var resizeTimeout;
    window.onresize = function () {
      if (Playground.playground.offsetParent) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(Playground.reset("resize"), 1000);
      }
    };
  },
  styleElement: function styleElement(skill) {
    skill.nameSpan = document.createElement("span");
    skill.nameSpan.classList.add("pointer-events-none");
    skill.nameSpan.innerText = skill.name;
    skill.element.appendChild(skill.nameSpan);
    skill.element.id = skill.name;
    skill.element.style.position = "absolute";
    skill.element.style.color = Playground.getColorBasedOnExperience(skill.experience, "hex");
    skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(skill.experience);
    skill.element.style.setProperty("--experience-color", Playground.getColorBasedOnExperience(skill.experience, "hex"));
    skill.element.classList.add("hover:animate-float-text", "text-bold", "text-center", "select-none", "cursor-pointer");
  },
  disableSkills: function disableSkills() {
    Playground.skills.forEach(function (skill) {
      skill.element.classList.remove("text-" + Playground.getColorBasedOnExperience(skill.experience), "hover:animate-float-text", "cursor-pointer");
      skill.element.classList.add("text-gruvbox-black");
      if (skill.name != Playground.skillActive.name) skill.element.classList.add("animate-blur-text");
      skill.element.removeEventListener("mousedown", Playground.dragStart, false);
      skill.element.removeEventListener("touchstart", Playground.dragStart, false);
    });
  },
  enableSkills: function enableSkills() {
    Playground.skills.forEach(function (skill) {
      setTimeout(function () {
        skill.element.classList.remove("animate-sharpen-text");
        skill.element.classList.add("hover:animate-float-text");
      }, 800);
      skill.element.classList.remove("text-gruvbox-black", "animate-blur-text");
      skill.element.classList.add("text-" + Playground.getColorBasedOnExperience(skill.experience), "cursor-pointer", "animate-sharpen-text");
      skill.element.addEventListener("mousedown", Playground.dragStart, false);
      skill.element.addEventListener("touchstart", Playground.dragStart, false);
    });
  },
  addRandomFloatEffect: function addRandomFloatEffect(skill) {
    var animationTime = Math.random() * (15 - 2) + 2 + "s";
    var x = Math.random() * (10 - -10) + -10 + "px";
    var y = Math.random() * (10 - -10) + -10 + "px";
    skill.element.style.setProperty("--float-animation-time", animationTime);
    skill.element.style.setProperty("--float-fifty-percent-y", x);
    skill.element.style.setProperty("--float-fifty-percent-x", y);
  },
  positionElement: function positionElement(skill) {
    while (!skill.isPositioned) {
      if (Playground.placedSkillAttempts > 100) {
        Playground.fontScale = Playground.fontScale + 2;
        Playground.needsReset = true;
        return false;
      }
      var width = skill.element.offsetWidth;
      var height = skill.element.offsetHeight;
      var textXBound = Math.random() * (Playground.playground.offsetWidth - width - width / 2) + width / 2;
      var textYBound = Math.random() * (Playground.playground.offsetHeight - height - height / 2) + height / 2;
      var cords = {
        width: width,
        height: height,
        x: textXBound,
        y: textYBound
      };
      var overlaps = false;
      for (var position in Playground.placedSkills) {
        if (Playground.skillsOverlap(cords, Playground.placedSkills[position].cords)) {
          Playground.placedSkillAttempts++;
          overlaps = true;
          break;
        }
      }
      if (overlaps) continue;
      if (!skill.isPositioned) {
        Playground.placedSkills.push({
          name: skill.element.innerText,
          cords: cords
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
  reset: function reset(hire) {
    hire = hire || false;
    Playground.placedSkillAttempts = 0;
    Playground.placedSkills = [];
    if (hire != "exceeded") Playground.fontScale = 25;
    for (var skill in Playground.skills) {
      Playground.skills[skill].active = false;
      if (Playground.skills[skill].element) {
        Playground.skills[skill].element.removeEventListener("mousedown", Playground.dragStart);
        Playground.skills[skill].element.removeEventListener("touchstart", Playground.dragStart);
        Playground.skills[skill].element.removeEventListener("mouseup", Playground.dragEnd);
        Playground.skills[skill].element.removeEventListener("mousemove", Playground.dragElement);
        Playground.playground.removeChild(Playground.skills[skill].element);
        delete Playground.skills[skill].element;
      }
    }
    while (Playground.playground.firstChild) {
      Playground.playground.removeChild(Playground.playground.firstChild);
    }
    if (hire == "hire") {
      Playground.buildForm();
    } else if (Playground.initialized) {
      //resetHomepageDeveloperTag();
      Playground.init(Playground.skills);
    }
  },
  resetSkillPosition: function resetSkillPosition(skill) {
    for (var position in Playground.placedSkills) {
      if (Playground.placedSkills[position].name == skill.name) {
        window.exampleSkill = skill;
        skill.currentX = 0;
        skill.currentY = 0;
        skill.initialX;
        skill.initialY;
        skill.xOffset = 0;
        skill.yOffset = 0;
        Playground.setTranslate(skill.currentX, skill.currentY, skill.element);
      }
    }
  },
  getSkillBasedOnName: function getSkillBasedOnName(name) {
    for (var skill in Playground.skills) {
      if (Playground.skills[skill].name == name) return Playground.skills[skill];
    }
  },
  getFontSizeBasedOnExperience: function getFontSizeBasedOnExperience(experience) {
    return experience / Playground.fontScale + "em";
  },
  getColorBasedOnExperience: function getColorBasedOnExperience(experience, type) {
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
  skillsOverlap: function skillsOverlap(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
      return true;
    }
    return false;
  },
  addClickListener: function addClickListener(skill) {
    skill.element.addEventListener("mousedown", Playground.dragStart, false);
    skill.element.addEventListener("touchstart", Playground.dragStart, false);
  },
  dragStart: function dragStart(e) {
    //console.log("this: ", this);

    var skill = Playground.getSkillBasedOnName(e.target.id);
    console.log('skill: ', skill);
    Playground.homepageTag.innerHTML = skill.name;
    Playground.homepageTag.classList.remove("text-gruvbox-green");
    Playground.homepageTag.classList.add("shadow-inner", "text-gruvbox-gray", "border-dashed", "border-gruvbox-green");
    if (skill && skill.element) {
      if (e.type == "touchstart") {
        skill.element.addEventListener("touchend", Playground.dragEnd, false);
        skill.element.addEventListener("touchmove", Playground.drag, false);
      } else if (e.type == "mousedown") {
        skill.element.addEventListener("mouseup", Playground.dragEnd, false);
        skill.element.addEventListener("mousemove", Playground.drag, false);
      }
      skill.element.style.zIndex = "11";
      skill.element.classList.remove("cursor-pointer");
      skill.element.classList.add("cursor-move");
      if (skill.heldCounter && skill.heldCounter > 2) {
        clearInterval(skill.heldCounter);
      }
      if (e.type === "touchstart") {
        skill.initialX = e.touches[0].clientX - skill.xOffset;
        skill.initialY = e.touches[0].clientY - skill.yOffset;
      } else {
        skill.initialX = e.clientX - skill.xOffset;
        skill.initialY = e.clientY - skill.yOffset;
      }
      if (e.target === skill.element) {
        skill.dragActive = true;
      } else {
        skill.dragActive = false;
      }
    }
  },
  dragEnd: function dragEnd(e) {
    var skill = Playground.getSkillBasedOnName(e.target.id);
    if (skill && skill.element) {
      skill.element.classList.remove("cursor-move");
      skill.element.removeEventListener("mouseup", Playground.dragEnd);
      skill.element.removeEventListener("mousemove", Playground.dragElement);
      skill.element.style.zIndex = "1";
      skill.dragActive = false;
      skill.infoShowing = false;
      if (skill.name == "hire me") Playground.removeHireHint(skill);
      Playground.removeHint(skill);
      Playground.resetSkillPosition(skill);
      if (skill.atTarget) {
        Playground.homepageTag.classList.add("text-gruvbox-green");
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
      Playground.homepageTag.classList.remove("text-gruvbox-gray", "border-gruvbox-green", "shadow-inner");
    }
    _this.requestAnimationFrameID = null;
  },
  dragElement: function dragElement(e) {
    if (_this.requestAnimationFrameID) return;
    _this.requestAnimationFrameID = window.requestAnimationFrame(function () {
      return Playground.drag(e);
    });
  },
  drag: function drag(e) {
    e.preventDefault();
    var skill = Playground.getSkillBasedOnName(e.target.id);
    if (skill && skill.dragActive) {
      if (!skill.elementChild) Playground.buildInfoCard(skill);
      var isForm = Playground.draggingEvents(e, skill);
      if (e.type === "touchmove") {
        skill.currentX = e.touches[0].clientX - skill.initialX;
        skill.currentY = e.touches[0].clientY - skill.initialY;
      } else {
        skill.currentX = e.clientX - skill.initialX;
        skill.currentY = e.clientY - skill.initialY;
      }
      if (!isForm) Playground.setTranslate(skill.currentX, skill.currentY, skill.element);
    }
  },
  draggingEvents: function draggingEvents(e, skill) {
    if (Playground.skillsOverlap(e.target.getBoundingClientRect(), Playground.homepageTag.getBoundingClientRect())) {
      skill.atTarget = true;
      if (Playground.homepageTag.classList.contains("text-gruvbox-gray")) {
        Playground.homepageTag.classList.remove("text-gruvbox-gray", "shadow-inner", "border-gruvbox-green");
        Playground.homepageTag.classList.add("text-" + Playground.getColorBasedOnExperience(skill.experience));
      }
    } else {
      Playground.skillActive = skill;
      skill.atTarget = false;

      // This will run after a dragged skill entered the drop area, then left
      if (Playground.homepageTag.classList.contains("text-" + Playground.getColorBasedOnExperience(skill.experience))) {
        // console.log('do this once...')
        Playground.homepageTag.classList.remove("text-" + Playground.getColorBasedOnExperience(skill.experience));
        Playground.homepageTag.classList.add('bg-gruvbox-black', 'text-gruvbox-gray', 'border-dashed', 'border-gruvbox-green');
        Playground.homepageTag.classList.add("text-gruvbox-gray", "border-dashed", "border-gruvbox-green", "shadow-inner");
      }
    }
  },
  addHint: function addHint(skill) {
    skill.elementHint = document.createElement("div");
    skill.elementHint.classList.add("self-center", "justify-self-center", "cursor-pointer", "text-sm", "text-gruvbox-white", "max-w-md", "text-center");
    skill.elementHint.innerHTML = "drag and drop";
    skill.element.appendChild(skill.elementHint);
  },
  addHireHint: function addHireHint(skill) {
    skill.elementHireHint = document.createElement("div");
    skill.elementHireHint.classList.add("self-center", "justify-self-center", "text-sm", "text-gruvbox-white", "text-center", "bg-gruvbox-black", "m-auto");
    skill.elementHireHint.innerHTML = "&uuarr; hire me! &ddarr;";
    skill.element.appendChild(skill.elementHireHint);
  },
  removeHint: function removeHint(skill) {
    Playground.homepageTag.classList.remove("text-gruvbox-gray", "bg-gruvbox-black");
    Playground.homepageTag.classList.add("text-gruvbox-green", "bg-gruvbox-black");
    skill.heldCounter = 0;
    if (skill.heldInterval) clearTimeout(skill.heldInterval);
    if (skill.elementHint) {
      skill.element.removeChild(skill.elementHint);
      delete skill.elementHint;
    }
  },
  removeHireHint: function removeHireHint(skill) {
    skill.heldCounter = 0;
    if (skill.heldHireInterval) clearTimeout(skill.heldHireInterval);
    if (skill.elementHireHint) {
      skill.element.removeChild(skill.elementHireHint);
      delete skill.elementHireHint;
    }
  },
  setTranslate: function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate(" + xPos + "px, " + yPos + "px)";
  },
  handleShakeEvents: function handleShakeEvents(e, skill) {
    if (e.type == "touchmove") {
      if (!skill.initialTouch) {
        skill.initialTouch = e.touches[0];
      } else {
        e.movementX = skill.initialTouch.pageX - skill.previousTouch.pageX;
        e.movementY = skill.initialTouch.pageY - skill.previousTouch.pageY;
      }
      skill.previousTouch = e.touches[0];
    }
    if (e.movementX && e.movementX > Playground.speedLimit) {
      skill.elementMovementRightExceeded = true;
      skill.elementMovementXTimeout = setTimeout(function () {
        skill.elementMovementRightExceeded = false;
      }, 200);
    }
    if (e.movementX && e.movementX < -Playground.speedLimit) {
      skill.elementMovementLeftExceeded = true;
      skill.elementMovementXTimeout = setTimeout(function () {
        skill.elementMovementLeftExceeded = false;
      }, 200);
    }
    if (skill.name == "hire me") {
      if (e.movementY && e.movementY > Playground.speedLimit - 4) {
        skill.elementMovementUpExceeded = true;
        skill.elementMovementYTimeout = setTimeout(function () {
          skill.elementMovementUpExceeded = false;
        }, 200);
      }
      if (e.movementY && e.movementY < Playground.speedLimit - 4) {
        skill.elementMovementDownExceeded = true;
        skill.elementMovementYTimeout = setTimeout(function () {
          skill.elementMovementDownExceeded = false;
        }, 200);
      }
      if (skill.elementMovementDownExceeded && skill.elementMovementUpExceeded && skill.infoShowing) {
        e.stopPropagation();
        Playground.dragEnd(e);
        Playground.reset("hire");
        return false;
      }
    }
    if (skill.name == "GitHub") {
      if (e.movementY && e.movementY > Playground.speedLimit - 4) {
        skill.elementMovementUpExceeded = true;
        skill.elementMovementYTimeout = setTimeout(function () {
          skill.elementMovementUpExceeded = false;
        }, 200);
      }
      if (e.movementY && e.movementY < Playground.speedLimit - 4) {
        skill.elementMovementDownExceeded = true;
        skill.elementMovementYTimeout = setTimeout(function () {
          skill.elementMovementDownExceeded = false;
        }, 200);
      }
      if (skill.elementMovementDownExceeded && skill.elementMovementUpExceeded && skill.infoShowing) {
        e.stopPropagation();
        Playground.dragEnd(e);
        window.open("https://github.com/revertcreations");
        return false;
      }
    }
    if (skill.elementMovementLeftExceeded && skill.elementMovementRightExceeded && !skill.infoShowing) {
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
  buildInfoCard: function buildInfoCard(skill) {
    skill.elementChild = document.createElement("div");
    skill.elementChild.style.fontSize = "16px";
    skill.elementChild.classList.add("flex", "flex-col", "bg-gruvbox-black", "p-2", "h-80", "md:h-auto", "overflow-y-auto", "overflow-x-hidden");
    Playground.buildInfoCardCloseElement(skill);
    Playground.buildExperienceDiv(skill);
    skill.elementChildExcerpt = document.createElement("div");
    skill.elementChildExcerpt.classList.add("m-2", "text-left", "align-top", "md:self-start", "self-center", "text-gruvbox-white");
    skill.elementChildExcerpt.innerHTML = skill.excerpt;
  },
  buildInfoCardCloseElement: function buildInfoCardCloseElement(skill) {
    skill.closeInfoCard = document.createElement("div");
    skill.closeInfoCard.classList.add("absolute", "-top-20", "z-20", "right-0", "cursor-pointer", "text-6xl");
    skill.closeInfoCard.innerHTML = "<span onclick='Playground.closeInfoCard(" + '"' + skill.name + '"' + ")' class='text-gruvbox-red hover:text-red-400'>&times;</span>";
  },
  closeInfoCard: function closeInfoCard(skill_name) {
    var skill = Playground.getSkillBasedOnName(skill_name);
    skill.element.removeChild(skill.elementChild);
    skill.element.removeChild(skill.closeInfoCard);
    skill.element.style.top = skill.originalTop;
    skill.element.style.left = skill.originalLeft;
    skill.element.style.zIndex = "1";
    skill.element.style.transform = "unset";
    skill.element.style.backgroundImage = "unset";
    skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(skill.experience);
    skill.element.classList.remove("animate-float-bg", "bg-" + Playground.getColorBasedOnExperience(skill.experience), "lg:w-5/12", "md:w-7/12", "w-11/12");
    skill.element.classList.add("hover:animate-float-text", "text-" + Playground.getColorBasedOnExperience(skill.experience));
    skill.nameSpan.classList.remove("text-gruvbox-black");

    //resetHomepageDeveloperTag();
    Playground.removeHint(skill);
    Playground.enableSkills();
  },
  buildExperienceDiv: function buildExperienceDiv(skill) {
    skill.elementChildExperienceWrap = document.createElement("div");
    skill.elementChildExperienceWrap.classList.add("flex", "flex-row", "cursor-pointer", "p-2");
    skill.elementChildExperienceWrapLabel = document.createElement("div");
    skill.elementChildExperienceWrapLabel.innerHTML = "Experience: &nbsp; &nbsp;";
    skill.elementChildExperienceWrapLabel.classList.add("text-gruvbox-gray", "mr-4");
    skill.elementChildExperienceWrapLabelExperience = document.createElement("div");
    skill.elementChildExperienceWrapLabelExperience.innerText = skill.experience;
    skill.elementChildExperienceWrapLabelExperience.classList.add("text-" + Playground.getColorBasedOnExperience(skill.experience) + "");
    skill.elementChildExperienceWrapLabelExperienceSlash = document.createElement("div");
    skill.elementChildExperienceWrapLabelExperienceSlash.innerHTML = "&nbsp;/&nbsp;";
    skill.elementChildExperienceWrapLabelExperienceSlash.classList.add("text-gruvbox-white");
    skill.elementChildExperienceWrapLabelExperienceFull = document.createElement("div");
    skill.elementChildExperienceWrapLabelExperienceFull.innerText = "100";
    skill.elementChildExperienceWrapLabelExperienceFull.classList.add("text-gruvbox-white");
  },
  removeAllClickListeners: function removeAllClickListeners() {
    Playground.skills.forEach(function (skill) {
      skill.element.removeEventListener("mousedown", Playground.dragStart, false);
      skill.element.removeEventListener("touchstart", Playground.dragStart, false);
    });
  },
  displayInfoCard: function displayInfoCard(skill) {
    Playground.removeAllClickListeners();
    Playground.disableSkills();
    skill.element.style.top = "10%";
    skill.element.style.left = "50%";
    skill.element.style.transform = "translate(-50%, 0)";
    skill.element.style.zIndex = "12";
    skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(100);
    skill.element.classList.remove("hover:animate-float-text", "text-" + Playground.getColorBasedOnExperience(skill.experience));
    for (var index = 0; index < 101; index++) skill.element.style.setProperty("--experience-percent-" + index, skill.experience > index ? index + "%" : skill.experience + "%");
    skill.nameSpan.classList.add("text-gruvbox-black");
    skill.element.classList.add("animate-float-bg", "lg:w-5/12", "md:w-7/12", "w-11/12");
    skill.element.appendChild(skill.elementChild);
    skill.element.appendChild(skill.closeInfoCard);
    if (skill.name != "README.md" && skill.name != "hire me") {
      skill.elementChild.appendChild(skill.elementChildExperienceWrap);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabel);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperience);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperienceSlash);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperienceFull);
    }
    skill.elementChild.appendChild(skill.elementChildExcerpt);
    skill.infoShowing = true;
  },
  buildForm: function buildForm() {
    window.onresize = false;
    var closeForm = document.createElement("div");
    closeForm.classList.add("cursor-pointer", "text-6xl", "text-right");
    closeForm.innerHTML = "<span onclick='Playground.reset()' class='text-gruvbox-red hover:text-red-400'>&times;</span>";
    var formWrap = document.createElement("div");
    formWrap.classList.add("m-auto", "lg:w-5/12", "md:w-7/12", "w-11/12");
    var hireMeForm = document.createElement("form");
    hireMeForm.id = "hire_me_form";
    hireMeForm.classList.add("flex", "flex-col", "m-8");
    var formInfo = document.createElement("p");
    formInfo.innerText = "First of all, I'm very excited to hear that you are interested in working with me! I love hearing new project ideas, so go ahead and fill out the form below with your contact info, and a brief overview of the project in mind, and I will get back to you asap!";
    formInfo.classList.add("text-gruvbox-white", "mb-4");
    var submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.innerText = "Submit";
    submitButton.classList.add("hover:bg-gruvbox-purple", "bg-gruvbox-green", "text-gruvbox-black", "text-2xl", "font-bold", "p-4", "mt-4", "mb-4");
    var formTitle = document.createElement("h2");
    formTitle.innerText = "hire me";
    formTitle.classList.add("text-gruvbox-green", "text-4xl", "mt-4", "mb-4");
    var emailInput = document.createElement("input");
    emailInput.name = "email";
    emailInput.type = "email";
    emailInput.classList.add("p-4", "m-4");
    var emailLabel = document.createElement("label");
    emailLabel.innerText = "Email";
    emailLabel.classList.add("text-gruvbox-green");
    var organizationInput = document.createElement("input");
    organizationInput.name = "name";
    organizationInput.type = "text";
    organizationInput.classList.add("p-4", "m-4");
    var organizationLabel = document.createElement("label");
    organizationLabel.classList.add("text-gruvbox-green");
    organizationLabel.innerText = "Organization";
    var firstNameInput = document.createElement("input");
    firstNameInput.name = "first_name";
    firstNameInput.type = "text";
    firstNameInput.classList.add("p-4", "m-4");
    var firstNameLabel = document.createElement("label");
    firstNameLabel.innerText = "First Name";
    firstNameLabel.classList.add("text-gruvbox-green");
    var lastNameInput = document.createElement("input");
    lastNameInput.name = "last_name";
    lastNameInput.type = "text";
    lastNameInput.classList.add("p-4", "m-4");
    var lastNameLabel = document.createElement("label");
    lastNameLabel.innerText = "Last Name";
    lastNameLabel.classList.add("text-gruvbox-green");
    var phoneInput = document.createElement("input");
    phoneInput.type = "tel";
    phoneInput.classList.add("p-4", "m-4");
    //phoneInputpattern = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
    var phoneLabel = document.createElement("label");
    phoneLabel.innerText = "Phone Number";
    phoneLabel.classList.add("text-gruvbox-green");
    var descriptionInput = document.createElement("textarea");
    descriptionInput.name = "description";
    descriptionInput.classList.add("p-4", "m-4");
    var descriptionLabel = document.createElement("label");
    descriptionLabel.innerText = "Description";
    descriptionLabel.classList.add("text-gruvbox-green");
    Playground.playground.classList.remove("touch-action-none");
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
      var hireMeForm = document.getElementById("hire_me_form");
      // console.log(hireMeForm[0])
      var data = new FormData(hireMeForm);
      // console.log(data)

      var csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
      var url = "/web-development";
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text-plain, */*",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrf_token
        },
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({
          first_name: firstNameInput.value,
          last_name: lastNameInput.value,
          organization: organizationInput.value,
          phone: phoneInput.value,
          description: descriptionInput.value,
          email: emailInput.value
        })
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.errors) {
          if (data.errors["first_name"]) {
            firstNameLabel.classList.remove("text-gruvbox-green");
            firstNameLabel.innerText = "First Name *required";
            firstNameLabel.classList.add("text-gruvbox-red");
          }
          if (data.errors["last_name"]) {
            lastNameLabel.classList.remove("text-gruvbox-green");
            lastNameLabel.innerText = "Last Name *required";
            lastNameLabel.classList.add("text-gruvbox-red");
          }
          if (data.errors["email"] && data.errors["email"][0] !== "The email has already been taken.") {
            emailLabel.classList.remove("text-gruvbox-green");
            emailLabel.innerText = "Last Name *required";
            emailLabel.classList.add("text-gruvbox-red");
          }
          if (data.errors["email"] && data.errors["email"][0] == "The email has already been taken.") {
            formInfo.classList.remove("text-gruvbox-green");
            formInfo.classList.add("text-gruvbox-orange");
            formInfo.innerHTML = '<span class="text-gruvbox-yellow">Oh, ' + (firstNameInput.value.length > 0 ? firstNameInput.value + "," : ",") + " it looks like you have already contacted me. I will get to reviewing it right away!</span>";
          }
          submitButton.removeAttribute("disabled");
        }
        if (data.status == "ok") {
          formWrap.removeChild(hireMeForm);
          var _formInfo = document.createElement("p");
          _formInfo.innerText = data.message;
          _formInfo.classList.add("text-gruvbox-white", "mb-4");
          formWrap.appendChild(_formInfo);
        }
      })["catch"](function (errors) {
        var formInfo = document.createElement("p");
        formInfo.innerText = errors.message;
        formInfo.classList.add("text-gruvbox-red", "mb-4");
        formWrap.appendChild(formInfo);
      });
    };
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Playground);
/******/ })()
;