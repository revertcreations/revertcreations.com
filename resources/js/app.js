(function(){
    let camera_icon = document.getElementById('camera_icon')
    let computer_icon = document.getElementById('computer_icon')

    camera_icon.addEventListener('mouseover', el => {
        clearTimeout(camera_icon_flash)
        el.target.innerHTML = '&#128248;';

        let camera_icon_flash = setTimeout(() => {
            el.target.innerHTML = '&#128247;';
        }, 200, el);
    })

    computer_icon.addEventListener('mouseover', el => {
        clearTimeout(computer_icon_flash)
        el.target.innerHTML = '&#x1F9D1;&#x200D;&#x1F4BB;';

        let computer_icon_flash = setTimeout(() => {
            el.target.innerHTML = '&#128421;';
        }, 600, el);
    })
})();
