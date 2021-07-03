/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./resources/js/home.js ***!
  \******************************/
var home_title = document.getElementById('home_title');
var photographer = document.getElementById('photographer');
var web_dev = document.getElementById('web_dev');
var photographer_wrap = document.getElementById('photographer_wrap');
var developer_wrap = document.getElementById('developer_wrap');
var homepage_greeting = document.getElementById('homepage_greeting');
var homepage_tag = document.getElementById('homepage_tag');

function resetPhotographerWrap() {
  resetHomePage();
  photographer_wrap.style.display = "none";
}

function resetDeveloperWrap() {
  resetHomePage();
  developer_wrap.style.display = "none";
}

function resetHomepageDeveloperTag() {
  homepage_tag.innerHTML = 'Developer <span class="text-gruvbox-red cursor-pointer hover:text-red-400">&times;</span>';
  homepage_tag.lastChild.addEventListener('click', function () {
    resetDeveloperWrap();
  });
}

function resetHomePage() {
  document.body.style.backgroundImage = "unset";
  document.body.classList.remove('bg-gruvbox-black-hidden', 'text-gruvbox-black');
  home_title.classList.remove('text-gruvbox-yellow', 'text-white');
  home_title.style.backgroundColor = "unset";
  homepage_tag.classList.remove('bg-black', 'text-white', 'text-gruvbox-green', 'bg-gruvbox-black'); // homepage_tag.style.color = "black"
  // homepage_tag.style.backgroundColor = "white"

  homepage_greeting.style.display = 'block';
  homepage_tag.innerHTML = 'Hi there!';
}

if (photographer) {
  photographer.addEventListener('click', function (el) {
    if (developer_wrap.style.display == 'block') resetDeveloperWrap();else resetHomePage();

    if (photographer_wrap.style.display != 'flex') {
      homepage_greeting.style.display = 'none';
      homepage_tag.innerHTML = 'Photographer <span class="text-gruvbox-red cursor-pointer hover:text-red-400">&times;</span>';
      homepage_tag.lastChild.addEventListener('click', function () {
        resetPhotographerWrap();
      });
      homepage_tag.classList.add('bg-black', 'text-white');
      photographer_wrap.style.display = 'flex'; // document.body.style.color = 'white'

      home_title.classList.add('text-white');
      home_title.style.backgroundColor = 'black'; // el.target.style.color = 'black'
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

if (web_dev) {
  web_dev.addEventListener('click', function (el) {
    if (developer_wrap.style.display != 'block') {
      developer_wrap.style.display = 'block';
      homepage_greeting.style.display = 'none';
      homepage_tag.innerHTML = 'Developer <span class="text-gruvbox-red cursor-pointer hover:text-red-400">&times;</span>';
      homepage_tag.lastChild.addEventListener('click', function () {
        resetDeveloperWrap();
      });
      homepage_tag.classList.add('text-6xl', 'bg-gruvbox-black', 'text-gruvbox-green');
    } else {
      developer_wrap.style.display = "none";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundImage = "unset";
    }

    if (!Playground.initialized) Playground.init(data);else Playground.reset();
    if (photographer_wrap.style.display == 'flex') resetPhotographerWrap();
    document.body.style.backgroundImage = 'unset';
    document.body.classList.add('bg-gruvbox-black-hidden'); // document.body.style.color = '#83a598'

    home_title.classList.add('text-gruvbox-yellow');
  });
}
/******/ })()
;