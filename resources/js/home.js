const homeTitle = document.getElementById('home_title')
const photographer = document.getElementById('photographer')
const photographerWrap = document.getElementById('photographer_wrap')
const videographerWrap = document.getElementById('videographer_wrap')

const homepageTag = document.getElementById('homepage_tag')

(function() {
  setRandomPhoto();
})();


/* Photos */

function setRandomPhoto() {
    let random_image = ~~(Math.random() * (portfolio.length))

    document.body.style.backgroundSize = "cover"
    document.body.style.backgroundImage = "url('"+portfolio[random_image].secure_path+"')"
}
