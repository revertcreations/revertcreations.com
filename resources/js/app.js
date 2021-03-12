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
                onChange: function(selectedDates, dateStr, instance){

                    if(document.getElementById('event_starts_bound')) {
                        document.getElementById('event_starts_bound').innerText = dateStr
                    }
                },
            }
        );

    if(document.getElementById('event_ends'))
        var event_ends = window.flatpickr(document.getElementById('event_ends'),
                {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                }
        );


    function addAutoResize() {
        document.querySelectorAll('[data-autoresize]').forEach(function (element) {
            element.style.boxSizing = 'border-box';
            var offset = element.offsetHeight - element.clientHeight;
            element.addEventListener('input', function (event) {
            event.target.style.height = 'auto';
            event.target.style.height = event.target.scrollHeight + offset + 'px';
            });
            element.removeAttribute('data-autoresize');
        });
    }

    document.querySelectorAll('[x-bind-contract]').forEach(el => {

        el.addEventListener('keydown', function(el){

            console.log('el: ', el.target.value)
            clearTimeout(bound_interval)
            var bound_interval = setTimeout(function(){
                console.log('in time out el: ', el.target.value)
                document.getElementById(el.target.id+'_bound').innerText = el.target.value
                if(el.target.id == 'delivered_images_count' || el.target.id == 'price_per_image') {
                    var price_per_image = document.getElementById('price_per_image')
                    var delivered_images_count = document.getElementById('delivered_images_count')
                    var billing_total_ammount = isNaN(parseInt(price_per_image.value) * parseInt(delivered_images_count.value)) ? "0.00" : parseInt(price_per_image.value) * parseInt(delivered_images_count.value)
                    document.getElementById('total_billing_amount_bound_1').innerText = billing_total_ammount
                    document.getElementById('total_billing_amount_bound_2').innerText = billing_total_ammount
                }
            }, 400)
        });
    })


})();

