Playground = {
    playground: document.getElementById('playground'),
    skills: [],
    needsReset: false,
    fontScale: 25,
    placedSkills: [],
    placedSkillAttempts: 0,
    speedLimit: 12,

    init: (data) => {

        Playground.skills = data

        while(Playground.playground.firstChild) {
            Playground.playground.removeChild(Playground.playground.firstChild)
        }

        for (skill in Playground.skills) {

            Playground.needsReset = false
            Playground.skills[skill].element = document.createElement('div')

            Playground.skills[skill].active = false;
            Playground.skills[skill].isPositioned = false;
            Playground.skills[skill].currentX;
            Playground.skills[skill].currentY;
            Playground.skills[skill].initialX;
            Playground.skills[skill].initialY;
            Playground.skills[skill].xOffset = 0;
            Playground.skills[skill].yOffset = 0;


            Playground.styleElement(Playground.skills[skill])
            Playground.playground.appendChild(Playground.skills[skill].element)

            if(!Playground.positionElement(Playground.skills[skill]))
                break

            Playground.addClickListener(Playground.skills[skill])

        }

        if(Playground.needsReset)
            Playground.reset('exceeded')

        var doit;
        window.onresize = function(){
            clearTimeout(doit);
            doit = setTimeout(Playground.reset('resize'), 500);
        };

    },

    styleElement: (skill) => {

        skill.element.id = skill.name
        skill.element.innerText = skill.name
        skill.element.style.position = "absolute"
        skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(skill.experience)
        skill.element.classList.add('select-none', 'text-'+Playground.getColorBasedOnExperience(skill.experience), 'cursor-pointer')

        // Playground.addRandomFloatEffect(skill)
        // skill.element.classList.add('border-2', 'border-'+Playground.getColorBasedOnExperience(skill.experience))

    },

    addRandomFloatEffect: (skill) => {

        let animationTime = (Math.random() * (15 - 2) + 2)+'s'
        let x = (Math.random() * (10 - (-10)) + (-10))+'px'
        let y = (Math.random() * (10 - (-10)) + (-10))+'px'

        skill.element.style.setProperty('--float-animation-time', animationTime);
        skill.element.style.setProperty('--float-fifty-percent-y', x);
        skill.element.style.setProperty('--float-fifty-percent-x', y);

    },

    positionElement: (skill) => {

        while(!skill.isPositioned) {

            if(Playground.placedSkillAttempts > 100){
                Playground.fontScale = Playground.fontScale+2
                Playground.needsReset = true
                return false;
            }

            let width = skill.element.offsetWidth
            let height = skill.element.offsetHeight
            let textXBound = (Math.random() * ((playground.offsetWidth-width) - width/2) + width/2)
            let textYBound = (Math.random() * ((playground.offsetHeight-height) - height/2) + height/2)

            let cords = {
                'width': width,
                'height': height,
                'x': textXBound,
                'y': textYBound,
            }

            let overlaps = false;

            for(position in Playground.placedSkills){

                if(Playground.skillsOverlap(cords, Playground.placedSkills[position].cords)) {
                    Playground.placedSkillAttempts++;
                    overlaps = true
                    break
                }
            }

            if(overlaps)
                continue;


            if(!skill.isPositioned) {
                Playground.placedSkills.push({
                    'name': skill.element.innerText,
                    'cords': cords
                })

                skill.element.style.top = textYBound+'px'
                skill.element.style.left = textXBound+'px'
                skill.isPositioned = true
            }

            return true;
        }

    },

    reset: (hire) => {

        hire = hire || false

        Playground.placedSkillAttempts = 0
        Playground.placedSkills = []
        if(hire != 'exceeded')
            Playground.fontScale = 25

        for(skill in Playground.skills){
            Playground.skills[skill].active = false
            if(Playground.skills[skill].element) {
                Playground.skills[skill].element.removeEventListener('mousedown', Playground.dragStart)
                Playground.skills[skill].element.removeEventListener('touchstart', Playground.dragStart)
                Playground.skills[skill].element.removeEventListener('mouseup', Playground.dragEnd)
                Playground.skills[skill].element.removeEventListener('mousemove', Playground.drag)
                Playground.playground.removeChild(Playground.skills[skill].element);
                delete Playground.skills[skill].element
            }
        }

        while(Playground.playground.firstChild) {
            Playground.playground.removeChild(Playground.playground.firstChild)
        }

        if(hire == 'hire') {
            Playground.buildForm()
        } else {
            Playground.init(Playground.skills)
        }
    },

    resetSkillPosition: (skill) => {

        for(position in Playground.placedSkills){
            if (Playground.placedSkills[position].name == skill.name) {
                window.exampleSkill = skill

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

    getSkillBasedOnName: (name) => {
        for(skill in Playground.skills) {
            if(Playground.skills[skill].name == name)
                return Playground.skills[skill]
        }
    },

    getFontSizeBasedOnExperience: (experience) => {
        return (experience/ Playground.fontScale)+'em';
    },

    getColorBasedOnExperience: (experience) =>  {

        switch (true) {
            case (experience == 101) :
                return 'gruvbox-purple'

            case (experience == 102) :
                return 'gruvbox-red'

            case (experience == 100) :
                return 'gruvbox-white'

            default:
                return 'gruvbox-green'

        }
    },

    skillsOverlap: (rect1, rect2) => {

        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y) {
            return true;
        }

        return false;
    },


    addClickListener: (skill) => {

        skill.element.addEventListener('mousedown', Playground.dragStart, {passive: true})
        skill.element.addEventListener('touchstart', Playground.dragStart, {passive: true})

    },

    dragStart: (e) => {

        let skill = Playground.getSkillBasedOnName(e.target.id)

        if(skill && skill.element) {

            if(e.type == 'touchstart') {
                skill.element.addEventListener('touchend', Playground.dragEnd, {passive: true})
                skill.element.addEventListener('touchmove', Playground.drag, {passive: true})
            } else {
                skill.element.addEventListener('mouseup', Playground.dragEnd, {passive: true})
                skill.element.addEventListener('mousemove', Playground.drag, {passive: true})
            }

            skill.element.style.zIndex = "2"
            skill.element.classList.remove('animate-float')

            if(!skill.elementShakeHint)
                Playground.addShakeHint(skill)

            if(skill.heldCounter && skill.heldCounter > 2) {
                clearInterval(skill.heldCounter)
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
    },

    dragEnd: (e) => {

        let skill = Playground.getSkillBasedOnName(e.target.id)

        if(skill && skill.element) {
            skill.element.removeEventListener('mouseup', Playground.dragEnd)
            skill.element.removeEventListener('mousemove', Playground.drag)

            skill.element.style.zIndex = "1"

            if(skill.elementChild) {
                clearTimeout(skill.elementMovementXTimeout)
                clearTimeout(skill.elementMovementYTimeout)

                skill.elementMovementDownExceeded = false
                skill.elementMovementUpExceeded = false
                skill.elementMovementLeftExceeded = false
                skill.elementMovementRightExceeded = false

                if(skill.elementChild.isConnected)
                    skill.element.removeChild(skill.elementChild)

                skill.element.classList.remove('text-gruvbox-black')
                skill.element.classList.remove('bg-'+Playground.getColorBasedOnExperience(skill.experience), 'lg:w-5/12', 'md:w-7/12', 'w-11/12', 'border-r-4', 'border-b-4', 'border-'+Playground.getColorBasedOnExperience(skill.experience))

                skill.element.classList.add('text-'+Playground.getColorBasedOnExperience(skill.experience))

                skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(skill.experience)

                delete skill.elementChild
            }

            skill.active = false
            skill.infoShowing = false
            skill.initialTouch = false

            if(skill.name == 'HIRE ME')
                Playground.removeHireHint(skill)

            Playground.removeShakeHint(skill)
            Playground.resetSkillPosition(skill)
        }

    },

    drag: (e) =>  {

        let skill = Playground.getSkillBasedOnName(e.target.id)

        if (skill && skill.active) {

            skill.originalTop = skill.element.style.top
            skill.originalLeft = skill.element.style.left

            if(!skill.elementChild)
                Playground.buildInfoCard(skill)

           let isForm = Playground.handleShakeEvents(e, skill)



            if (e.type === "touchmove") {
                skill.currentX = e.touches[0].clientX - skill.initialX;
                skill.currentY = e.touches[0].clientY - skill.initialY;
            } else {
                skill.currentX = e.clientX - skill.initialX;
                skill.currentY = e.clientY - skill.initialY;
            }

            if(!isForm)
                Playground.setTranslate(skill.currentX, skill.currentY, skill.element);

        }
    },

    handleShakeEvents: (e, skill) => {

        if(e.type == 'touchmove') {
            if(!skill.initialTouch) {
                skill.initialTouch = e.touches[0]
            } else {
                e.movementX = skill.initialTouch.pageX - skill.previousTouch.pageX;
                e.movementY = skill.initialTouch.pageY - skill.previousTouch.pageY;
            }
            skill.previousTouch = e.touches[0]
        }



        if(e.movementX && e.movementX > Playground.speedLimit) {
            skill.elementMovementRightExceeded = true
            skill.elementMovementXTimeout = setTimeout(function(){
                skill.elementMovementRightExceeded = false
            }, 200)
        }

        if(e.movementX && e.movementX < -Playground.speedLimit) {
            skill.elementMovementLeftExceeded = true
            skill.elementMovementXTimeout = setTimeout(function(){
                skill.elementMovementLeftExceeded = false
            }, 200)
        }

        if(skill.name == 'HIRE ME') {

            if(e.movementY && e.movementY > (Playground.speedLimit)) {
                skill.elementMovementUpExceeded = true
                skill.elementMovementYTimeout = setTimeout(function(){
                    skill.elementMovementUpExceeded = false
                }, 200)
            }

            if(e.movementY && e.movementY < (Playground.speedLimit)) {
                skill.elementMovementDownExceeded = true
                skill.elementMovementYTimeout = setTimeout(function(){
                    skill.elementMovementDownExceeded = false
                }, 200)
            }

            if(skill.elementMovementDownExceeded && skill.elementMovementUpExceeded && skill.infoShowing) {
                e.stopPropagation()
                Playground.dragEnd(e)
                Playground.reset('hire')
                return true;
            }
        }

        if(skill.elementMovementLeftExceeded && skill.elementMovementRightExceeded && !skill.infoShowing) {

            if(skill.name == 'reset();'){
                e.stopPropagation()
                Playground.dragEnd(e)
                Playground.reset('manual')
                return true
            }

            // console.log('e.movementX: ', e.movementX)
            // console.log('e.movementY: ', e.movementY)
            // console.log('Playground.speedLimit: ', Playground.speedLimit)
            // console.log('-Playground.speedLimit: ', -Playground.speedLimit)

            Playground.displayInfoCard(skill)
            Playground.removeShakeHint(skill)
        }

    },

    buildInfoCard: (skill) => {

        skill.elementChild =  document.createElement('div')

        skill.elementChild.style.fontSize = '16px'
        skill.elementChild.classList.add('flex','flex-col','bg-gruvbox-black','cursor-pointer','p-2');

        Playground.buildExperienceDiv(skill)

        skill.elementChildExcerpt =  document.createElement('div')
        skill.elementChildExcerpt.classList.add('m-2', 'align-top', 'md:self-start', 'self-center', 'text-gruvbox-white');
        skill.elementChildExcerpt.innerHTML = skill.excerpt

    },

    buildExperienceDiv: (skill) => {

        skill.elementChildExperienceWrap =  document.createElement('div')
        skill.elementChildExperienceWrap.classList.add('flex','flex-row','cursor-pointer','p-2');

        skill.elementChildExperienceWrapLabel = document.createElement('div')
        skill.elementChildExperienceWrapLabel.innerHTML = 'Experience: &nbsp; &nbsp;'
        skill.elementChildExperienceWrapLabel.classList.add('text-gruvbox-gray','mr-4');

        skill.elementChildExperienceWrapLabelExperience = document.createElement('div')
        skill.elementChildExperienceWrapLabelExperience.innerText = skill.experience
        skill.elementChildExperienceWrapLabelExperience.classList.add('text-'+Playground.getColorBasedOnExperience(skill.experience)+'');

        skill.elementChildExperienceWrapLabelExperienceSlash = document.createElement('div')
        skill.elementChildExperienceWrapLabelExperienceSlash.innerHTML = '&nbsp;/&nbsp;'
        skill.elementChildExperienceWrapLabelExperienceSlash.classList.add('text-gruvbox-white');

        skill.elementChildExperienceWrapLabelExperienceFull = document.createElement('div')
        skill.elementChildExperienceWrapLabelExperienceFull.innerText = '100'
        skill.elementChildExperienceWrapLabelExperienceFull.classList.add('text-gruvbox-white');

    },

    displayInfoCard: (skill) => {

        skill.element.style.fontSize = '3.8em'
        skill.element.style.transform = 'unset'

        skill.element.classList.remove('text-'+Playground.getColorBasedOnExperience(skill.experience))
        skill.element.classList.remove('text-gruvbox-black')

        skill.element.classList.add('bg-'+Playground.getColorBasedOnExperience(skill.experience), 'lg:w-5/12', 'md:w-7/12', 'w-11/12', 'border-r-4', 'border-b-4', 'border-'+Playground.getColorBasedOnExperience(skill.experience))

        // skill.element.classList.add('bg-gradient-to-r', 'from-gruvbox-light-blue', 'via-gruvbox-orange', 'to-gruvbox-red')
        skill.element.style.backgroundImage = 'linear-gradient(to right, rgba(0,0,0,0) '+skill.experience+'%,rgba(0,0,0,0) '+skill.experience+'%, #282828 '+skill.experience+'%)';

        skill.element.appendChild(skill.elementChild)

        if(skill.name != 'README.md' && skill.name != 'HIRE ME') {
            skill.elementChild.appendChild(skill.elementChildExperienceWrap)
            skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabel)
            skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperience)
            skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperienceSlash)
            skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperienceFull)
        }

        skill.elementChild.appendChild(skill.elementChildExcerpt)

        if(skill.name == 'HIRE ME') {

            if(!skill.elementHireHint) {
                skill.heldCounter = 0;
                skill.heldHireInterval = setInterval(() => {
                    skill.heldCounter += 1;

                    if (skill.heldCounter === 3 && skill.infoShowing) {
                        Playground.addHireHint(skill)
                        clearInterval(skill.heldHireInterval);
                    } else if(skill.heldCounter > 3) {
                        Playground.removeHireHint(skill)
                    }
                }, 1000);
            }
        }

        skill.infoShowing = true

    },

    buildForm: () => {

        let formWrap = document.createElement('div')
        let formTitle = document.createElement('h2')
        let hireMeForm = document.createElement('form')
        let formInfo = document.createElement('p')
        let emailInput = document.createElement('input')
        let phoneInput = document.createElement('input')
        let nameInput = document.createElement('input')
        let descriptionInput = document.createElement('textarea')
        let submitButton = document.createElement('button')
        let emailLabel = document.createElement('label')
        let nameLabel = document.createElement('label')
        let phoneLabel = document.createElement('label')
        let descriptionLabel = document.createElement('label')

        // hireMeForm.method = 'POST'
        // hireMeForm.action = '/web-development'
        hireMeForm.id = 'hire_me_form'
        submitButton.type = 'button';
        submitButton.innerText = 'Submit'
        formInfo.innerText = 'Need some web development work done? Fill out the form below with your contact info, and a brief overview of the project at hand, and I will get back to you asap!'
        formTitle.innerText = 'HIRE ME'
        emailLabel.innerText = 'Email'
        nameLabel.innerText = 'Name'
        phoneLabel.innerText = 'Phone Number'
        descriptionLabel.innerText = 'Description'
        emailInput.name = 'email'
        nameInput.name = 'name'
        descriptionInput.name = 'description'
        phoneInput.type = 'tel'
        phoneInputpattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        emailInput.type = 'email'
        nameInput.type = 'text'

        formTitle.classList.add('text-gruvbox-green', 'text-4xl', 'mt-4', 'mb-4')
        formInfo.classList.add('text-gruvbox-white', 'mb-4')
        emailLabel.classList.add('text-gruvbox-white')
        nameLabel.classList.add('text-gruvbox-white')
        phoneLabel.classList.add('text-gruvbox-white')
        descriptionLabel.classList.add('text-gruvbox-white')
        submitButton.classList.add('bg-gruvbox-green', 'text-gruvbox-black', 'text-2xl', 'font-bold', 'p-4', 'mt-4', 'mb-4')
        formWrap.classList.add('m-auto', 'lg:w-5/12', 'md:w-7/12', 'w-11/12',)
        hireMeForm.classList.add('flex', 'flex-col', 'm-8')
        emailInput.classList.add('p-4', 'm-4')
        nameInput.classList.add('p-4', 'm-4')
        phoneInput.classList.add('p-4', 'm-4')
        descriptionInput.classList.add('p-4', 'm-4')


        Playground.playground.appendChild(formWrap)
        formWrap.appendChild(hireMeForm)
        hireMeForm.appendChild(formTitle)
        hireMeForm.appendChild(formInfo)
        hireMeForm.appendChild(nameLabel)
        hireMeForm.appendChild(nameInput)
        hireMeForm.appendChild(emailLabel)
        hireMeForm.appendChild(emailInput)
        hireMeForm.appendChild(phoneLabel)
        hireMeForm.appendChild(phoneInput)
        hireMeForm.appendChild(descriptionLabel)
        hireMeForm.appendChild(descriptionInput)
        hireMeForm.appendChild(submitButton)

        submitButton.onclick =  function(event) {
            event = event || window.event
            event.preventDefault();

            let hireMeForm = document.getElementById('hire_me_form')
            console.log(hireMeForm[0])
            let data = new FormData(hireMeForm)
            console.log(data)

            let csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            let url = '/web-development';

            fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text-plain, */*",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": csrf_token
                    },
                method: 'POST',
                credentials: "same-origin",
                body: JSON.stringify({
                    name: nameInput.value,
                    phone: phoneInput.value,
                    description: descriptionInput.value,
                    email: emailInput.value
                })
            })
            .then(response => response.json())
            .then((data) => {
                if(data.status == 'ok')
                    window.location.href = redirect;
            })
            .catch(function(error) {
                console.log(error);
            });

        }

    },

    addShakeHint: (skill) => {
        skill.elementShakeHint =  document.createElement('div')
        skill.elementShakeHint.classList.add(
            'self-center',
            'justify-self-center',
            'cursor-pointer',
            'text-sm',
            'text-gruvbox-gray',
            'max-w-md',
            'text-center'
        );
        skill.elementShakeHint.innerHTML = '&llarr; shake me! &rrarr;'
        skill.element.appendChild(skill.elementShakeHint)
    },

    addHireHint: (skill) => {
        skill.elementHireHint =  document.createElement('div')
        skill.elementHireHint.classList.add(
            'self-center',
            'justify-self-center',
            'text-sm',
            'text-gruvbox-white',
            'text-center',
            'bg-gruvbox-black',
            'm-auto'
        );
        skill.elementHireHint.innerHTML = '&uuarr; HIRE ME! &ddarr;'
        skill.element.appendChild(skill.elementHireHint)
    },

     removeShakeHint: (skill) => {

        skill.heldCounter = 0

        if(skill.heldInterval)
            clearTimeout(skill.heldInterval)

        if(skill.elementShakeHint){
            skill.element.removeChild(skill.elementShakeHint)
            delete skill.elementShakeHint
        }

    },

    removeHireHint: (skill) => {

        skill.heldCounter = 0

        if(skill.heldHireInterval)
            clearTimeout(skill.heldHireInterval)

        if(skill.elementHireHint){
            skill.element.removeChild(skill.elementHireHint)
            delete skill.elementHireHint
        }

    },

    setTranslate: (xPos, yPos, el) => {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    },

}
