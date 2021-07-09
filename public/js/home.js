/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./resources/js/home.js ***!
  \******************************/
var homeTitle = document.getElementById('home_title');
var photographer = document.getElementById('photographer');
var webDev = document.getElementById('web_dev');
var photographerWrap = document.getElementById('photographer_wrap');
var developerWrap = document.getElementById('developer_wrap');
var homepageGreeting = document.getElementById('homepage_greeting');
var homepageTag = document.getElementById('homepage_tag');

function resetPhotographerWrap() {
  resetHomePage();
  photographerWrap.style.display = "none";
}

function resetDeveloperWrap() {
  resetHomePage();
  developerWrap.style.display = "none";
}

window.resetHomepageDeveloperTag = function () {
  homepageTag.classList.remove('text-gruvbox-red', 'text-gruvbox-white', 'text-gruvbox-purple');
  homepageTag.innerHTML = 'Developer <span class="text-gruvbox-red cursor-pointer hover:text-red-400">&times;</span>';
  homepageTag.lastChild.addEventListener('click', function () {
    resetDeveloperWrap();
  });
};

function resetHomePage() {
  document.body.style.backgroundImage = "unset";
  document.body.classList.remove('bg-gruvbox-black-hidden', 'text-gruvbox-black');
  homeTitle.classList.remove('text-gruvbox-yellow', 'text-white');
  homeTitle.style.backgroundColor = "unset";
  homepageTag.classList.remove('bg-black', 'text-white', 'text-gruvbox-green', 'bg-gruvbox-black'); // homepageTag.style.color = "black"
  // homepageTag.style.backgroundColor = "white"

  homepageGreeting.style.display = 'block';
  homepageTag.innerHTML = 'Hi there!';
}

if (photographer) {
  photographer.addEventListener('click', function (el) {
    if (developerWrap.style.display == 'block') resetDeveloperWrap();else resetHomePage();

    if (photographerWrap.style.display != 'flex') {
      homepageGreeting.style.display = 'none';
      homepageTag.innerHTML = 'Photographer <span class="text-gruvbox-red cursor-pointer hover:text-red-400">&times;</span>';
      homepageTag.lastChild.addEventListener('click', function () {
        resetPhotographerWrap();
      });
      homepageTag.classList.add('bg-black', 'text-white');
      photographerWrap.style.display = 'flex'; // document.body.style.color = 'white'

      homeTitle.classList.add('text-white');
      homeTitle.style.backgroundColor = 'black'; // el.target.style.color = 'black'
      // el.target.style.backgroundColor = 'white'

      var random_image = ~~(Math.random() * portfolio.length);
      console.log('random_image', random_image);
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundImage = "url('" + portfolio[random_image].secure_path + "')";
    } else {
      resetPhotographerWrap();
    }
  });
}

if (webDev) {
  webDev.addEventListener('click', function (el) {
    if (developerWrap.style.display != 'block') {
      developerWrap.style.display = 'block';
      homepageGreeting.style.display = 'none';
      homepageTag.innerHTML = 'Developer <span class="text-gruvbox-red cursor-pointer hover:text-red-400">&times;</span>';
      homepageTag.lastChild.addEventListener('click', function () {
        resetDeveloperWrap();
      });
      homepageTag.classList.add('text-6xl', 'bg-gruvbox-black', 'text-gruvbox-green');
    } else {
      developerWrap.style.display = "none";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundImage = "unset";
    }

    if (!Playground.initialized) Playground.init(data);else Playground.reset();
    if (photographerWrap.style.display == 'flex') resetPhotographerWrap();
    document.body.style.backgroundImage = 'unset';
    document.body.classList.add('bg-gruvbox-black-hidden'); // document.body.style.color = '#83a598'

    homeTitle.classList.add('text-gruvbox-yellow');
  });
}
/******/ })()
;