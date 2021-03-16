/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************************!*\
  !*** ./resources/js/playground.js ***!
  \************************************/
Playground = {
  playground: document.getElementById('playground'),
  placedSkills: [],
  init: function init(data) {
    for (var skill in data) {
      data[skill].element = document.createElement('div'); // let element = data[skill].element
      // let name = data[skill].name
      // let experience = data[skill].experience

      data[skill].active = false;
      data[skill].currentX;
      data[skill].currentY;
      data[skill].initialX;
      data[skill].initialY;
      data[skill].xOffset = 0;
      data[skill].yOffset = 0;
      Playground.styleElement(data[skill]);
      Playground.playground.appendChild(data[skill].element);
      Playground.positionElement(data[skill].element); // this.addClickMove(data[skill])
    }
  },
  styleElement: function styleElement(skill) {
    skill.element.innerText = skill.name;
    skill.element.style.position = "absolute";
    skill.element.style.fontSize = getFontSizeBasedOnExperience(skill.experience);
    skill.element.classList.add('select-none', 'text-' + getColorBasedOnExperience(skill.experience), 'cursor-pointer');
  },
  positionElement: function positionElement(element) {
    var width = element.offsetWidth;
    var height = element.offsetHeight;
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
      if (skillsOverlap(cords, Playground.placedSkills[position].cords)) {
        console.error('upppp');
        overlaps = true;
        break;
      }
    }

    if (overlaps) {
      Playground.positionElement(element);
      return;
    } else {
      Playground.placedSkills.push({
        'name': element.innerText,
        'cords': cords
      });
      element.style.top = textYBound + 'px';
      element.style.left = textXBound + 'px';
    }
  }
}; // const playground = document.getElementById('playground')
// let placedSkills = [];
// for (const skill in data) {
//     data[skill].element = document.createElement('div')
//     let element = data[skill].element
//     let name = data[skill].name
//     let experience = data[skill].experience
//     data[skill].active = false;
//     data[skill].currentX;
//     data[skill].currentY;
//     data[skill].initialX;
//     data[skill].initialY;
//     data[skill].xOffset = 0;
//     data[skill].yOffset = 0;
//     styleElement(element, name, experience)
//     playground.appendChild(element)
//     positionElement(element)
//     addClickMove(data[skill])
// }

function getFontSizeBasedOnExperience(experience) {
  return experience / 25 + 'em';
}

function getColorBasedOnExperience(experience) {
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
}

function styleElement(element, name, experience) {
  element.innerText = name;
  element.style.position = "absolute";
  element.style.fontSize = getFontSizeBasedOnExperience(experience);
  element.classList.add('select-none', 'text-' + getColorBasedOnExperience(experience), 'cursor-pointer');
}

function resetElement(skill) {
  for (position in placedSkills) {
    if (placedSkills[position].name == skill.name) {
      window.exampleSkill = skill;
      console.log('placedSkills[position].cords.y', placedSkills[position].cords.y + 'px');
      skill.element.style.top = String(placedSkills[position].cords.y) + 'px';
      skill.element.style.left = String(placedSkills[position].cords.x) + 'px';
      break;
    }
  }
} // function positionElement(element) {
//     let width = element.offsetWidth
//     let height = element.offsetHeight
//     let textXBound = (Math.random() * ((playground.offsetWidth-width) - width/2) + width/2)
//     let textYBound = (Math.random() * ((playground.offsetHeight-height) - height/2) + height/2)
//     let cords = {
//         'width': width,
//         'height': height,
//         'x': textXBound,
//         'y': textYBound,
//     }
//     let overlaps = false;
//     for(position in placedSkills){
//         if(skillsOverlap(cords, placedSkills[position].cords)) {
//             console.error('upppp')
//             overlaps = true
//             break
//         }
//     }
//     if(overlaps) {
//         positionElement(element)
//         return
//     } else {
//         placedSkills.push({
//                 'name': element.innerText,
//                 'cords': cords
//             })
//         element.style.top = textYBound+'px'
//         element.style.left = textXBound+'px'
//     }
// }


function skillsOverlap(rect1, rect2) {
  if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
    return true;
  }

  return false;
}

function addClickMove(skill) {
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
      skill.element.classList.remove('bg-' + getColorBasedOnExperience(skill.experience));
      skill.element.classList.add('text-' + getColorBasedOnExperience(skill.experience));
      skill.element.style.fontSize = getFontSizeBasedOnExperience(skill.experience);
      delete skill.elementChild;
    }

    removeShakeHint(skill);
    resetElement(skill);
    skill.active = false;
    skill.infoShowing = false;
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
    skill.element.classList.remove('text-' + getColorBasedOnExperience(skill.experience));
    skill.element.classList.add('text-gruvbox-black');
    skill.element.classList.add('bg-' + getColorBasedOnExperience(skill.experience));
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
    skill.elementChildExperienceWrapLabelExperience.classList.add('text-' + getColorBasedOnExperience(skill.experience) + '');
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
/******/ })()
;