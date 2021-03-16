/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************************!*\
  !*** ./resources/js/playground.js ***!
  \************************************/
Playground = {
  playground: document.getElementById('playground'),
  skills: [],
  needsReset: false,
  fontScale: 25,
  placedSkills: [],
  placedSkillAttempts: 0,
  init: function init(data) {
    Playground.skills = data;

    while (Playground.playground.firstChild) {
      Playground.playground.removeChild(Playground.playground.firstChild);
    }

    for (skill in Playground.skills) {
      Playground.needsReset = false;
      Playground.skills[skill].element = document.createElement('div');
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
      Playground.addClickMove(Playground.skills[skill]);
    }

    if (Playground.needsReset) Playground.reset();
  },
  styleElement: function styleElement(skill) {
    skill.element.innerText = skill.name;
    skill.element.style.position = "absolute";
    skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(skill.experience);
    skill.element.classList.add('select-none', 'text-' + Playground.getColorBasedOnExperience(skill.experience), 'cursor-pointer');
  },
  positionElement: function positionElement(skill) {
    while (!skill.isPositioned) {
      if (Playground.placedSkillAttempts > 100) {
        Playground.needsReset = true;
        return false;
      }

      var width = skill.element.offsetWidth;
      var height = skill.element.offsetHeight;
      var textXBound = Math.random() * (playground.offsetWidth - width - width / 2) + width / 2;
      var textYBound = Math.random() * (playground.offsetHeight - height - height / 2) + height / 2;
      var cords = {
        'width': width,
        'height': height,
        'x': textXBound,
        'y': textYBound
      };
      var overlaps = false;

      for (position in Playground.placedSkills) {
        if (Playground.skillsOverlap(cords, Playground.placedSkills[position].cords)) {
          Playground.placedSkillAttempts++;
          overlaps = true;
          break;
          console.error('upppp', Playground.placedSkillAttempts, Playground.fontScale);
        }
      }

      if (overlaps) continue;

      if (!skill.isPositioned) {
        Playground.placedSkills.push({
          'name': skill.element.innerText,
          'cords': cords
        });
        skill.element.style.top = textYBound + 'px';
        skill.element.style.left = textXBound + 'px';
        skill.isPositioned = true;
      }

      return true;
    }
  },
  reset: function reset() {
    Playground.fontScale = Playground.fontScale + 2;
    Playground.placedSkillAttempts = 0;
    Playground.placedSkills = [];

    for (skill in Playground.skills) {
      if (Playground.skills[skill].element) {
        Playground.playground.removeChild(Playground.skills[skill].element);
        delete Playground.skills[skill].element;
      }
    }

    while (Playground.playground.firstChild) {
      Playground.playground.removeChild(Playground.playground.firstChild);
    }

    Playground.init(Playground.skills);
  },
  resetSkillPosition: function resetSkillPosition(skill) {
    for (position in Playground.placedSkills) {
      if (Playground.placedSkills[position].name == skill.name) {
        window.exampleSkill = skill;
        console.log('Playground.placedSkills[position].cords.y', Playground.placedSkills[position].cords.y + 'px');
        skill.element.style.top = String(Playground.placedSkills[position].cords.y) + 'px';
        skill.element.style.left = String(Playground.placedSkills[position].cords.x) + 'px';
        break;
      }
    }
  },
  getFontSizeBasedOnExperience: function getFontSizeBasedOnExperience(experience) {
    return experience / Playground.fontScale + 'em';
  },
  getColorBasedOnExperience: function getColorBasedOnExperience(experience) {
    // console.log('experience', experience)
    switch (true) {
      case experience > 10 && experience < 20:
        return 'gruvbox-gray';
        break;

      case experience > 20 && experience < 30:
        return 'gruvbox-light-blue';
        break;

      case experience > 30 && experience < 40:
        return 'gruvbox-blue';
        break;

      case experience > 40 && experience < 50:
        return 'gruvbox-light-green';
        break;

      case experience > 50 && experience < 60:
        return 'gruvbox-green';
        break;

      case experience > 60 && experience < 70:
        return 'gruvbox-light-yellow';
        break;

      case experience > 70 && experience < 80:
        return 'gruvbox-yellow';
        break;

      case experience > 80 && experience < 90:
        return 'gruvbox-light-orange';
        break;

      case experience >= 90:
        return 'gruvbox-orange';
        break;

      default:
        return 'gruvbox-white';
        break;
    }
  },
  skillsOverlap: function skillsOverlap(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
      return true;
    }

    return false;
  },
  addClickMove: function addClickMove(skill) {
    skill.element.addEventListener('mousedown', dragStart, {
      passive: true
    });
    skill.element.addEventListener('mouseup', dragEnd, {
      passive: true
    });
    skill.element.addEventListener('mousemove', drag, {
      passive: true
    });
    skill.element.addEventListener('touchstart', dragStart, {
      passive: true
    });
    skill.element.addEventListener('touchend', dragEnd, {
      passive: true
    });
    skill.element.addEventListener('touchmove', dragStart, {
      passive: true
    });

    function dragStart(e) {
      skill.element.style.zIndex = "2";

      if (!skill.elementShakeHint) {
        skill.heldCounter = 0;
        skill.heldInterval = setInterval(function () {
          skill.heldCounter += 1;

          if (skill.heldCounter === 1 && !skill.infoShowing) {
            addShakeHint(skill);
            clearInterval(skill.heldInterval);
          } else if (skill.heldCounter > 1) {
            removeShakeHint(skill);
          }
        }, 1000);
      }

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
        skill.active = true;
      } else {
        skill.active = false;
      }
    }

    function dragEnd(e) {
      skill.element.style.zIndex = "1";

      if (skill.elementChild) {
        clearTimeout(skill.elementMovementXTimeout);
        clearTimeout(skill.elementMovementYTimeout);
        skill.element.removeChild(skill.elementChild);
        skill.element.classList.remove('text-gruvbox-black');
        skill.element.classList.remove('bg-' + Playground.getColorBasedOnExperience(skill.experience));
        skill.element.classList.add('text-' + Playground.getColorBasedOnExperience(skill.experience));
        skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(skill.experience);
        delete skill.elementChild;
      }

      removeShakeHint(skill);
      skill.active = false;
      skill.infoShowing = false;
      Playground.positionElement(skill);
    }

    function drag(e) {
      if (skill.active) {
        // e.preventDefault();
        if (e.movementX > 12) {
          skill.elementMovementXRightExceeded = true;
          skill.elementMovementXTimeout = setTimeout(function () {
            skill.elementMovementXRightExceeded = false;
          }, 200);
        }

        if (e.movementX < -12) {
          skill.elementMovementXLeftExceeded = true;
          skill.elementMovementXTimeout = setTimeout(function () {
            skill.elementMovementXLeftExceeded = false;
          }, 200);
        }

        if (skill.elementMovementXLeftExceeded && skill.elementMovementXRightExceeded && !skill.infoShowing) {
          skill.infoShowing = true;
          removeShakeHint(skill);
          console.log('shake it like a poloriod picture');
          if (!skill.elementChild) buildInfoCard(skill);
        }

        if (e.type === "touchmove") {
          skill.currentX = e.touches[0].clientX - skill.initialX;
          skill.currentY = e.touches[0].clientY - skill.initialY;
        } else {
          skill.currentX = e.clientX - skill.initialX;
          skill.currentY = e.clientY - skill.initialY;
        }

        skill.xOffset = skill.currentX;
        skill.yOffset = skill.currentY;
        setTranslate(skill.currentX, skill.currentY, skill.element);
      }
    }

    function buildInfoCard(skill) {
      skill.element.classList.remove('text-' + Playground.getColorBasedOnExperience(skill.experience));
      skill.element.classList.add('text-gruvbox-black');
      skill.element.classList.add('bg-' + Playground.getColorBasedOnExperience(skill.experience));
      skill.element.style.fontSize = '3.8em';
      skill.elementChild = document.createElement('div');
      skill.elementChild.style.fontSize = '16px';
      skill.elementChild.classList.add('flex', 'flex-col', 'bg-gruvbox-black', 'cursor-pointer', 'p-4');
      buildExperienceDiv(skill);
      skill.elementChildExcerpt = document.createElement('div');
      skill.elementChildExcerpt.classList.add('cursor-pointer', 'p-4', 'max-w-md', 'text-gruvbox-gray');
      skill.elementChildExcerpt.innerText = skill.excerpt;
      skill.elementChild.appendChild(skill.elementChildExcerpt);
    }

    function buildExperienceDiv(skill) {
      skill.element.appendChild(skill.elementChild);
      skill.elementChildExperienceWrap = document.createElement('div');
      skill.elementChildExperienceWrap.classList.add('flex', 'flex-row', 'cursor-pointer', 'p-4');
      skill.elementChild.appendChild(skill.elementChildExperienceWrap);
      skill.elementChildExperienceWrapLabel = document.createElement('div');
      skill.elementChildExperienceWrapLabel.innerHTML = 'Experience: &nbsp; &nbsp;';
      skill.elementChildExperienceWrapLabel.classList.add('text-gruvbox-gray', 'mr-4');
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabel);
      skill.elementChildExperienceWrapLabelExperience = document.createElement('div');
      skill.elementChildExperienceWrapLabelExperience.innerText = skill.experience;
      skill.elementChildExperienceWrapLabelExperience.classList.add('text-' + Playground.getColorBasedOnExperience(skill.experience) + '');
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperience);
      skill.elementChildExperienceWrapLabelExperienceSlash = document.createElement('div');
      skill.elementChildExperienceWrapLabelExperienceSlash.innerHTML = '&nbsp;/&nbsp;';
      skill.elementChildExperienceWrapLabelExperienceSlash.classList.add('text-gruvbox-white');
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperienceSlash);
      skill.elementChildExperienceWrapLabelExperienceSlash = document.createElement('div');
      skill.elementChildExperienceWrapLabelExperienceSlash.innerText = '100';
      skill.elementChildExperienceWrapLabelExperienceSlash.classList.add('text-gruvbox-red');
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperienceSlash);
    }

    function addShakeHint(skill) {
      skill.elementShakeHint = document.createElement('div');
      skill.elementShakeHint.classList.add('self-center', 'justify-self-center', 'cursor-pointer', 'text-sm', 'text-gruvbox-gray', 'max-w-md', 'text-center');
      skill.elementShakeHint.innerHTML = '&Ll; shake me! &Gg;';
      skill.element.appendChild(skill.elementShakeHint);
    }

    function removeShakeHint(skill) {
      skill.heldCounter = 0;
      if (skill.heldInterval) clearTimeout(skill.heldInterval);

      if (skill.elementShakeHint) {
        skill.element.removeChild(skill.elementShakeHint);
        delete skill.elementShakeHint;
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
  }
};
/******/ })()
;