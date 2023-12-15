/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/components/NameElement.js":
/*!************************************************!*\
  !*** ./resources/js/components/NameElement.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NameElement: () => (/* binding */ NameElement)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
var _error = /*#__PURE__*/new WeakMap();
var _success = /*#__PURE__*/new WeakMap();
var _success2 = /*#__PURE__*/new WeakMap();
var _unlock = /*#__PURE__*/new WeakMap();
var _unlock2 = /*#__PURE__*/new WeakMap();
var _textColors = /*#__PURE__*/new WeakMap();
var _intervals = /*#__PURE__*/new WeakMap();
var NameElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(NameElement, _HTMLElement);
  var _super = _createSuper(NameElement);
  function NameElement() {
    var _this;
    _classCallCheck(this, NameElement);
    _this = _super.call(this);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _error, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _success, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _success2, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _unlock, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _unlock2, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _textColors, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _intervals, {
      writable: true,
      value: void 0
    });
    _defineProperty(_assertThisInitialized(_this), "loadAnimation", function (span, index) {
      _this.nameLetterClicked({
        target: span
      }, true);
      var count = span.getAttribute('data-loading-count');
      if (count == 20) {
        clearInterval(_classPrivateFieldGet(_assertThisInitialized(_this), _intervals)[index]);
      }
      span.setAttribute('data-loading-count', ++count);
    });
    _defineProperty(_assertThisInitialized(_this), "nameLetterClicked", function (e) {
      var _target$classList;
      var loading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var target = e.target;
      var clickCount = target.getAttribute('data-click-count') || 0;
      (_target$classList = target.classList).remove.apply(_target$classList, _toConsumableArray(_classPrivateFieldGet(_assertThisInitialized(_this), _textColors)));
      if (loading) {
        clickCount = Math.floor(Math.random() * _classPrivateFieldGet(_assertThisInitialized(_this), _textColors).length);
      } else {
        clickCount = clickCount == _classPrivateFieldGet(_assertThisInitialized(_this), _textColors).length ? 0 : ++clickCount;
      }
      target.setAttribute('data-click-count', clickCount);
      target.classList.add(_classPrivateFieldGet(_assertThisInitialized(_this), _textColors)[clickCount]);
      var isGreen = target.classList.contains('text-gruvbox-green');
      var isPurple = target.classList.contains('text-gruvbox-purple');
      if (!loading && (isGreen || isPurple)) {
        if (isGreen) {
          _classPrivateFieldGet(_assertThisInitialized(_this), _success).currentTime = 0;
          _classPrivateFieldGet(_assertThisInitialized(_this), _success).play();
        } else if (isPurple) {
          _classPrivateFieldGet(_assertThisInitialized(_this), _success2).currentTime = 0;
          _classPrivateFieldGet(_assertThisInitialized(_this), _success2).play();
        }
        target.classList.remove('cursor-not-allowed');
        target.classList.add('cursor-copy');
      } else if (!loading) {
        _classPrivateFieldGet(_assertThisInitialized(_this), _error).currentTime = 0;
        _classPrivateFieldGet(_assertThisInitialized(_this), _error).play();
        target.classList.remove('cursor-copy', 'cursor-pointer', 'cursor-not-allowed');
        target.classList.add('cursor-not-allowed');
        setTimeout(function () {
          target.classList.remove('cursor-not-allowed');
          target.classList.add('cursor-pointer');
        }, 500);
      }
      var allGreen = true;
      var allPurple = true;
      _this.childNodes.forEach(function (letter) {
        if (!letter.classList.contains('text-gruvbox-green')) {
          allGreen = false;
        }
        if (!letter.classList.contains('text-gruvbox-purple')) {
          allPurple = false;
        }
      });
      if (!loading) {
        if (allGreen || allPurple) {
          var unlockType = allGreen ? 'green' : 'purple';
          if (allGreen) {
            _classPrivateFieldGet(_assertThisInitialized(_this), _unlock).currentTime = 0;
            _classPrivateFieldGet(_assertThisInitialized(_this), _unlock).play();
          } else {
            _classPrivateFieldGet(_assertThisInitialized(_this), _unlock2).currentTime = 0;
            _classPrivateFieldGet(_assertThisInitialized(_this), _unlock2).play();
          }
          // TODO: add method to create loading state
          // this.nameCursorLoading()
          // TODO: add window event trigger to change content
          window.dispatchEvent(new Event("unlock", {
            type: unlockType
          }));
          // this.disapearingParagraphs(selected)
        }
      }
    });
    _this.dataset.name;
    _classPrivateFieldSet(_assertThisInitialized(_this), _error, new Audio('/audio/error3.wav'));
    _classPrivateFieldSet(_assertThisInitialized(_this), _success, new Audio('/audio/success1.wav'));
    _classPrivateFieldSet(_assertThisInitialized(_this), _success2, new Audio('/audio/success3.wav'));
    _classPrivateFieldSet(_assertThisInitialized(_this), _unlock, new Audio('/audio/unlock.wav'));
    _classPrivateFieldSet(_assertThisInitialized(_this), _unlock2, new Audio('/audio/unlock2.wav'));
    _classPrivateFieldSet(_assertThisInitialized(_this), _textColors, ['text-gruvbox-light-yellow', 'text-gruvbox-yellow', 'text-gruvbox-orange', 'text-gruvbox-purple', 'text-gruvbox-blue', 'text-gruvbox-aqua', 'text-gruvbox-gray', 'text-gruvbox-green', 'text-gruvbox-red']);
    _classPrivateFieldSet(_assertThisInitialized(_this), _intervals, []);
    return _this;
  }
  _createClass(NameElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.render();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      this.dataset.name.split('').forEach(function (letter, i) {
        var span = document.createElement('span');
        span.classList.add('cursor-pointer', 'select-none', 'text-8xl');
        span.innerText = letter;
        span.setAttribute('data-click-count', 0);
        span.setAttribute('data-loading-count', 0);
        span.addEventListener('click', _this2.nameLetterClicked, {
          passive: true
        });
        _this2.appendChild(span);
        _classPrivateFieldGet(_this2, _intervals)[i] = setInterval(_this2.loadAnimation, 50, span, i);
      });
    }
  }, {
    key: "disapearingParagraphs",
    value: function disapearingParagraphs(selected) {
      if (!selected) return;
      var lead = document.getElementById('lead');
      var paragraphs = lead.childNodes;
      var newParagraphs = [];
      var newParagraph;
      paragraphs.forEach(function (paragraph, i) {
        newParagraph = null;
        if (paragraph.nodeType === 1 && (!paragraph.classList || paragraph.classList && !paragraph.classList.contains('hidden'))) {
          newParagraph = document.createElement('p');
          paragraph.classList.forEach(function (className) {
            newParagraph.classList.add(className);
          });
          newParagraph.id = 'exploding-paragraph-' + i;
          paragraph.childNodes.forEach(function (words) {
            var text = words.textContent;
            var letters = text.split('');
            letters.forEach(function (letter) {
              var span = document.createElement('span');
              if (words.classList) {
                words.classList.forEach(function (className) {
                  span.classList.add(className);
                });
              }
              span.innerText = letter;
              if (letter != '\n') {
                newParagraph.appendChild(span);
              }
            });
          });
        }
        if (newParagraph) newParagraphs.push(newParagraph);
      });
      document.getElementById('default').classList.add('hidden');
      document.getElementById('secondary').classList.add('hidden');
      newParagraphs.forEach(function (newParagraph) {
        lead.appendChild(newParagraph);
      });
      var disapearingParagraphs = document.querySelectorAll('#lead p');
      disapearingParagraphs.forEach(function (paragraph) {
        if (!paragraph.classList.contains('hidden')) {
          paragraph.classList.add('overflow-hidden');
          var letters = paragraph.querySelectorAll('span');
          letters.forEach(function (letter) {
            setTimeout(function () {
              if (selected == 'green' && letter.classList.contains('text-gruvbox-green') || selected == 'purple' && letter.classList.contains('text-gruvbox-purple')) {
                letter.style.fontSize = '3rem';
              } else {
                setTimeout(function () {
                  //remove letter from dom
                  paragraph.removeChild(letter);
                }, 2000);
                letter.style.opacity = 0;
                letter.style.transition = "opacity ".concat(Math.random() * (2 - 1), "s ease-in-out");
              }
              document.getElementsByTagName('body')[0].classList.remove('cursor-wait');
            }, 100);
          });
        }
      });
    }
  }, {
    key: "nameCursorLoading",
    value: function nameCursorLoading() {
      var myNameLetters = document.querySelectorAll('#name span');
      myNameLetters.forEach(function (letter) {
        letter.classList.remove('cursor-copy');
        letter.classList.add('cursor-wait');
        setTimeout(function () {
          letter.classList.remove('cursor-wait');
          letter.classList.add('cursor-pointer');
        }, 3000);
      });
      var body = document.getElementsByTagName('body')[0];
      body.classList.add('cursor-wait');
    }
  }]);
  return NameElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define('name-element', NameElement);

