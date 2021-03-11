import flatpickr from 'flatpickr';
window.flatpickr = flatpickr;

(function(){
    let camera_icon = document.getElementById('camera_icon')
    let computer_icon = document.getElementById('computer_icon')

    if(camera_icon)
        camera_icon.addEventListener('mouseover', el => {
            clearTimeout(camera_icon_flash)
            el.target.innerHTML = '&#128248;';

            let camera_icon_flash = setTimeout(() => {
                el.target.innerHTML = '&#128247;';
            }, 200, el);
        })

    if(computer_icon)
        computer_icon.addEventListener('mouseover', el => {
            clearTimeout(computer_icon_flash)
            el.target.innerHTML = '&#x1F9D1;&#x200D;&#x1F4BB;';

            let computer_icon_flash = setTimeout(() => {
                el.target.innerHTML = '&#128421;';
            }, 600, el);
        })


        if(document.getElementById('event_starts'))
            var event_starts = window.flatpickr(document.getElementById('event_starts'),
                {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                }
            );

        if(document.getElementById('event_ends'))
            var event_ends = window.flatpickr(document.getElementById('event_ends'),
                    {
                        enableTime: true,
                        dateFormat: "Y-m-d H:i",
                    }
            );

})();

