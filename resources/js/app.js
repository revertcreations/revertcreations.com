(function(){
    const app = document.getElementById('app')
    const skills = document.getElementsByClassName('skill')



    for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        skill.addEventListener('mouseover', skillTargeted)
        skill.addEventListener('touchstart', skillTargeted)
    }

    function skillTargeted(e) {
        let title = e.target
        // console.log('e.target', e.target)
        // window.title = e.target
        let target_skill = e.target.innerText.toLowerCase()


        switch (target_skill) {
            case 'design':
                var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
                iframe.exportRoot.triangle.play();
                break;
            case 'code':
                var iframe = document.getElementsByTagName("iframe")[1].contentWindow;
                iframe.exportRoot.code.play()
                break;
            case 'photo':
                var iframe = document.getElementsByTagName("iframe")[2].contentWindow;
                iframe.exportRoot.photo.play()
                document.getElementById('photo_skill_svg').style.zIndex = 10
                break;
        }
        // let blurb = e.target.nextElementSibling;
        // let blurbVisible = blurb.classList.contains('hidden')

        // if(!blurbVisible) {
        //     console.warn(`maybe some cool animation happened to indicate
        //                 that it is already being displayed. or perhaps
        //                 we just hide the blurb agian..`)

        //     title.classList.remove('bg-yellow-300')
        // } else {
        //     title.classList.add('bg-yellow-300')
        // }

        // toggleBlurb(blurb, blurbVisible)
    }


    function toggleBlurb(blurb, blurbVisible) {
        if(blurbVisible) {
            blurb.classList.remove('hidden');
        } else {
            blurb.classList.add('hidden')
        }
    }

    console.log('ran')



})();