/***/ }),

/***/ "./resources/js/components/PuzzleElement.js":
/*!**************************************************!*\
  !*** ./resources/js/components/PuzzleElement.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PuzzleElement: () => (/* binding */ PuzzleElement)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
var _interval = /*#__PURE__*/new WeakMap();
var _time = /*#__PURE__*/new WeakMap();
var _hintCount = /*#__PURE__*/new WeakMap();
var _level = /*#__PURE__*/new WeakMap();
var _held = /*#__PURE__*/new WeakMap();
var _rngX = /*#__PURE__*/new WeakMap();
var _rngY = /*#__PURE__*/new WeakMap();
var PuzzleElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(PuzzleElement, _HTMLElement);
  var _super = _createSuper(PuzzleElement);
  function PuzzleElement() {
    var _this;
    _classCallCheck(this, PuzzleElement);
    _this = _super.call(this);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _interval, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _time, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _hintCount, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _level, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _held, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _rngX, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _rngY, {
      writable: true,
      value: void 0
    });
    _defineProperty(_assertThisInitialized(_this), "glimmerHint", function () {
      var _this$hintCount, _this$hintCount2;
      var content = _this.dataset.content;
      var duration = 300 / _this.dataset.content.split('').length;
      _this.innerHTML = "";
      clearInterval(_classPrivateFieldGet(_assertThisInitialized(_this), _interval));
      content.split('').forEach(function (letter, index) {
        var offset = index * duration;
        var span = document.createElement('span');
        span.innerText = letter;
        _this.appendChild(span);
        setTimeout(function () {
          if (index > 0 && index < content.length) _this.childNodes[index - 1].classList.remove('text-gruvbox-white');
          span.classList.add('text-gruvbox-white');
        }, offset);
      });
      setTimeout(function () {
        _this.innerText = _this.dataset.content;
      }, 300);
      _classPrivateFieldSet(_assertThisInitialized(_this), _interval, setInterval(_this.glimmerHint, 10000));
      _classPrivateFieldSet(_assertThisInitialized(_this), _hintCount, (_this$hintCount = _classPrivateFieldGet(_assertThisInitialized(_this), _hintCount), _this$hintCount2 = _this$hintCount++, _this$hintCount)), _this$hintCount2;
    });
    _defineProperty(_assertThisInitialized(_this), "loadEventListeners", function () {
      _this.addEventListener('mousedown', _this.mDown);
      _this.addEventListener('mouseup', _this.mUp);
      _this.addEventListener('dragstart', _this.dStart);
      _this.addEventListener('dragend', _this.dEnd);
      _this.addEventListener('drag', _this.d);
    });
    _defineProperty(_assertThisInitialized(_this), "removeEventListeners", function () {
      clearInterval(_classPrivateFieldGet(_assertThisInitialized(_this), _interval));
      _this.removeEventListener('mousedown', _this.mDown);
      _this.removeEventListener('mouseup', _this.mUp);
      _this.removeEventListener('dragstart', _this.dStart);
      _this.removeEventListener('dragend', _this.dEnd);
      _this.removeEventListener('drag', _this.d);
      var gem = '💎';
    });
    _defineProperty(_assertThisInitialized(_this), "mDown", function (e) {
      var target = e.target;
      target.setAttribute('draggable', true);
      target.classList.add('shadow-outer', 'text-gruvbox-gray');
    });
    _defineProperty(_assertThisInitialized(_this), "mUp", function (e) {
      var target = e.target;
      target.classList.remove('text-gruvbox-gray', 'shadow-outer', 'cursor-grabbing');
      target.classList.add('cursor-pointer');
    });
    _defineProperty(_assertThisInitialized(_this), "dStart", function (e) {
      var mainHeader = document.getElementById('main_header');
      var footer = document.getElementById('footer');
      var body = document.querySelector('body');
      clearInterval(_classPrivateFieldGet(_assertThisInitialized(_this), _interval));
      var target = e.target;
      target.textContent = "\xA0\xA0\xA0\xA0\xA0\xA0";
      var mainHeaderHeight = mainHeader.offsetHeight;
      var footerHeight = footer.offsetHeight;
      var padding = 15;
      _classPrivateFieldSet(_assertThisInitialized(_this), _level, _classPrivateFieldGet(_assertThisInitialized(_this), _level) === 0 ? 1 : 2);
      var maxHeight = window.innerHeight - footerHeight - padding;
      var minHeight = mainHeaderHeight + padding;
      _classPrivateFieldSet(_assertThisInitialized(_this), _rngX, Math.random() * (window.innerWidth - padding - padding) + padding);
      _classPrivateFieldSet(_assertThisInitialized(_this), _rngY, Math.random() * (maxHeight - minHeight) + minHeight);
      var key = document.createElement('div');
      key.innerHTML = '💡';
      key.classList.add('absolute', 'z-50', 'text-5xl');
      key.id = 'key';
      body.appendChild(key);
      target.classList.remove('cursor-pointer', 'shadow-outer');
      target.classList.add('cursor-grabbing');
    });
    _defineProperty(_assertThisInitialized(_this), "dEnd", function (e) {
      setTimeout(function () {
        _this.glimmerHint();
      }, 1500);
      var target = e.target;
      var body = document.querySelector('body');
      _classPrivateFieldSet(_assertThisInitialized(_this), _level, 0);
      target.textContent = _this.dataset.content;
      target.classList.remove('text-gruvbox-gray', 'shadow-outer', 'cursor-grabbing');
      target.classList.add('cursor-pointer');
      target.setAttribute('draggable', false);
      body.removeChild(document.getElementById('key'));
    });
    _defineProperty(_assertThisInitialized(_this), "d", function (e) {
      var target = e.target;
      var key = document.getElementById('key');
      var eh = document.getElementById('eh');
      var mouseX = e.clientX;
      var mouseY = e.clientY;
      key.style.left = "".concat(mouseX - 20, "px");
      key.style.top = "".concat(mouseY - 40, "px");
      var ehPosition = eh.getBoundingClientRect();
      var deltaX = _classPrivateFieldGet(_assertThisInitialized(_this), _rngX) - mouseX;
      var deltaY = _classPrivateFieldGet(_assertThisInitialized(_this), _rngY) - mouseY;
      if (_classPrivateFieldGet(_assertThisInitialized(_this), _level) === 2) {
        deltaX = ehPosition.x + ehPosition.width / 2 - mouseX;
        deltaY = ehPosition.y + ehPosition.height / 2 - mouseY;
      }
      var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      var theta = Math.atan2(deltaY, deltaX);
      var angle = theta / Math.PI * 180 + (theta > 0 ? 0 : 360);

      // the added 225 degrees is to account for the emoji being already rotated
      var rotate = 0;
      if (_classPrivateFieldGet(_assertThisInitialized(_this), _level) === 2 && _classPrivateFieldGet(_assertThisInitialized(_this), _held) === null) {
        rotate = angle + 225;
      }
      key.style.transform = "rotate(".concat(rotate, "deg)");
      if (mouseX > _classPrivateFieldGet(_assertThisInitialized(_this), _rngX) && mouseX < _classPrivateFieldGet(_assertThisInitialized(_this), _rngX) + ehPosition.width && mouseY > _classPrivateFieldGet(_assertThisInitialized(_this), _rngY) && mouseY < _classPrivateFieldGet(_assertThisInitialized(_this), _rngY) + ehPosition.height) {
        target.classList.remove('cursor-grabbing');
        target.classList.add('cursor-progress');
        key.style.textShadow = "0 0 10px #cc241d, 0 0 18px #cc241d, 0 0 20px #cc241d";
        if (_classPrivateFieldGet(_assertThisInitialized(_this), _held) === null) {
          _classPrivateFieldSet(_assertThisInitialized(_this), _held, new Date());
          _classPrivateFieldSet(_assertThisInitialized(_this), _held, _classPrivateFieldGet(_assertThisInitialized(_this), _held).setSeconds(_classPrivateFieldGet(_assertThisInitialized(_this), _held).getSeconds() + 2));
        } else if (_classPrivateFieldGet(_assertThisInitialized(_this), _held) < new Date().getTime()) {
          _classPrivateFieldSet(_assertThisInitialized(_this), _level, 2);
          _classPrivateFieldSet(_assertThisInitialized(_this), _held, null);
          _classPrivateFieldSet(_assertThisInitialized(_this), _rngX, ehPosition.x - mouseX);
          _classPrivateFieldSet(_assertThisInitialized(_this), _rngY, ehPosition.y - mouseY);
          key.innerHTML = '🔑';
          key.style.textShadow = "none";
          key.style.color = "#000000";
        }
      } else if (distance <= 400 && _classPrivateFieldGet(_assertThisInitialized(_this), _level) === 1) {
        _classPrivateFieldSet(_assertThisInitialized(_this), _held, null);
        var spread = distance < 100 ? 0.5 : 0.1;
        if (distance < 25) {
          key.style.textShadow = "0 0 ".concat(distance / spread, "px #fe8019, 0 0 ").concat(distance / spread, "px #fe8019, 0 0 ").concat(distance / spread, "px #EDD205");
          key.style.color = "#fe8019";
        } else {
          key.style.textShadow = "0 0 ".concat(distance / spread, "px #FFE205, 0 0 ").concat(distance / spread, "px #FFE205, 0 0 ").concat(distance / spread, "px #EDD205");
          key.style.color = "#FFE205";
        }
      } else if (_classPrivateFieldGet(_assertThisInitialized(_this), _level) !== 2) {
        _classPrivateFieldSet(_assertThisInitialized(_this), _held, null);
        key.style.textShadow = "none";
        key.style.color = "#000000";
        eh.classList.remove('text-gruvbox-yellow');
        eh.classList.add('text-gruvbox-gray');
      }
      if (target.classList.contains('cursor-progress')) {
        target.classList.remove('cursor-progress');
        target.classList.add('cursor-grabbing');
      }
      if (_classPrivateFieldGet(_assertThisInitialized(_this), _level) === 2 && mouseX > ehPosition.x && mouseX < ehPosition.x + ehPosition.width && mouseY > ehPosition.y && mouseY < ehPosition.y + ehPosition.height) {
        eh.classList.remove('text-gruvbox-gray');
        eh.classList.add('text-gruvbox-yellow');
        if (_classPrivateFieldGet(_assertThisInitialized(_this), _held) === null) {
          _classPrivateFieldSet(_assertThisInitialized(_this), _held, new Date());
          _classPrivateFieldSet(_assertThisInitialized(_this), _held, _classPrivateFieldGet(_assertThisInitialized(_this), _held).setSeconds(_classPrivateFieldGet(_assertThisInitialized(_this), _held).getSeconds() + 2));
        } else if (_classPrivateFieldGet(_assertThisInitialized(_this), _held) < new Date().getTime()) {
          _classPrivateFieldSet(_assertThisInitialized(_this), _held, null);
          key.innerHTML = '🔓';
          _classPrivateFieldSet(_assertThisInitialized(_this), _level, 3);
          var detail = {
            'hintCount': _classPrivateFieldGet(_assertThisInitialized(_this), _hintCount),
            'time': (new Date() - _classPrivateFieldGet(_assertThisInitialized(_this), _time)) / 1000
          };
          window.dispatchEvent(new CustomEvent('won', {
            detail: detail
          }));
          _this.removeEventListeners();
        } else if (_classPrivateFieldGet(_assertThisInitialized(_this), _level) < 3) {
          key.innerHTML = '🔐';
        }
      } else {
        if (_classPrivateFieldGet(_assertThisInitialized(_this), _level) == 2) {
          key.innerHTML = '🔑';
          _classPrivateFieldSet(_assertThisInitialized(_this), _held, null);
        }
        eh.classList.remove('text-gruvbox-yellow');
        eh.classList.add('text-gruvbox-gray');
      }
    });
    _this.dataset.content;
    _classPrivateFieldSet(_assertThisInitialized(_this), _interval, null);
    _classPrivateFieldSet(_assertThisInitialized(_this), _time, new Date());
    _classPrivateFieldSet(_assertThisInitialized(_this), _hintCount, 0);
    _classPrivateFieldSet(_assertThisInitialized(_this), _level, 0);
    _classPrivateFieldSet(_assertThisInitialized(_this), _held, null);
    _classPrivateFieldSet(_assertThisInitialized(_this), _rngX, null);
    _classPrivateFieldSet(_assertThisInitialized(_this), _rngY, null);
    return _this;
  }
  _createClass(PuzzleElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;
      this.innerText = this.dataset.content;
      this.loadEventListeners();
      setTimeout(function () {
        _this2.glimmerHint();
      }, 500);
    }
  }]);
  return PuzzleElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define('puzzle-element', PuzzleElement);

/***/ }),

/***/ "./resources/js/home.js":
/*!******************************!*\
  !*** ./resources/js/home.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_NameElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/NameElement.js */ "./resources/js/components/NameElement.js");
/* harmony import */ var _components_PuzzleElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/PuzzleElement.js */ "./resources/js/components/PuzzleElement.js");



//window.addEventListener("DOMContentLoaded", () => {});

/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/home": 0,
/******/ 			"css/app": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/js/home.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/css/app.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;