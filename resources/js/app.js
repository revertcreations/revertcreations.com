import flatpickr from 'flatpickr';
window.flatpickr = flatpickr;

(function(){
    let app = document.getElementById('app')
    let camera_icon = document.getElementById('camera_icon')
    let computer_icon = document.getElementById('computer_icon')
    let photographer = document.getElementById('photographer')
    let web_dev = document.getElementById('web_dev')

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

    if(photographer) {
        photographer.addEventListener('click', el => {

            clearTimeout(photographer_timeout)

            let photographer_info = document.getElementById('photographer_info')

            let photographer_timeout = setTimeout(() => {

                if(photographer_info.style.display != 'block') {
                    console.log('awwwww yes')
                    photographer_info.style.display = 'block'
                    document.body.style.backgroundSize = "cover"
                    document.body.style.backgroundImage = "url('https://res.cloudinary.com/treverhillis/image/upload/photographyPortfolio/jnpoc31vqs12monmrcjk.jpg')"
                } else {
                    console.log('awwwww no')
                    photographer_info.style.display = "none"
                    document.body.style.backgroundSize = "cover"
                    document.body.style.backgroundImage = "unset"
                }
            }, 100, el)

        })
    }

    // if(web_dev) {
    //     photographer.addEventListener('click', el => {
    //         clearTimeout(photographer_timeout)
    //         let photographer_info = document.getElementById('photographer_info')
    //         let photographer_timeout = setTimeout(() => {
    //             // console.log('photographer_info.style.display: ', photographer_info.style.display)
    //             if(photographer_info.style.display != 'block') {
    //                 console.log('awwwww yes')
    //                 photographer_info.style.display = 'block'
    //                 document.body.style.backgroundSize = "cover"
    //                 document.body.style.backgroundImage = "url('https://res.cloudinary.com/treverhillis/image/upload/photographyPortfolio/jnpoc31vqs12monmrcjk.jpg')"
    //             } else {
    //                 console.log('awwwww no')
    //                 photographer_info.style.display = "none"
    //                 document.body.style.backgroundSize = "cover"
    //                 document.body.style.backgroundImage = "unset"
    //             }
    //         }, 100, el)
    //     })
    // }

    if(document.getElementById('event_starts'))
        var event_starts = window.flatpickr(document.getElementById('event_starts'),
            {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                onChange: function(selectedDates, dateStr, instance){

                    if(document.getElementById('event_starts_bound')) {
                        var date = new Date(dateStr)
                        var formatted_date = date.toDateString()+' '+date.toLocaleTimeString()
                        document.getElementById('event_starts_bound').innerText = formatted_date
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

    if(document.getElementById('event_date'))
        var event_ends = window.flatpickr(document.getElementById('event_date'),
                {
                    dateFormat: "Y-m-d H:i",
                }
        );

    if(document.getElementById('arrival_at'))
        var event_ends = window.flatpickr(document.getElementById('arrival_at'),
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

        el.addEventListener('change', function(el){

            console.log('el: ', el.target.value)
            clearTimeout(bound_interval)
            var bound_interval = setTimeout(function(){
                console.log('in time out el: ', el.target.value)
                document.getElementById(el.target.id+'_bound').innerText = el.target.value
                if(el.target.id == 'delivered_images_count' || el.target.id == 'price_per_image') {
                    var price_per_image = document.getElementById('price_per_image')
                    var delivered_images_count = document.getElementById('delivered_images_count')
                    var billing_total_amount = isNaN(parseFloat(price_per_image.value) * parseFloat(delivered_images_count.value)) ? 0 : parseFloat(price_per_image.value) * parseFloat(delivered_images_count.value)
                    console.log('billing_total_amount: ', billing_total_amount)
                    document.getElementById('total_billing_amount_bound_1').innerText = billing_total_amount.toFixed(2)
                    document.getElementById('total_billing_amount_bound_2').innerText = billing_total_amount.toFixed(2)
                }
            }, 400)
        });
    })

    if(document.getElementById('contract_agreement_checkbox')) {

        var agreement = document.getElementById('contract_agreement_checkbox')
        var contract_agreement_button = document.getElementById('contract_agreement_button')

        agreement.addEventListener('click', function(event){
            if(agreement.checked)
                contract_agreement_button.disabled = false
            else
                contract_agreement_button.disabled = true
        })
    }

    // window.send_agreement = function(event) {
    //     event = event || window.event
    //     event.preventDefault();
    //     console.log('send this out')

    //     let csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    //     let token = document.getElementById('photoshoot_token').value;
    //     let photoshoot = document.getElementById('photoshoot_id').value;
    //     let url = '/api/photoshoot/'+photoshoot+'/'+token;
    //     let redirect = '/photography/photoshoot/success'

    //     fetch(url, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json, text-plain, */*",
    //             "X-Requested-With": "XMLHttpRequest",
    //             "X-CSRF-TOKEN": csrf_token
    //             },
    //         method: 'PUT',
    //         credentials: "same-origin",
    //         body: JSON.stringify({
    //         })
    //     })
    //     .then(response => response.json())
    //     .then((data) => {
    //         if(data.status == 'ok')
    //             window.location.href = redirect;
    //     })
    //     .catch(function(error) {
    //         console.log(error);
    //     });

    // }


})();

