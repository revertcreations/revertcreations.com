Playground={playground:document.getElementById("playground"),skills:[],needsReset:!1,fontScale:25,placedSkills:[],placedSkillAttempts:0,speedLimit:12,init:function(e){for(Playground.skills=e;Playground.playground.firstChild;)Playground.playground.removeChild(Playground.playground.firstChild);for(skill in Playground.skills){if(Playground.needsReset=!1,Playground.skills[skill].element=document.createElement("div"),Playground.skills[skill].active=!1,Playground.skills[skill].isPositioned=!1,Playground.skills[skill].currentX,Playground.skills[skill].currentY,Playground.skills[skill].initialX,Playground.skills[skill].initialY,Playground.skills[skill].xOffset=0,Playground.skills[skill].yOffset=0,Playground.styleElement(Playground.skills[skill]),Playground.playground.appendChild(Playground.skills[skill].element),!Playground.positionElement(Playground.skills[skill]))break;Playground.addClickListener(Playground.skills[skill])}var t;Playground.needsReset&&Playground.reset("exceeded"),window.onresize=function(){clearTimeout(t),t=setTimeout(Playground.reset("resize"),500)}},styleElement:function(e){e.nameSpan=document.createElement("span"),e.nameSpan.classList.add("pointer-events-none"),e.nameSpan.innerText=e.name,e.element.appendChild(e.nameSpan),e.element.id=e.name,e.element.style.position="absolute",e.element.style.fontSize=Playground.getFontSizeBasedOnExperience(e.experience),e.element.classList.add("hover:animate-float-text","text-bold","text-center","select-none","text-"+Playground.getColorBasedOnExperience(e.experience),"cursor-pointer")},addRandomFloatEffect:function(e){var t=13*Math.random()+2+"s",n=20*Math.random()-10+"px",l=20*Math.random()-10+"px";e.element.style.setProperty("--float-animation-time",t),e.element.style.setProperty("--float-fifty-percent-y",n),e.element.style.setProperty("--float-fifty-percent-x",l)},positionElement:function(e){for(;!e.isPositioned;){if(Playground.placedSkillAttempts>100)return Playground.fontScale=Playground.fontScale+2,Playground.needsReset=!0,!1;var t=e.element.offsetWidth,n=e.element.offsetHeight,l=Math.random()*(playground.offsetWidth-t-t/2)+t/2,r=Math.random()*(playground.offsetHeight-n-n/2)+n/2,i={width:t,height:n,x:l,y:r},a=!1;for(position in Playground.placedSkills)if(Playground.skillsOverlap(i,Playground.placedSkills[position].cords)){Playground.placedSkillAttempts++,a=!0;break}if(!a)return e.isPositioned||(Playground.placedSkills.push({name:e.element.innerText,cords:i}),e.element.style.top=r+"px",e.element.style.left=l+"px",e.isPositioned=!0),!0}},reset:function(e){for(skill in e=e||!1,Playground.placedSkillAttempts=0,Playground.placedSkills=[],"exceeded"!=e&&(Playground.fontScale=25),Playground.skills)Playground.skills[skill].active=!1,Playground.skills[skill].element&&(Playground.skills[skill].element.removeEventListener("mousedown",Playground.dragStart),Playground.skills[skill].element.removeEventListener("touchstart",Playground.dragStart),Playground.skills[skill].element.removeEventListener("mouseup",Playground.dragEnd),Playground.skills[skill].element.removeEventListener("mousemove",Playground.drag),Playground.playground.removeChild(Playground.skills[skill].element),delete Playground.skills[skill].element);for(;Playground.playground.firstChild;)Playground.playground.removeChild(Playground.playground.firstChild);"hire"==e?Playground.buildForm():Playground.init(Playground.skills)},resetSkillPosition:function(e){for(position in Playground.placedSkills)Playground.placedSkills[position].name==e.name&&(window.exampleSkill=e,e.currentX=0,e.currentY=0,e.initialX,e.initialY,e.xOffset=0,e.yOffset=0,Playground.setTranslate(e.currentX,e.currentY,e.element))},getSkillBasedOnName:function(e){for(skill in Playground.skills)if(Playground.skills[skill].name==e)return Playground.skills[skill]},getFontSizeBasedOnExperience:function(e){return e/Playground.fontScale+"em"},getColorBasedOnExperience:function(e,t){switch(!0){case 101==e:return"hex"==t?"#b16286":"gruvbox-purple";case 102==e:return"hex"==t?"#cc241d":"gruvbox-black-hidden";case 100==e:return"hex"==t?"#fbf1c7":"gruvbox-white";default:return"hex"==t?"#b8bb26":"gruvbox-green"}},skillsOverlap:function(e,t){return e.x<t.x+t.width&&e.x+e.width>t.x&&e.y<t.y+t.height&&e.y+e.height>t.y},addClickListener:function(e){e.element.addEventListener("mousedown",Playground.dragStart,{passive:!0}),e.element.addEventListener("touchstart",Playground.dragStart,{passive:!0})},dragStart:function(e){var t=Playground.getSkillBasedOnName(e.target.id);t&&t.element&&("touchstart"==e.type?(t.element.addEventListener("touchend",Playground.dragEnd,{passive:!0}),t.element.addEventListener("touchmove",Playground.drag,{passive:!0})):(t.element.addEventListener("mouseup",Playground.dragEnd,{passive:!0}),t.element.addEventListener("mousemove",Playground.drag,{passive:!0})),t.element.style.zIndex="2",t.elementShakeHint||Playground.addShakeHint(t),t.heldCounter&&t.heldCounter>2&&clearInterval(t.heldCounter),"touchstart"===e.type?(t.initialX=e.touches[0].clientX-t.xOffset,t.initialY=e.touches[0].clientY-t.yOffset):(t.initialX=e.clientX-t.xOffset,t.initialY=e.clientY-t.yOffset),e.target===t.element?t.active=!0:t.active=!1)},dragEnd:function(e){var t=Playground.getSkillBasedOnName(e.target.id);t&&t.element&&(t.element.removeEventListener("mouseup",Playground.dragEnd),t.element.removeEventListener("mousemove",Playground.drag),t.element.style.zIndex="1",t.elementChild&&(clearTimeout(t.elementMovementXTimeout),clearTimeout(t.elementMovementYTimeout),t.elementMovementDownExceeded=!1,t.elementMovementUpExceeded=!1,t.elementMovementLeftExceeded=!1,t.elementMovementRightExceeded=!1,t.elementChild.isConnected&&t.element.removeChild(t.elementChild),t.nameSpan.classList.remove("text-gruvbox-black"),t.element.style.backgroundImage="unset",t.element.classList.remove("animate-float-bg","bg-"+Playground.getColorBasedOnExperience(t.experience),"lg:w-5/12","md:w-7/12","w-11/12"),t.element.classList.add("hover:animate-float-text","text-"+Playground.getColorBasedOnExperience(t.experience)),t.element.style.fontSize=Playground.getFontSizeBasedOnExperience(t.experience),delete t.elementChild),t.active=!1,t.infoShowing=!1,t.initialTouch=!1,"hire me"==t.name&&Playground.removeHireHint(t),Playground.removeShakeHint(t),Playground.resetSkillPosition(t))},drag:function(e){var t=Playground.getSkillBasedOnName(e.target.id);if(t&&t.active){t.originalTop=t.element.style.top,t.originalLeft=t.element.style.left,t.elementChild||Playground.buildInfoCard(t);var n=Playground.handleShakeEvents(e,t);"touchmove"===e.type?(t.currentX=e.touches[0].clientX-t.initialX,t.currentY=e.touches[0].clientY-t.initialY):(t.currentX=e.clientX-t.initialX,t.currentY=e.clientY-t.initialY),n||Playground.setTranslate(t.currentX,t.currentY,t.element)}},handleShakeEvents:function(e,t){if("touchmove"==e.type&&(t.initialTouch?(e.movementX=t.initialTouch.pageX-t.previousTouch.pageX,e.movementY=t.initialTouch.pageY-t.previousTouch.pageY):t.initialTouch=e.touches[0],t.previousTouch=e.touches[0]),e.movementX&&e.movementX>Playground.speedLimit&&(t.elementMovementRightExceeded=!0,t.elementMovementXTimeout=setTimeout((function(){t.elementMovementRightExceeded=!1}),200)),e.movementX&&e.movementX<-Playground.speedLimit&&(t.elementMovementLeftExceeded=!0,t.elementMovementXTimeout=setTimeout((function(){t.elementMovementLeftExceeded=!1}),200)),"hire me"==t.name&&(e.movementY&&e.movementY>Playground.speedLimit-4&&(t.elementMovementUpExceeded=!0,t.elementMovementYTimeout=setTimeout((function(){t.elementMovementUpExceeded=!1}),200)),e.movementY&&e.movementY<Playground.speedLimit-4&&(t.elementMovementDownExceeded=!0,t.elementMovementYTimeout=setTimeout((function(){t.elementMovementDownExceeded=!1}),200)),t.elementMovementDownExceeded&&t.elementMovementUpExceeded&&t.infoShowing))return e.stopPropagation(),Playground.dragEnd(e),Playground.reset("hire"),!1;if("GitHub"==t.name&&(e.movementY&&e.movementY>Playground.speedLimit-4&&(t.elementMovementUpExceeded=!0,t.elementMovementYTimeout=setTimeout((function(){t.elementMovementUpExceeded=!1}),200)),e.movementY&&e.movementY<Playground.speedLimit-4&&(t.elementMovementDownExceeded=!0,t.elementMovementYTimeout=setTimeout((function(){t.elementMovementDownExceeded=!1}),200)),t.elementMovementDownExceeded&&t.elementMovementUpExceeded&&t.infoShowing))return e.stopPropagation(),Playground.dragEnd(e),window.open("https://github.com/revertcreations"),!1;if(t.elementMovementLeftExceeded&&t.elementMovementRightExceeded&&!t.infoShowing){if("reset();"==t.name)return e.stopPropagation(),Playground.dragEnd(e),Playground.reset("manual"),!1;Playground.displayInfoCard(t),Playground.removeShakeHint(t)}},buildInfoCard:function(e){e.elementChild=document.createElement("div"),e.elementChild.style.fontSize="16px",e.elementChild.classList.add("flex","flex-col","bg-gruvbox-black","cursor-pointer","p-2","shadow-inner"),Playground.buildExperienceDiv(e),e.elementChildExcerpt=document.createElement("div"),e.elementChildExcerpt.classList.add("m-2","text-left","align-top","md:self-start","self-center","text-gruvbox-white"),e.elementChildExcerpt.innerHTML=e.excerpt},buildExperienceDiv:function(e){e.elementChildExperienceWrap=document.createElement("div"),e.elementChildExperienceWrap.classList.add("flex","flex-row","cursor-pointer","p-2"),e.elementChildExperienceWrapLabel=document.createElement("div"),e.elementChildExperienceWrapLabel.innerHTML="Experience: &nbsp; &nbsp;",e.elementChildExperienceWrapLabel.classList.add("text-gruvbox-gray","mr-4"),e.elementChildExperienceWrapLabelExperience=document.createElement("div"),e.elementChildExperienceWrapLabelExperience.innerText=e.experience,e.elementChildExperienceWrapLabelExperience.classList.add("text-"+Playground.getColorBasedOnExperience(e.experience)),e.elementChildExperienceWrapLabelExperienceSlash=document.createElement("div"),e.elementChildExperienceWrapLabelExperienceSlash.innerHTML="&nbsp;/&nbsp;",e.elementChildExperienceWrapLabelExperienceSlash.classList.add("text-gruvbox-white"),e.elementChildExperienceWrapLabelExperienceFull=document.createElement("div"),e.elementChildExperienceWrapLabelExperienceFull.innerText="100",e.elementChildExperienceWrapLabelExperienceFull.classList.add("text-gruvbox-white")},displayInfoCard:function(e){e.element.style.fontSize=Playground.getFontSizeBasedOnExperience(100),e.element.style.transform="unset",e.element.classList.remove("hover:animate-float-text","text-"+Playground.getColorBasedOnExperience(e.experience));for(var t=0;t<101;t++)e.element.style.setProperty("--experience-percent-"+t,e.experience>t?t+"%":e.experience+"%");e.element.style.setProperty("--experience-color",Playground.getColorBasedOnExperience(e.experience,"hex")),e.nameSpan.classList.add("text-gruvbox-black"),e.element.classList.add("animate-float-bg","lg:w-5/12","md:w-7/12","w-11/12"),e.element.appendChild(e.elementChild),"README.md"!=e.name&&"hire me"!=e.name&&(e.elementChild.appendChild(e.elementChildExperienceWrap),e.elementChildExperienceWrap.appendChild(e.elementChildExperienceWrapLabel),e.elementChildExperienceWrap.appendChild(e.elementChildExperienceWrapLabelExperience),e.elementChildExperienceWrap.appendChild(e.elementChildExperienceWrapLabelExperienceSlash),e.elementChildExperienceWrap.appendChild(e.elementChildExperienceWrapLabelExperienceFull)),e.elementChild.appendChild(e.elementChildExcerpt),"hire me"==e.name&&(e.elementHireHint||(e.heldCounter=0,e.heldHireInterval=setInterval((function(){e.heldCounter+=1,1===e.heldCounter&&e.infoShowing?(Playground.addHireHint(e),clearInterval(e.heldHireInterval)):e.heldCounter>1&&Playground.removeHireHint(e)}),1e3))),e.infoShowing=!0},buildForm:function(){window.onresize=!1;var e=document.createElement("div");e.classList.add("m-auto","lg:w-5/12","md:w-7/12","w-11/12");var t=document.createElement("form");t.id="hire_me_form",t.classList.add("flex","flex-col","m-8");var n=document.createElement("p");n.innerText="First of all, I can't believe you are even here right now, you must really need some web development work done. Anyway, go ahead and fill out the form below with your contact info, and a brief overview of the project in mind, and I will get back to you asap!",n.classList.add("text-gruvbox-white","mb-4");var l=document.createElement("button");l.type="button",l.innerText="Submit",l.classList.add("hover:bg-gruvbox-purple","bg-gruvbox-green","text-gruvbox-black","text-2xl","font-bold","p-4","mt-4","mb-4");var r=document.createElement("h2");r.innerText="hire me",r.classList.add("text-gruvbox-green","text-4xl","mt-4","mb-4");var i=document.createElement("input");i.name="email",i.type="email",i.classList.add("p-4","m-4");var a=document.createElement("label");a.innerText="Email",a.classList.add("text-gruvbox-green");var o=document.createElement("input");o.name="name",o.type="text",o.classList.add("p-4","m-4");var d=document.createElement("label");d.classList.add("text-gruvbox-green"),d.innerText="Organization";var s=document.createElement("input");s.name="first_name",s.type="text",s.classList.add("p-4","m-4");var m=document.createElement("label");m.innerText="First Name",m.classList.add("text-gruvbox-green");var u=document.createElement("input");u.name="last_name",u.type="text",u.classList.add("p-4","m-4");var c=document.createElement("label");c.innerText="Last Name",c.classList.add("text-gruvbox-green");var p=document.createElement("input");p.type="tel",p.classList.add("p-4","m-4"),phoneInputpattern="[0-9]{3}-[0-9]{3}-[0-9]{4}";var g=document.createElement("label");g.innerText="Phone Number",g.classList.add("text-gruvbox-green");var x=document.createElement("textarea");x.name="description",x.classList.add("p-4","m-4");var v=document.createElement("label");v.innerText="Description",v.classList.add("text-gruvbox-green"),Playground.playground.classList.remove("touch-action-none"),Playground.playground.appendChild(e),e.appendChild(t),t.appendChild(r),t.appendChild(n),t.appendChild(d),t.appendChild(o),t.appendChild(m),t.appendChild(s),t.appendChild(c),t.appendChild(u),t.appendChild(a),t.appendChild(i),t.appendChild(g),t.appendChild(p),t.appendChild(v),t.appendChild(x),t.appendChild(l),l.onclick=function(t){l.disabled=!0,(t=t||window.event).preventDefault(),m.classList.contains("text-gruvbox-red")&&(m.classList.remove("text-gruvbox-red"),m.classList.add("text-gruvbox-green"),m.innerText="First Name"),c.classList.contains("text-gruvbox-red")&&(c.classList.remove("text-gruvbox-red"),c.classList.add("text-gruvbox-green"),c.innerText="Last Name"),a.classList.contains("text-gruvbox-red")&&(a.classList.remove("text-gruvbox-red"),a.classList.add("text-gruvbox-green"),a.innerText="Last Name"),n.classList.contains("text-gruvbox-yellow")&&(n.classList.remove("text-gruvbox-orange"),n.classList.remove("text-gruvbox-green"));var r=document.getElementById("hire_me_form");console.log(r[0]);var d=new FormData(r);console.log(d);var g=document.querySelector('meta[name="csrf-token"]').getAttribute("content");fetch("/web-development",{headers:{"Content-Type":"application/json",Accept:"application/json, text-plain, */*","X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":g},method:"POST",credentials:"same-origin",body:JSON.stringify({first_name:s.value,last_name:u.value,organization:o.value,phone:p.value,description:x.value,email:i.value})}).then((function(e){return e.json()})).then((function(t){t.errors&&(t.errors.first_name&&(m.classList.remove("text-gruvbox-green"),m.innerText="First Name *required",m.classList.add("text-gruvbox-red")),t.errors.last_name&&(c.classList.remove("text-gruvbox-green"),c.innerText="Last Name *required",c.classList.add("text-gruvbox-red")),t.errors.email&&"The email has already been taken."!==t.errors.email[0]&&(a.classList.remove("text-gruvbox-green"),a.innerText="Last Name *required",a.classList.add("text-gruvbox-red")),t.errors.email&&"The email has already been taken."==t.errors.email[0]&&(n.classList.remove("text-gruvbox-green"),n.classList.add("text-gruvbox-orange"),n.innerText="Oh, "+(s.value.length>0?s.value+",":",")+" it looks like you have already contacted me. I will get to reviewing it right away!"),l.removeAttribute("disabled")),"ok"==t.status&&(e.removeChild(r),n.innerText=t.message)})).catch((function(e){}))}},addShakeHint:function(e){e.elementShakeHint=document.createElement("div"),e.elementShakeHint.classList.add("self-center","justify-self-center","cursor-pointer","text-sm","text-gruvbox-white","max-w-md","text-center"),e.elementShakeHint.innerHTML="&llarr; shake me! &rrarr;",e.element.appendChild(e.elementShakeHint)},addHireHint:function(e){e.elementHireHint=document.createElement("div"),e.elementHireHint.classList.add("self-center","justify-self-center","text-sm","text-gruvbox-white","text-center","bg-gruvbox-black","m-auto"),e.elementHireHint.innerHTML="&uuarr; hire me! &ddarr;",e.element.appendChild(e.elementHireHint)},removeShakeHint:function(e){e.heldCounter=0,e.heldInterval&&clearTimeout(e.heldInterval),e.elementShakeHint&&(e.element.removeChild(e.elementShakeHint),delete e.elementShakeHint)},removeHireHint:function(e){e.heldCounter=0,e.heldHireInterval&&clearTimeout(e.heldHireInterval),e.elementHireHint&&(e.element.removeChild(e.elementHireHint),delete e.elementHireHint)},setTranslate:function(e,t,n){n.style.transform="translate3d("+e+"px, "+t+"px, 0)"}};