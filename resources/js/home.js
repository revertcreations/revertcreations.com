const homeTitle = document.getElementById('home_title')
const photographer = document.getElementById('photographer')
const webDev = document.getElementById('web_dev')
const photographerWrap = document.getElementById('photographer_wrap')
const developerWrap = document.getElementById('developer_wrap')
const homepageGreeting = document.getElementById('homepage_greeting')
const homepageTag = document.getElementById('homepage_tag')

function resetPhotographerWrap(){
    resetHomePage()
    photographerWrap.style.display = "none"
}

function resetDeveloperWrap(){
    resetHomePage()
    developerWrap.style.display = "none"
}

window.resetHomepageDeveloperTag = () => {
    homepageTag.classList.remove('text-gruvbox-red', 'text-gruvbox-white', 'text-gruvbox-purple')
    homepageTag.innerHTML = 'Developer <span class="text-gruvbox-red cursor-pointer hover:text-red-400">&times;</span>'
    homepageTag.lastChild.addEventListener('click', () => {
        resetDeveloperWrap()
    })
}

function resetHomePage() {

    document.body.style.backgroundImage = "unset"
    document.body.classList.remove('bg-gruvbox-black-hidden', 'text-gruvbox-black')

    homeTitle.classList.remove('text-gruvbox-yellow', 'text-white')
    homeTitle.style.backgroundColor = "unset"

    homepageTag.classList.remove('bg-black', 'text-white', 'text-gruvbox-green', 'bg-gruvbox-black')

    homepageGreeting.style.display = 'block'

    homepageTag.innerHTML = 'Hi there!'
}

if(photographer) {

    photographer.addEventListener('click', el => {

        if(developerWrap.style.display == 'block')
            resetDeveloperWrap()
        else
            resetHomePage()

        if(photographerWrap.style.display != 'flex') {

            homepageGreeting.style.display = 'none'

            homepageTag.innerHTML = 'Photographer <span class="text-gruvbox-red cursor-pointer hover:text-red-400">&times;</span>'
            homepageTag.lastChild.addEventListener('click', () => {
                resetPhotographerWrap()
            })
            homepageTag.classList.add('bg-black', 'text-white')

            photographerWrap.style.display = 'flex'

            homeTitle.classList.add('text-white')
            homeTitle.style.backgroundColor = 'black'

            let random_image = ~~(Math.random() * (portfolio.length))

            document.body.style.backgroundSize = "cover"
            document.body.style.backgroundImage = "url('"+portfolio[random_image].secure_path+"')"
        } else {
            resetPhotographerWrap()
        }
    })
}

if(webDev) {

    webDev.addEventListener('click', el => {

        if(developerWrap.style.display != 'block') {
            developerWrap.style.display = 'block'

            homepageGreeting.style.display = 'none'

            homepageTag.innerHTML = 'Developer <span class="text-gruvbox-red cursor-pointer hover:text-red-400">&times;</span>'
            homepageTag.lastChild.addEventListener('click', () => {
                resetDeveloperWrap()
            })
            homepageTag.classList.add('bg-gruvbox-black', 'text-gruvbox-green')

        } else {
            developerWrap.style.display = "none"
            document.body.style.backgroundSize = "cover"
            document.body.style.backgroundImage = "unset"
        }

        if(!Playground.initialized)
            Playground.init(data)
        else
            Playground.reset()

        if(photographerWrap.style.display == 'flex')
            resetPhotographerWrap()

        document.body.style.backgroundImage = 'unset'
        document.body.classList.add('bg-gruvbox-black-hidden')
        // document.body.style.color = '#83a598'

        homeTitle.classList.add('text-gruvbox-yellow')

    })
}


