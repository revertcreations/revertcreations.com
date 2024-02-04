/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/components/ContentElement.js":
/*!***************************************************!*\
  !*** ./resources/js/components/ContentElement.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContentElement)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var ContentElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(ContentElement, _HTMLElement);
  function ContentElement() {
    _classCallCheck(this, ContentElement);
    return _callSuper(this, ContentElement);
  }
  _createClass(ContentElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {}
  }, {
    key: "disapearingParagraphs",
    value: function disapearingParagraphs(selected) {
      if (!selected) return;
      var lead = document.getElementById("lead");
      var paragraphs = lead.childNodes;
      var newParagraphs = [];
      var newParagraph;
      paragraphs.forEach(function (paragraph, i) {
        newParagraph = null;
        if (paragraph.nodeType === 1 && (!paragraph.classList || paragraph.classList && !paragraph.classList.contains("hidden"))) {
          newParagraph = document.createElement("p");
          paragraph.classList.forEach(function (className) {
            newParagraph.classList.add(className);
          });
          newParagraph.id = "exploding-paragraph-" + i;
          paragraph.childNodes.forEach(function (words) {
            var text = words.textContent;
            var letters = text.split("");
            letters.forEach(function (letter) {
              var span = document.createElement("span");
              if (words.classList) {
                words.classList.forEach(function (className) {
                  span.classList.add(className);
                });
              }
              span.innerText = letter;
              if (letter != "\n") {
                newParagraph.appendChild(span);
              }
            });
          });
        }
        if (newParagraph) newParagraphs.push(newParagraph);
      });
      document.getElementById("default").classList.add("hidden");
      document.getElementById("secondary").classList.add("hidden");
      newParagraphs.forEach(function (newParagraph) {
        lead.appendChild(newParagraph);
      });
      var disapearingParagraphs = document.querySelectorAll("#lead p");
      disapearingParagraphs.forEach(function (paragraph) {
        if (!paragraph.classList.contains("hidden")) {
          paragraph.classList.add("overflow-hidden");
          var letters = paragraph.querySelectorAll("span");
          letters.forEach(function (letter) {
            setTimeout(function () {
              if (selected == "green" && letter.classList.contains("text-gruvbox-green")) {
                letter.style.fontSize = "3rem";
                setTimeout(function () {
                  paragraph.removeChild(letter);
                }, 3500);
              } else {
                setTimeout(function () {
                  //remove letter from dom
                  paragraph.removeChild(letter);
                  window.dispatchEvent("foo");
                }, 2000);
                letter.style.opacity = 0;
                letter.style.transition = "opacity ".concat(Math.random() * (2 - 1), "s ease-in-out");
              }
              document.getElementsByTagName("body")[0].classList.remove("cursor-wait");
            }, 100);
          });
        }
      });
    }
  }]);
  return ContentElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));


/***/ }),

/***/ "./resources/js/components/HintElement.js":
/*!************************************************!*\
  !*** ./resources/js/components/HintElement.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HintElement: () => (/* binding */ HintElement)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
var treasure = document.getElementsByTagName("treasure-element")[0];
var _time = /*#__PURE__*/new WeakMap();
var _level = /*#__PURE__*/new WeakMap();
var _hintCount = /*#__PURE__*/new WeakMap();
var _hintInterval = /*#__PURE__*/new WeakMap();
var _held = /*#__PURE__*/new WeakMap();
var _scoring = /*#__PURE__*/new WeakMap();
var _animating = /*#__PURE__*/new WeakMap();
var _rngX = /*#__PURE__*/new WeakMap();
var _rngY = /*#__PURE__*/new WeakMap();
var _targetPosition = /*#__PURE__*/new WeakMap();
var _emoji = /*#__PURE__*/new WeakMap();
var _disableRotateEmoji = /*#__PURE__*/new WeakMap();
var _levelTwoAnimationTimeout = /*#__PURE__*/new WeakMap();
var _glimmerHintTimeout = /*#__PURE__*/new WeakMap();
var HintElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(HintElement, _HTMLElement);
  function HintElement() {
    var _this;
    _classCallCheck(this, HintElement);
    _this = _callSuper(this, HintElement);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _time, {
      writable: true,
      value: new Date()
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _level, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _hintCount, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _hintInterval, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _held, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _scoring, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _animating, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _rngX, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _rngY, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _targetPosition, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _emoji, {
      writable: true,
      value: document.createElement("div")
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _disableRotateEmoji, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _levelTwoAnimationTimeout, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _glimmerHintTimeout, {
      writable: true,
      value: null
    });
    _defineProperty(_assertThisInitialized(_this), "loadEventListeners", function () {
      _this.addEventListener("mousedown", _this.handleMouseDown);
      _this.addEventListener("mouseup", _this.handleMouseUp);
      _this.addEventListener("touchcancel", _this.handleMouseUp);
      _this.addEventListener("dragstart", _this.handleDragStart);
      _this.addEventListener("touchstart", _this.handleDragStart, true);
      _this.addEventListener("dragend", _this.handleDragEnd);
      _this.addEventListener("touchend", _this.handleDragEnd, true);
      _this.addEventListener("drag", _this.handleDrag);
      _this.addEventListener("touchmove", _this.handleDrag, true);
      treasure.addEventListener("dragenter", _this.handleDragEnter);
      treasure.addEventListener("dragleave", _this.handleDragLeave);
    });
    _defineProperty(_assertThisInitialized(_this), "removeEventListeners", function () {
      clearInterval(_classPrivateFieldGet(_assertThisInitialized(_this), _hintInterval));
      _this.removeEventListener("mousedown", _this.handleMouseDown);
      _this.removeEventListener("mouseup", _this.handleMouseUp);
      _this.removeEventListener("dragstart", _this.handleDragStart);
      _this.removeEventListener("dragend", _this.handleDragEnd);
      _this.removeEventListener("drag", _this.handleDrag);
      treasure.removeEventListener("dragenter", _this.handleDragEnter);
      treasure.removeEventListener("dragleave", _this.handleDragLeave);
    });
    _defineProperty(_assertThisInitialized(_this), "handleMouseDown", function (e) {
      var target = e.target;
      target.setAttribute("draggable", true);
      target.classList.add("shadow-outer", "text-gruvbox-gray");
    });
    _defineProperty(_assertThisInitialized(_this), "handleMouseUp", function (e) {
      var target = e.target;
      target.classList.remove("text-gruvbox-gray", "shadow-outer", "cursor-grabbing");
      target.classList.add("cursor-pointer");
      target.setAttribute("draggable", false);
    });
    _defineProperty(_assertThisInitialized(_this), "handleDragEnter", function () {
      if (_classPrivateFieldGet(_assertThisInitialized(_this), _level) < 2) _classPrivateFieldSet(_assertThisInitialized(_this), _disableRotateEmoji, true);
      _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).style.transform = "none";
      _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).innerHTML = "🔒";
    });
    _defineProperty(_assertThisInitialized(_this), "handleDragLeave", function () {
      _classPrivateFieldSet(_assertThisInitialized(_this), _disableRotateEmoji, false);
      _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).innerHTML = "🧭";
    });
    _defineProperty(_assertThisInitialized(_this), "handleDragStart", function (e) {
      var target = e.target;
      var mainHeader = document.getElementById("main_header");
      var footer = document.getElementById("footer");
      var body = document.querySelector("body");
      var mainHeaderHeight = mainHeader.offsetHeight;
      var footerHeight = footer.offsetHeight;
      var padding = 15;
      var maxHeight = window.innerHeight - footerHeight - padding;
      var minHeight = mainHeaderHeight + padding;
      clearInterval(_classPrivateFieldGet(_assertThisInitialized(_this), _hintInterval));
      target.textContent = "\xA0\xA0\xA0\xA0\xA0\xA0";
      _classPrivateFieldSet(_assertThisInitialized(_this), _rngX, Math.random() * (window.innerWidth - padding - padding) + padding);
      _classPrivateFieldSet(_assertThisInitialized(_this), _rngY, Math.random() * (maxHeight - minHeight) + minHeight);
      _this.levelUp();
      _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).innerHTML = "🧭";
      _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).classList.add("absolute", "z-50", "text-5xl");
      _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).id = "emoji";
      body.appendChild(_classPrivateFieldGet(_assertThisInitialized(_this), _emoji));
      target.classList.remove("cursor-pointer", "shadow-outer");
      target.classList.add("cursor-grabbing");
    });
    _defineProperty(_assertThisInitialized(_this), "handleDrag", function (e) {
      var target = e.target;
      var clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
      var clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
      var emojiOffset = clientX == 0 && clientY == 0 ? -100 : 10;
      _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).style.left = "".concat(clientX - emojiOffset, "px");
      _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).style.top = "".concat(clientY + emojiOffset, "px");
      if (clientX == 0 && clientY == 0) {
        return;
      }
      var distanceToTreasure = _this.rotateKeyAndReturnDistanceToTarget(clientX, clientY);
      if (_this.isInTarget(clientX, clientY)) {
        _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).style.transform = "none";
        target.classList.remove("cursor-grabbing");
        target.classList.add("cursor-progress");
        if (_classPrivateFieldGet(_assertThisInitialized(_this), _held) === null) {
          _classPrivateFieldSet(_assertThisInitialized(_this), _held, new Date());
          _classPrivateFieldSet(_assertThisInitialized(_this), _held, _classPrivateFieldGet(_assertThisInitialized(_this), _held).setSeconds(_classPrivateFieldGet(_assertThisInitialized(_this), _held).getSeconds() + 2.0));
        } else if (_classPrivateFieldGet(_assertThisInitialized(_this), _held) < new Date().getTime()) {
          target.classList.remove("cursor-progress");
          _this.levelUp();
          if (_classPrivateFieldGet(_assertThisInitialized(_this), _level) == 2) {
            target.classList.add("cursor-pointer");
            _this.animateLevelTwo();
          } else {
            _this.animateLevelThree();
          }
        } else {
          _classPrivateFieldGet(_assertThisInitialized(_this), _level) == 1 ? _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).innerHTML = "⏳" : _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).innerHTML = "🔐";
        }
      } else {
        _classPrivateFieldSet(_assertThisInitialized(_this), _held, null);
        if (!_classPrivateFieldGet(_assertThisInitialized(_this), _animating)) _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).innerHTML = _classPrivateFieldGet(_assertThisInitialized(_this), _level) == 1 ? "🧭" : "🔑";
        target.classList.remove("text-gruvbox-yellow", "cursor-progress");
        target.classList.add("text-gruvbox-gray", "cursor-grabbing");
      }
      if (_this.inRangeOfTreasureHintAndOfLevel(distanceToTreasure)) {
        window.dispatchEvent(new CustomEvent("treasureHint", {
          detail: {
            distanceToTreasure: distanceToTreasure
          }
        }));
      }
    });
    _defineProperty(_assertThisInitialized(_this), "handleDragEnd", function (e) {
      clearTimeout(_classPrivateFieldGet(_assertThisInitialized(_this), _glimmerHintTimeout));
      _classPrivateFieldSet(_assertThisInitialized(_this), _glimmerHintTimeout, setTimeout(function () {
        _this.glimmerHint();
      }, 10000));
      var target = e.target;
      var body = document.querySelector("body");
      if (document.getElementById('emoji')) body.removeChild(document.getElementById('emoji'));
      _classPrivateFieldSet(_assertThisInitialized(_this), _level, 0);
      target.textContent = _this.dataset.content;
      target.classList.remove("text-gruvbox-gray", "shadow-outer", "cursor-grabbing");
      target.classList.add("cursor-pointer");
      target.setAttribute("draggable", false);
    });
    _defineProperty(_assertThisInitialized(_this), "glimmerHint", function () {
      var _this$hintCount, _this$hintCount2;
      var content = _this.dataset.content;
      var duration = 300 / _this.dataset.content.split("").length;
      _this.innerHTML = "";
      _this.classList.remove("cursor-pointer");
      _this.classList.add("select-none");
      _this.removeAttribute("draggable");
      _this.removeEventListener("mousedown", _this.handleMouseDown);
      clearInterval(_classPrivateFieldGet(_assertThisInitialized(_this), _hintInterval));
      content.split("").forEach(function (letter, index) {
        var offset = index * duration;
        var span = document.createElement("span");
        span.innerText = letter;
        _this.appendChild(span);
        setTimeout(function () {
          if (index > 0 && index < content.length) {
            _this.childNodes[index - 1].classList.remove("text-gruvbox-white");
          }
          span.classList.add("text-gruvbox-white");
        }, offset);
      });
      setTimeout(function () {
        _this.innerText = _this.dataset.content;
        _this.classList.remove("select-none");
        _this.classList.add("cursor-pointer");
        _this.setAttribute("draggable", true);
        _this.addEventListener("mousedown", _this.handleMouseDown);
      }, 300);
      _classPrivateFieldSet(_assertThisInitialized(_this), _hintInterval, setInterval(_this.glimmerHint, 10000));
      _classPrivateFieldSet(_assertThisInitialized(_this), _hintCount, (_this$hintCount = _classPrivateFieldGet(_assertThisInitialized(_this), _hintCount), _this$hintCount2 = _this$hintCount++, _this$hintCount)), _this$hintCount2;
    });
    _defineProperty(_assertThisInitialized(_this), "rotateKeyAndReturnDistanceToTarget", function (mouseX, mouseY) {
      if (!_classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition)) return;
      var deltaX = _classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition).x + _classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition).width / 2 - mouseX;
      var deltaY = _classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition).y + _classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition).height / 2 - mouseY;
      var distanceToTreasure = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      var theta = Math.atan2(deltaY, deltaX);
      var angle = theta / Math.PI * 180 + (theta > 0 ? 0 : 360);

      // adjusting the initial rotation of the emojis
      var rotate = 0;
      if (!_classPrivateFieldGet(_assertThisInitialized(_this), _disableRotateEmoji)) {
        if (_classPrivateFieldGet(_assertThisInitialized(_this), _level) == 1 && _classPrivateFieldGet(_assertThisInitialized(_this), _held) === null) {
          rotate = angle + 45;
        } else if (_classPrivateFieldGet(_assertThisInitialized(_this), _level) == 2 && _classPrivateFieldGet(_assertThisInitialized(_this), _held) === null) {
          rotate = angle + 225;
        }
        _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).style.transform = "rotate(".concat(rotate, "deg)");
      }
      return distanceToTreasure;
    });
    _defineProperty(_assertThisInitialized(_this), "isInTarget", function (mouseX, mouseY) {
      if (!_classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition)) return;
      return mouseX > _classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition).x && mouseX < _classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition).x + _classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition).width && mouseY > _classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition).y && mouseY < _classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition).y + _classPrivateFieldGet(_assertThisInitialized(_this), _targetPosition).height;
    });
    _defineProperty(_assertThisInitialized(_this), "animateLevelTwo", function () {
      _classPrivateFieldSet(_assertThisInitialized(_this), _held, null);
      _classPrivateFieldSet(_assertThisInitialized(_this), _animating, true);
      _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).innerHTML = "⌛";
      _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).style.transform = "none";
      _classPrivateFieldSet(_assertThisInitialized(_this), _levelTwoAnimationTimeout, setTimeout(function () {
        _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).classList.remove("text-5xl");
        _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).classList.add("text-2xl");
        _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).innerHTML = "✨";
        setTimeout(function () {
          _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).classList.remove("text-2xl");
          _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).classList.add("text-3xl");
          setTimeout(function () {
            _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).classList.remove("text-3xl");
            _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).classList.add("text-5xl");
            setTimeout(function () {
              _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).style.transform = "none";
              _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).innerHTML = "🔑";
              _classPrivateFieldSet(_assertThisInitialized(_this), _animating, false);
              clearTimeout(_classPrivateFieldGet(_assertThisInitialized(_this), _levelTwoAnimationTimeout));
            }, 200);
          }, 200);
        }, 400);
      }, 500));
    });
    _defineProperty(_assertThisInitialized(_this), "animateLevelThree", function () {
      _classPrivateFieldSet(_assertThisInitialized(_this), _animating, true);
      _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).innerHTML = "🔓";
      setTimeout(function () {
        _classPrivateFieldGet(_assertThisInitialized(_this), _emoji).innerHTML = "🎉";
      }, 200);
      _this.analyticsTreasure({
        hintCount: _classPrivateFieldGet(_assertThisInitialized(_this), _hintCount),
        time: (new Date() - _classPrivateFieldGet(_assertThisInitialized(_this), _time)) / 1000
      });
    });
    _defineProperty(_assertThisInitialized(_this), "levelUp", function () {
      var _this$level;
      _classPrivateFieldSet(_assertThisInitialized(_this), _level, (_this$level = _classPrivateFieldGet(_assertThisInitialized(_this), _level), ++_this$level));
      _classPrivateFieldSet(_assertThisInitialized(_this), _targetPosition, _classPrivateFieldGet(_assertThisInitialized(_this), _level) == 1 ? {
        x: _classPrivateFieldGet(_assertThisInitialized(_this), _rngX),
        y: _classPrivateFieldGet(_assertThisInitialized(_this), _rngY),
        width: 20,
        height: 20
      } : treasure.getBoundingClientRect());
    });
    _defineProperty(_assertThisInitialized(_this), "inRangeOfTreasureHintAndOfLevel", function (distanceToTreasure) {
      return distanceToTreasure <= 400 && _classPrivateFieldGet(_assertThisInitialized(_this), _level) == 2;
    });
    _defineProperty(_assertThisInitialized(_this), "analyticsTreasure", function (detail) {
      _classPrivateFieldSet(_assertThisInitialized(_this), _animating, false);
      if (!_classPrivateFieldGet(_assertThisInitialized(_this), _scoring)) {
        _classPrivateFieldSet(_assertThisInitialized(_this), _scoring, true);
        _this.removeEventListeners();
        var request = new Request(window.location.href + "puzzle/1/check", {
          method: "GET"
        });
        fetch(request).then(function (response) {
          return response.json();
        }).then(function (json) {
          if (json.error && json.error == "session expired") {
            window.location.reload();
          } else {
            var _request = new Request(window.location.href + "puzzle/1/solved/" + json.token, {
              method: "POST",
              headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
              },
              body: JSON.stringify(detail)
            });
            fetch(_request).then(function (response) {
              return response.json();
            }).then(function (json) {
              if (json.error) {
                _this.reset();
                console.error(json.error);
              } else {
                _this.reset();
                var lead = document.getElementById("lead");
                while (lead.firstChild) {
                  lead.removeChild(lead.firstChild);
                }
                document.querySelector("#title > h1").innerHTML = "Score: ".concat(json.score);
                document.querySelector('name-element').remove();
                var score = json.score;
                for (var i = 0; i < score; i++) {
                  var scoreElement = document.createElement("span");
                  scoreElement.innerHTML = "💎";
                  scoreElement.style.setProperty("--screen-height", window.innerHeight + "px");
                  scoreElement.classList.add("absolute", "top-0", "text-2xl", "z-50", "animate-falling");
                  //place the scoreElement in a random x position on the screen
                  scoreElement.style.left = Math.random() * 100 + "vw";
                  //animate the scoreElement falling to the bottom of the screen
                  //with a random duration from 1 to 5 seconds
                  var animationDuration = Math.random() * 4 + 1;
                  scoreElement.style.animationDuration = animationDuration + "s";
                  lead.appendChild(scoreElement);
                }
                setTimeout(function () {
                  while (lead.firstChild) {
                    lead.removeChild(lead.firstChild);
                  }
                }, 6000);
              }
            });
          }
        });
      }
    });
    _defineProperty(_assertThisInitialized(_this), "reset", function () {
      _classPrivateFieldSet(_assertThisInitialized(_this), _time, new Date());
      _classPrivateFieldSet(_assertThisInitialized(_this), _level, 0);
      _classPrivateFieldSet(_assertThisInitialized(_this), _hintCount, 0);
      _classPrivateFieldSet(_assertThisInitialized(_this), _hintInterval, null);
      _classPrivateFieldSet(_assertThisInitialized(_this), _held, false);
      _classPrivateFieldSet(_assertThisInitialized(_this), _rngX, null);
      _classPrivateFieldSet(_assertThisInitialized(_this), _rngY, null);
      _classPrivateFieldSet(_assertThisInitialized(_this), _targetPosition, null);
      _classPrivateFieldSet(_assertThisInitialized(_this), _emoji, document.createElement("div"));
      _classPrivateFieldSet(_assertThisInitialized(_this), _disableRotateEmoji, false);
      _classPrivateFieldSet(_assertThisInitialized(_this), _levelTwoAnimationTimeout, null);
      var body = document.querySelector("body");
      if (document.getElementById("emoji")) body.removeChild(document.getElementById("emoji"));
      _this.loadEventListeners();
      return;
    });
    _this.dataset.content;
    return _this;
  }
  _createClass(HintElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;
      this.innerText = this.dataset.content;
      this.loadEventListeners();
      _classPrivateFieldSet(this, _glimmerHintTimeout, setTimeout(function () {
        _this2.glimmerHint();
      }, 500));
    }
  }]);
  return HintElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define("hint-element", HintElement);

/***/ }),

/***/ "./resources/js/components/NameElement.js":
/*!************************************************!*\
  !*** ./resources/js/components/NameElement.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NameElement: () => (/* binding */ NameElement)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
var _intervals = /*#__PURE__*/new WeakMap();
var _cursorTimeout = /*#__PURE__*/new WeakMap();
var _error = /*#__PURE__*/new WeakMap();
var _success = /*#__PURE__*/new WeakMap();
var _unlock = /*#__PURE__*/new WeakMap();
var _textColors = /*#__PURE__*/new WeakMap();
//import { Playground } from "../playground.js";

var NameElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(NameElement, _HTMLElement);
  function NameElement() {
    var _this;
    _classCallCheck(this, NameElement);
    _this = _callSuper(this, NameElement);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _intervals, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _cursorTimeout, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _error, {
      writable: true,
      value: new Audio("/audio/error3.wav")
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _success, {
      writable: true,
      value: new Audio("/audio/success3.wav")
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _unlock, {
      writable: true,
      value: new Audio("/audio/unlock.wav")
    });
    //#success2 = new Audio("/audio/success1.wav");
    //#unlock2 = new Audio("/audio/unlock2.wav");
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _textColors, {
      writable: true,
      value: ["text-gruvbox-light-yellow", "text-gruvbox-yellow", "text-gruvbox-orange", "text-gruvbox-purple", "text-gruvbox-blue", "text-gruvbox-aqua", "text-gruvbox-gray", "text-gruvbox-green", "text-gruvbox-red"]
    });
    _defineProperty(_assertThisInitialized(_this), "loadAnimation", function (span, index) {
      _this.nameLetterClicked({
        target: span
      }, true);
      var count = span.getAttribute("data-loading-count");
      if (count == 8) {
        clearInterval(_classPrivateFieldGet(_assertThisInitialized(_this), _intervals)[index]);
      }
      span.setAttribute("data-loading-count", ++count);
    });
    _defineProperty(_assertThisInitialized(_this), "nameLetterClicked", function (e) {
      var _target$classList;
      var loading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      clearTimeout(_classPrivateFieldGet(_assertThisInitialized(_this), _cursorTimeout));
      var target = e.target;
      var clickCount = target.getAttribute("data-click-count") || 0;
      (_target$classList = target.classList).remove.apply(_target$classList, _toConsumableArray(_classPrivateFieldGet(_assertThisInitialized(_this), _textColors)));
      if (loading) {
        clickCount = Math.floor(Math.random() * _classPrivateFieldGet(_assertThisInitialized(_this), _textColors).length);
      } else {
        clickCount = clickCount == _classPrivateFieldGet(_assertThisInitialized(_this), _textColors).length ? 0 : ++clickCount;
      }
      target.setAttribute("data-click-count", clickCount);
      target.classList.add(_classPrivateFieldGet(_assertThisInitialized(_this), _textColors)[clickCount]);
      var isGreen = target.classList.contains("text-gruvbox-green");
      if (!loading && isGreen) {
        _classPrivateFieldGet(_assertThisInitialized(_this), _success).currentTime = 0;
        _classPrivateFieldGet(_assertThisInitialized(_this), _success).play();
        target.classList.remove("cursor-not-allowed");
        target.classList.add("cursor-copy");
      } else if (!loading) {
        _classPrivateFieldGet(_assertThisInitialized(_this), _error).currentTime = 0;
        _classPrivateFieldGet(_assertThisInitialized(_this), _error).play();
        target.classList.remove("cursor-pointer", "cursor-not-allowed");
        target.classList.add("cursor-not-allowed");
        _classPrivateFieldSet(_assertThisInitialized(_this), _cursorTimeout, setTimeout(function () {
          target.classList.remove("cursor-not-allowed");
          target.classList.add("cursor-pointer");
        }, 500));
      }
      var allGreen = true;
      _this.childNodes.forEach(function (letter) {
        if (!letter.classList.contains("text-gruvbox-green")) {
          allGreen = false;
        }
      });
      if (!loading && allGreen) {
        var unlockType = "green";
        _classPrivateFieldGet(_assertThisInitialized(_this), _unlock).currentTime = 0;
        _classPrivateFieldGet(_assertThisInitialized(_this), _unlock).play();
        _this.loadPlayground();
      }
    });
    return _this;
  }
  _createClass(NameElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.render();
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === null) {
        return;
      } else {
        for (var i = 0; i < _classPrivateFieldGet(this, _intervals).length; i++) {
          clearInterval(_classPrivateFieldGet(this, _intervals)[i]);
        }
        this.innerHTML = '';
        this.render();
      }
      //this.dataset.content = newValue;
      //this.render()
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      this.dataset.content.split("").forEach(function (letter, i) {
        var span = document.createElement("span");
        span.classList.add("cursor-pointer", "select-none", "text-8xl");
        span.innerText = letter;
        span.setAttribute("data-click-count", 0);
        span.setAttribute("data-loading-count", 0);
        span.addEventListener("click", _this2.nameLetterClicked, {
          passive: true
        });
        _this2.appendChild(span);
        if (_this2.dataset.content === "Trever") {
          _classPrivateFieldGet(_this2, _intervals)[i] = setInterval(_this2.loadAnimation, 50, span, i);
        }
      });
    }
  }, {
    key: "loadPlayground",
    value: function () {
      var _loadPlayground = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              fetch("/skills").then(function (response) {
                return response.json();
              }).then(function (data) {
                window.Playground.init(data.skills);
                return;
              });
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function loadPlayground() {
        return _loadPlayground.apply(this, arguments);
      }
      return loadPlayground;
    }()
  }, {
    key: "disapearingParagraphs",
    value: function () {
      var _disapearingParagraphs = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(selected) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", new Promise(function (resolve, reject) {
                if (!selected) return;
                var lead = document.getElementById("lead");
                var paragraphs = lead.childNodes;
                var newParagraphs = [];
                var newParagraph;
                paragraphs.forEach(function (paragraph, i) {
                  newParagraph = null;
                  if (paragraph.nodeType === 1 && (!paragraph.classList || paragraph.classList && !paragraph.classList.contains("hidden"))) {
                    newParagraph = document.createElement("p");
                    paragraph.classList.forEach(function (className) {
                      newParagraph.classList.add(className);
                    });
                    newParagraph.id = "exploding-paragraph-" + i;
                    paragraph.childNodes.forEach(function (words) {
                      var text = words.textContent;
                      var letters = text.split("");
                      letters.forEach(function (letter) {
                        var span = document.createElement("span");
                        if (words.classList) {
                          words.classList.forEach(function (className) {
                            span.classList.add(className);
                          });
                        }
                        span.innerText = letter;
                        if (letter != "\n") {
                          newParagraph.appendChild(span);
                        }
                      });
                    });
                  }
                  if (newParagraph) newParagraphs.push(newParagraph);
                });
                document.getElementById("default").classList.add("hidden");
                document.getElementById("secondary").classList.add("hidden");
                newParagraphs.forEach(function (newParagraph) {
                  lead.appendChild(newParagraph);
                });
                var disapearingParagraphs = document.querySelectorAll("#lead p");
                disapearingParagraphs.forEach(function (paragraph) {
                  if (!paragraph.classList.contains("hidden")) {
                    paragraph.classList.add("overflow-hidden");
                    var letters = paragraph.querySelectorAll("span");
                    letters.forEach(function (letter) {
                      resolve(setTimeout(function () {
                        if (selected == "green" && letter.classList.contains("text-gruvbox-green")) {
                          letter.style.fontSize = "3rem";
                          setTimeout(function () {
                            paragraph.removeChild(letter);
                          }, 3500);
                        } else {
                          setTimeout(function () {
                            //remove letter from dom
                            paragraph.removeChild(letter);
                          }, 2000);
                          letter.style.opacity = 0;
                          letter.style.transition = "opacity ".concat(Math.random() * (2 - 1), "s ease-in-out");
                        }
                        document.getElementsByTagName("body")[0].classList.remove("cursor-wait");
                      }, 100));
                    });
                  }
                });
              }));
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function disapearingParagraphs(_x) {
        return _disapearingParagraphs.apply(this, arguments);
      }
      return disapearingParagraphs;
    }()
  }, {
    key: "nameCursorLoading",
    value: function nameCursorLoading() {
      var myNameLetters = document.querySelectorAll("#name span");
      myNameLetters.forEach(function (letter) {
        letter.classList.remove("cursor-copy");
        letter.classList.add("cursor-wait");
        setTimeout(function () {
          letter.classList.remove("cursor-wait");
          letter.classList.add("cursor-pointer");
        }, 3000);
      });
      var body = document.getElementsByTagName("body")[0];
      body.classList.add("cursor-wait");
    }
  }]);
  return NameElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
_defineProperty(NameElement, "observedAttributes", ["data-content"]);
customElements.define("name-element", NameElement);

/***/ }),

/***/ "./resources/js/components/TreasureElement.js":
/*!****************************************************!*\
  !*** ./resources/js/components/TreasureElement.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TreasureElement: () => (/* binding */ TreasureElement)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var TreasureElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(TreasureElement, _HTMLElement);
  function TreasureElement() {
    var _this;
    _classCallCheck(this, TreasureElement);
    _this = _callSuper(this, TreasureElement);
    _defineProperty(_assertThisInitialized(_this), "treasureHint", function (data) {
      var distanceToTreasure = data.detail.distanceToTreasure;
      var spread = distanceToTreasure < 40 ? 0.5 : 0.1;
      if (distanceToTreasure < 25) {
        //            this.style.textShadow = `0 0 ${distanceToTreasure / spread}px #fe8019, 0 0 ${
        //                distanceToTreasure / spread
        //            }px #fe8019, 0 0 ${distanceToTreasure / spread}px #EDD205`;
        //            this.style.color = `#fe8019`;
      } else {
        //this.style.textShadow = '';
        //            this.style.textShadow = `0 0 ${distanceToTreasure / spread}px #FFE205, 0 0 ${
        //                distanceToTreasure / spread
        //            }px #FFE205, 0 0 ${distanceToTreasure / spread}px #EDD205`;
        //            this.style.color = `#FFE205`;
      }
    });
    return _this;
  }
  _createClass(TreasureElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      window.addEventListener('treasureHint', this.treasureHint);
    }
  }]);
  return TreasureElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define('treasure-element', TreasureElement);

/***/ }),

/***/ "./resources/js/home.js":
/*!******************************!*\
  !*** ./resources/js/home.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_NameElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/NameElement.js */ "./resources/js/components/NameElement.js");
/* harmony import */ var _components_HintElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/HintElement.js */ "./resources/js/components/HintElement.js");
/* harmony import */ var _components_TreasureElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/TreasureElement.js */ "./resources/js/components/TreasureElement.js");
/* harmony import */ var _components_ContentElement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/ContentElement.js */ "./resources/js/components/ContentElement.js");
/* harmony import */ var _playground_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./playground.js */ "./resources/js/playground.js");
/* harmony import */ var _playground_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_playground_js__WEBPACK_IMPORTED_MODULE_4__);






// document.addEventListener("visibilitychange", () => {
//     console.log(document.visibilityState);
// });

/***/ }),

/***/ "./resources/js/playground.js":
/*!************************************!*\
  !*** ./resources/js/playground.js ***!
  \************************************/
/***/ (function() {

var _this = this;
var Playground = {
  initialized: false,
  playground: document.getElementById("lead"),
  homepageTag: document.querySelector("name-element"),
  pageTitle: document.querySelector("#title > h1"),
  skills: [],
  needsReset: false,
  fontScale: 25,
  placedSkills: [],
  placedSkillAttempts: 0,
  speedLimit: 12,
  homepageTagHtml: false,
  requestAnimationFrameID: null,
  init: function init(data) {
    Playground.initialized = true;
    Playground.skills = data;
    while (Playground.playground.firstChild) Playground.playground.removeChild(Playground.playground.firstChild);
    for (var skill in Playground.skills) {
      Playground.needsReset = false;
      Playground.skills[skill].element = document.createElement("div");
      Playground.skills[skill].active = false;
      Playground.skills[skill].isPositioned = false;
      Playground.skills[skill].currentX;
      Playground.skills[skill].currentY;
      Playground.skills[skill].initialX;
      Playground.skills[skill].initialY;
      Playground.skills[skill].xOffset = 0;
      Playground.skills[skill].yOffset = 0;
      Playground.styleElement(Playground.skills[skill]);
      Playground.playground.appendChild(Playground.skills[skill].element);
      if (!Playground.positionElement(Playground.skills[skill])) break;
      Playground.addClickListener(Playground.skills[skill]);
    }
    if (Playground.needsReset) Playground.reset("exceeded");
    var resizeTimeout;
    window.onresize = function () {
      if (Playground.playground.offsetParent) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(Playground.reset("resize"), 1000);
      }
    };
  },
  styleElement: function styleElement(skill) {
    skill.nameSpan = document.createElement("span");
    skill.nameSpan.classList.add("pointer-events-none");
    skill.nameSpan.innerText = skill.name;
    skill.element.appendChild(skill.nameSpan);
    skill.element.id = skill.name;
    skill.element.style.position = "absolute";
    skill.element.style.color = Playground.getColorBasedOnExperience(skill.experience, "hex");
    skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(skill.experience);
    skill.element.style.setProperty("--experience-color", Playground.getColorBasedOnExperience(skill.experience, "hex"));
    skill.element.classList.add("hover:animate-float-text", "text-bold", "text-center", "select-none", "cursor-pointer");
  },
  disableSkills: function disableSkills() {
    Playground.skills.forEach(function (skill) {
      skill.element.classList.remove("text-" + Playground.getColorBasedOnExperience(skill.experience), "hover:animate-float-text", "cursor-pointer");
      skill.element.classList.add("text-gruvbox-black");
      if (skill.name != Playground.skillActive.name) skill.element.classList.add("animate-blur-text");
      skill.element.removeEventListener("mousedown", Playground.dragStart, false);
      skill.element.removeEventListener("touchstart", Playground.dragStart, false);
    });
  },
  enableSkills: function enableSkills() {
    Playground.skills.forEach(function (skill) {
      setTimeout(function () {
        skill.element.classList.remove("animate-sharpen-text");
        skill.element.classList.add("hover:animate-float-text");
      }, 800);
      skill.element.classList.remove("text-gruvbox-black", "animate-blur-text");
      skill.element.classList.add("text-" + Playground.getColorBasedOnExperience(skill.experience), "cursor-pointer", "animate-sharpen-text");
      skill.element.addEventListener("mousedown", Playground.dragStart, false);
      skill.element.addEventListener("touchstart", Playground.dragStart, false);
    });
  },
  addRandomFloatEffect: function addRandomFloatEffect(skill) {
    var animationTime = Math.random() * (15 - 2) + 2 + "s";
    var x = Math.random() * (10 - -10) + -10 + "px";
    var y = Math.random() * (10 - -10) + -10 + "px";
    skill.element.style.setProperty("--float-animation-time", animationTime);
    skill.element.style.setProperty("--float-fifty-percent-y", x);
    skill.element.style.setProperty("--float-fifty-percent-x", y);
  },
  positionElement: function positionElement(skill) {
    while (!skill.isPositioned) {
      if (Playground.placedSkillAttempts > 200) {
        Playground.fontScale = Playground.fontScale + 2;
        Playground.needsReset = true;
        return false;
      }
      // get the cordinate of the playground
      var playgroundCords = Playground.playground.getBoundingClientRect();
      var width = skill.element.offsetWidth;
      var height = skill.element.offsetHeight;
      var maxX = playgroundCords.right - width;
      var maxY = playgroundCords.bottom - height;
      var textXBound = Math.random() * (maxX - playgroundCords.left) + playgroundCords.left;
      var textYBound = Math.random() * (maxY - playgroundCords.top) + playgroundCords.top;
      var cords = {
        width: width,
        height: height,
        x: textXBound,
        y: textYBound
      };
      var overlaps = false;
      for (var position in Playground.placedSkills) {
        if (Playground.skillsOverlap(cords, Playground.placedSkills[position].cords)) {
          Playground.placedSkillAttempts++;
          overlaps = true;
          break;
        }
      }
      if (overlaps) continue;
      if (!skill.isPositioned) {
        Playground.placedSkills.push({
          name: skill.element.innerText,
          cords: cords
        });
        skill.originalTop = textYBound + "px";
        skill.originalLeft = textXBound + "px";
        skill.element.style.top = skill.originalTop;
        skill.element.style.left = skill.originalLeft;
        skill.isPositioned = true;
      }
      return true;
    }
  },
  reset: function reset(hire) {
    hire = hire || false;
    Playground.placedSkillAttempts = 0;
    Playground.placedSkills = [];
    if (hire != "exceeded") Playground.fontScale = 25;
    for (var skill in Playground.skills) {
      Playground.skills[skill].active = false;
      if (Playground.skills[skill].element) {
        Playground.skills[skill].element.removeEventListener("mousedown", Playground.dragStart);
        Playground.skills[skill].element.removeEventListener("touchstart", Playground.dragStart);
        Playground.skills[skill].element.removeEventListener("mouseup", Playground.dragEnd);
        Playground.skills[skill].element.removeEventListener("mousemove", Playground.dragElement);
        Playground.playground.removeChild(Playground.skills[skill].element);
        delete Playground.skills[skill].element;
      }
    }
    while (Playground.playground.firstChild) {
      Playground.playground.removeChild(Playground.playground.firstChild);
    }
    if (hire == "hire") {
      Playground.buildForm();
    } else if (Playground.initialized) {
      Playground.init(Playground.skills);
    }
  },
  resetSkillPosition: function resetSkillPosition(skill) {
    for (var position in Playground.placedSkills) {
      if (Playground.placedSkills[position].name == skill.name) {
        window.exampleSkill = skill;
        skill.currentX = 0;
        skill.currentY = 0;
        skill.initialX;
        skill.initialY;
        skill.xOffset = 0;
        skill.yOffset = 0;
        Playground.setTranslate(skill.currentX, skill.currentY, skill.element);
      }
    }
  },
  getSkillBasedOnName: function getSkillBasedOnName(name) {
    for (var skill in Playground.skills) {
      if (Playground.skills[skill].name == name) return Playground.skills[skill];
    }
  },
  getFontSizeBasedOnExperience: function getFontSizeBasedOnExperience(experience) {
    return experience / Playground.fontScale + "em";
  },
  getColorBasedOnExperience: function getColorBasedOnExperience(experience, type) {
    switch (true) {
      case experience == 101:
        if (type == "hex") return "#b16286";
        return "gruvbox-purple";
      case experience == 102:
        if (type == "hex") return "#cc241d";
        return "gruvbox-red";
      case experience == 100:
        if (type == "hex") return "#fbf1c7";
        return "gruvbox-white";
      default:
        if (type == "hex") return "#b8bb26";
        return "gruvbox-green";
    }
  },
  skillsOverlap: function skillsOverlap(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
      return true;
    }
    return false;
  },
  addClickListener: function addClickListener(skill) {
    skill.element.addEventListener("mousedown", Playground.dragStart, false);
    skill.element.addEventListener("touchstart", Playground.dragStart, false);
  },
  dragStart: function dragStart(e) {
    var skill = Playground.getSkillBasedOnName(e.target.id);
    var nameElement = document.querySelector("name-element");
    Playground.homepageTag.setAttribute("data-content", skill.name);
    Playground.pageTitle.innerText = "Drag & Drop";

    //Playground.homepageTag.classList.remove("text-gruvbox-green");
    Playground.homepageTag.classList.add("border", "border-dashed", "border-4");
    //    "shadow-inner",
    //    "text-gruvbox-gray",
    //    "border-dashed",
    //    "border-gruvbox-green",
    //);

    if (skill && skill.element) {
      if (e.type == "touchstart") {
        skill.element.addEventListener("touchend", Playground.dragEnd, false);
        skill.element.addEventListener("touchmove", Playground.drag, false);
      } else if (e.type == "mousedown") {
        skill.element.addEventListener("mouseup", Playground.dragEnd, false);
        skill.element.addEventListener("mousemove", Playground.drag, false);
      }
      skill.element.style.zIndex = "11";
      skill.element.classList.remove("cursor-pointer");
      skill.element.classList.add("cursor-move");
      if (skill.heldCounter && skill.heldCounter > 2) {
        clearInterval(skill.heldCounter);
      }
      if (e.type === "touchstart") {
        skill.initialX = e.touches[0].clientX - skill.xOffset;
        skill.initialY = e.touches[0].clientY - skill.yOffset;
      } else {
        skill.initialX = e.clientX - skill.xOffset;
        skill.initialY = e.clientY - skill.yOffset;
      }
      if (e.target === skill.element) {
        skill.dragActive = true;
      } else {
        skill.dragActive = false;
      }
    }
  },
  dragEnd: function dragEnd(e) {
    var skill = Playground.getSkillBasedOnName(e.target.id);
    if (skill && skill.element) {
      skill.element.classList.remove("cursor-move");
      skill.element.removeEventListener("mouseup", Playground.dragEnd);
      skill.element.removeEventListener("mousemove", Playground.dragElement);
      skill.element.style.zIndex = "1";
      skill.dragActive = false;
      skill.infoShowing = false;
      if (skill.name == "hire me") Playground.removeHireHint(skill);
      Playground.removeHint(skill);
      Playground.resetSkillPosition(skill);
      if (skill.atTarget) {
        //Playground.homepageTag.classList.add("text-gruvbox-green");

        if (skill.name == "hire me") {
          Playground.reset("hire");
        } else if (skill.name == "reset();") {
          Playground.reset();
        } else {
          Playground.displayInfoCard(skill);
        }
        skill.atTarget = false;
      } else {
        //resetHomepageDeveloperTag();
      }
      //Playground.homepageTag.setAttribute("data-content", "Trever");
      Playground.pageTitle.innerText = "Hi. I'm";
      Playground.homepageTag.classList.remove("border", "border-dashed", "border-4");
      //    "text-gruvbox-gray",
      //    "border-gruvbox-green",
      //    "shadow-inner",
      //);
    }

    //this.requestAnimationFrameID = null;
  },
  dragElement: function dragElement(e) {
    if (_this.requestAnimationFrameID) return;
    _this.requestAnimationFrameID = window.requestAnimationFrame(function () {
      return Playground.drag(e);
    });
  },
  drag: function drag(e) {
    e.preventDefault();
    var skill = Playground.getSkillBasedOnName(e.target.id);
    if (skill && skill.dragActive) {
      if (!skill.elementChild) Playground.buildInfoCard(skill);
      var isForm = Playground.draggingEvents(e, skill);
      if (e.type === "touchmove") {
        skill.currentX = e.touches[0].clientX - skill.initialX;
        skill.currentY = e.touches[0].clientY - skill.initialY;
      } else {
        skill.currentX = e.clientX - skill.initialX;
        skill.currentY = e.clientY - skill.initialY;
      }
      if (!isForm) Playground.setTranslate(skill.currentX, skill.currentY, skill.element);
    }
  },
  draggingEvents: function draggingEvents(e, skill) {
    if (Playground.skillsOverlap(e.target.getBoundingClientRect(), Playground.homepageTag.getBoundingClientRect())) {
      skill.atTarget = true;
      Playground.homepageTag.classList.add("border-gruvbox-green");
      if (Playground.homepageTag.classList.contains("text-gruvbox-gray")) {
        Playground.homepageTag.classList.remove("text-gruvbox-gray", "shadow-inner", "border-gruvbox-green");
        Playground.homepageTag.classList.add("text-" + Playground.getColorBasedOnExperience(skill.experience));
      }
    } else {
      Playground.skillActive = skill;
      skill.atTarget = false;
      Playground.homepageTag.classList.remove("border-gruvbox-green");
    }
  },
  addHint: function addHint(skill) {
    skill.elementHint = document.createElement("div");
    skill.elementHint.classList.add("self-center", "justify-self-center", "cursor-pointer", "text-sm", "text-gruvbox-white", "max-w-md", "text-center");
    skill.elementHint.innerHTML = "drag and drop";
    skill.element.appendChild(skill.elementHint);
  },
  addHireHint: function addHireHint(skill) {
    skill.elementHireHint = document.createElement("div");
    skill.elementHireHint.classList.add("self-center", "justify-self-center", "text-sm", "text-gruvbox-white", "text-center", "bg-gruvbox-black", "m-auto");
    skill.elementHireHint.innerHTML = "&uuarr; hire me! &ddarr;";
    skill.element.appendChild(skill.elementHireHint);
  },
  removeHint: function removeHint(skill) {
    //Playground.homepageTag.classList.remove(
    //    "text-gruvbox-gray",
    //    "bg-gruvbox-black",
    //);
    //Playground.homepageTag.classList.add(
    //    "text-gruvbox-green",
    //    "bg-gruvbox-black",
    //);

    skill.heldCounter = 0;
    if (skill.heldInterval) clearTimeout(skill.heldInterval);
    if (skill.elementHint) {
      skill.element.removeChild(skill.elementHint);
      delete skill.elementHint;
    }
  },
  removeHireHint: function removeHireHint(skill) {
    skill.heldCounter = 0;
    if (skill.heldHireInterval) clearTimeout(skill.heldHireInterval);
    if (skill.elementHireHint) {
      skill.element.removeChild(skill.elementHireHint);
      delete skill.elementHireHint;
    }
  },
  setTranslate: function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate(" + xPos + "px, " + yPos + "px)";
  },
  handleShakeEvents: function handleShakeEvents(e, skill) {
    if (e.type == "touchmove") {
      if (!skill.initialTouch) {
        skill.initialTouch = e.touches[0];
      } else {
        e.movementX = skill.initialTouch.pageX - skill.previousTouch.pageX;
        e.movementY = skill.initialTouch.pageY - skill.previousTouch.pageY;
      }
      skill.previousTouch = e.touches[0];
    }
    if (e.movementX && e.movementX > Playground.speedLimit) {
      skill.elementMovementRightExceeded = true;
      skill.elementMovementXTimeout = setTimeout(function () {
        skill.elementMovementRightExceeded = false;
      }, 200);
    }
    if (e.movementX && e.movementX < -Playground.speedLimit) {
      skill.elementMovementLeftExceeded = true;
      skill.elementMovementXTimeout = setTimeout(function () {
        skill.elementMovementLeftExceeded = false;
      }, 200);
    }
    if (skill.name == "hire me") {
      if (e.movementY && e.movementY > Playground.speedLimit - 4) {
        skill.elementMovementUpExceeded = true;
        skill.elementMovementYTimeout = setTimeout(function () {
          skill.elementMovementUpExceeded = false;
        }, 200);
      }
      if (e.movementY && e.movementY < Playground.speedLimit - 4) {
        skill.elementMovementDownExceeded = true;
        skill.elementMovementYTimeout = setTimeout(function () {
          skill.elementMovementDownExceeded = false;
        }, 200);
      }
      if (skill.elementMovementDownExceeded && skill.elementMovementUpExceeded && skill.infoShowing) {
        e.stopPropagation();
        Playground.dragEnd(e);
        Playground.reset("hire");
        return false;
      }
    }
    if (skill.name == "GitHub") {
      if (e.movementY && e.movementY > Playground.speedLimit - 4) {
        skill.elementMovementUpExceeded = true;
        skill.elementMovementYTimeout = setTimeout(function () {
          skill.elementMovementUpExceeded = false;
        }, 200);
      }
      if (e.movementY && e.movementY < Playground.speedLimit - 4) {
        skill.elementMovementDownExceeded = true;
        skill.elementMovementYTimeout = setTimeout(function () {
          skill.elementMovementDownExceeded = false;
        }, 200);
      }
      if (skill.elementMovementDownExceeded && skill.elementMovementUpExceeded && skill.infoShowing) {
        e.stopPropagation();
        Playground.dragEnd(e);
        window.open("https://github.com/revertcreations");
        return false;
      }
    }
    if (skill.elementMovementLeftExceeded && skill.elementMovementRightExceeded && !skill.infoShowing) {
      if (skill.name == "reset();") {
        e.stopPropagation();
        Playground.dragEnd(e);
        Playground.reset("manual");
        return false;
      }
      Playground.displayInfoCard(skill);
      // Playground.removeHint(skill)
    }
  },
  buildInfoCard: function buildInfoCard(skill) {
    skill.elementChild = document.createElement("div");
    skill.elementChild.style.fontSize = "16px";
    skill.elementChild.classList.add("flex", "flex-col", "bg-gruvbox-black", "p-2", "h-80", "md:h-auto", "overflow-y-auto", "overflow-x-hidden");
    Playground.buildInfoCardCloseElement(skill);
    Playground.buildExperienceDiv(skill);
    skill.elementChildExcerpt = document.createElement("div");
    skill.elementChildExcerpt.classList.add("m-2", "text-left", "align-top", "md:self-start", "self-center", "text-gruvbox-white");
    skill.elementChildExcerpt.innerHTML = skill.excerpt;
  },
  buildInfoCardCloseElement: function buildInfoCardCloseElement(skill) {
    skill.closeInfoCard = document.createElement("div");
    skill.closeInfoCard.classList.add("absolute", "-top-20", "z-20", "right-0", "cursor-pointer", "text-6xl");
    skill.closeInfoCard.innerHTML = "<span onclick='Playground.closeInfoCard(" + '"' + skill.name + '"' + ")' class='text-gruvbox-red hover:text-red-400'>&times;</span>";
  },
  closeInfoCard: function closeInfoCard(skill_name) {
    var skill = Playground.getSkillBasedOnName(skill_name);
    skill.element.removeChild(skill.elementChild);
    skill.element.removeChild(skill.closeInfoCard);
    skill.element.style.top = skill.originalTop;
    skill.element.style.left = skill.originalLeft;
    skill.element.style.zIndex = "1";
    skill.element.style.transform = "unset";
    skill.element.style.backgroundImage = "unset";
    skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(skill.experience);
    skill.element.classList.remove("animate-float-bg", "bg-" + Playground.getColorBasedOnExperience(skill.experience), "lg:w-5/12", "md:w-7/12", "w-11/12");
    skill.element.classList.add("hover:animate-float-text", "text-" + Playground.getColorBasedOnExperience(skill.experience));
    skill.nameSpan.classList.remove("text-gruvbox-black");

    //resetHomepageDeveloperTag();
    Playground.homepageTag.setAttribute("data-content", "Trever");
    Playground.removeHint(skill);
    Playground.enableSkills();
  },
  buildExperienceDiv: function buildExperienceDiv(skill) {
    skill.elementChildExperienceWrap = document.createElement("div");
    skill.elementChildExperienceWrap.classList.add("flex", "flex-row", "cursor-pointer", "p-2");
    skill.elementChildExperienceWrapLabel = document.createElement("div");
    skill.elementChildExperienceWrapLabel.innerHTML = "Experience: &nbsp; &nbsp;";
    skill.elementChildExperienceWrapLabel.classList.add("text-gruvbox-gray", "mr-4");
    skill.elementChildExperienceWrapLabelExperience = document.createElement("div");
    skill.elementChildExperienceWrapLabelExperience.innerText = skill.experience;
    skill.elementChildExperienceWrapLabelExperience.classList.add("text-" + Playground.getColorBasedOnExperience(skill.experience) + "");
    skill.elementChildExperienceWrapLabelExperienceSlash = document.createElement("div");
    skill.elementChildExperienceWrapLabelExperienceSlash.innerHTML = "&nbsp;/&nbsp;";
    skill.elementChildExperienceWrapLabelExperienceSlash.classList.add("text-gruvbox-white");
    skill.elementChildExperienceWrapLabelExperienceFull = document.createElement("div");
    skill.elementChildExperienceWrapLabelExperienceFull.innerText = "100";
    skill.elementChildExperienceWrapLabelExperienceFull.classList.add("text-gruvbox-white");
  },
  removeAllClickListeners: function removeAllClickListeners() {
    Playground.skills.forEach(function (skill) {
      skill.element.removeEventListener("mousedown", Playground.dragStart, false);
      skill.element.removeEventListener("touchstart", Playground.dragStart, false);
    });
  },
  displayInfoCard: function displayInfoCard(skill) {
    Playground.removeAllClickListeners();
    Playground.disableSkills();
    skill.element.style.top = "20%";
    skill.element.style.left = "50%";
    skill.element.style.transform = "translate(-50%, 0)";
    skill.element.style.zIndex = "12";
    skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(100);
    skill.element.classList.remove("hover:animate-float-text", "text-" + Playground.getColorBasedOnExperience(skill.experience));
    for (var index = 0; index < 101; index++) skill.element.style.setProperty("--experience-percent-" + index, skill.experience > index ? index + "%" : skill.experience + "%");
    skill.nameSpan.classList.add("text-gruvbox-black");
    skill.element.classList.add("animate-float-bg", "lg:w-5/12", "md:w-7/12", "w-11/12");
    skill.element.appendChild(skill.elementChild);
    skill.element.appendChild(skill.closeInfoCard);
    if (skill.name != "README.md" && skill.name != "hire me") {
      skill.elementChild.appendChild(skill.elementChildExperienceWrap);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabel);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperience);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperienceSlash);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperienceFull);
    }
    skill.elementChild.appendChild(skill.elementChildExcerpt);
    skill.infoShowing = true;
  },
  buildForm: function buildForm() {
    window.onresize = false;
    var closeForm = document.createElement("div");
    closeForm.classList.add("cursor-pointer", "text-6xl", "text-right");
    closeForm.innerHTML = "<span onclick='Playground.reset()' class='text-gruvbox-red hover:text-red-400'>&times;</span>";
    var formWrap = document.createElement("div");
    formWrap.classList.add("m-auto", "lg:w-5/12", "md:w-7/12", "w-11/12", "overflow-y-auto");
    var hireMeForm = document.createElement("form");
    hireMeForm.id = "hire_me_form";
    hireMeForm.classList.add("flex", "flex-col", "m-8");
    var formInfo = document.createElement("p");
    formInfo.innerText = "First of all, I'm very excited to hear that you are interested in working with me! I love hearing new project ideas, so go ahead and fill out the form below with your contact info, and a brief overview of the project in mind, and I will get back to you asap!";
    formInfo.classList.add("text-gruvbox-white", "mb-4");
    var submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.innerText = "Submit";
    submitButton.classList.add("hover:bg-gruvbox-purple", "bg-gruvbox-green", "text-gruvbox-black", "text-2xl", "font-bold", "p-4", "mt-4", "mb-4");
    var formTitle = document.createElement("h2");
    formTitle.innerText = "hire me";
    formTitle.classList.add("text-gruvbox-green", "text-4xl", "mt-4", "mb-4");
    var emailInput = document.createElement("input");
    emailInput.name = "email";
    emailInput.type = "email";
    emailInput.classList.add("p-4", "m-4");
    var emailLabel = document.createElement("label");
    emailLabel.innerText = "Email";
    emailLabel.classList.add("text-gruvbox-green");
    var organizationInput = document.createElement("input");
    organizationInput.name = "name";
    organizationInput.type = "text";
    organizationInput.classList.add("p-4", "m-4");
    var organizationLabel = document.createElement("label");
    organizationLabel.classList.add("text-gruvbox-green");
    organizationLabel.innerText = "Organization";
    var firstNameInput = document.createElement("input");
    firstNameInput.name = "first_name";
    firstNameInput.type = "text";
    firstNameInput.classList.add("p-4", "m-4");
    var firstNameLabel = document.createElement("label");
    firstNameLabel.innerText = "First Name";
    firstNameLabel.classList.add("text-gruvbox-green");
    var lastNameInput = document.createElement("input");
    lastNameInput.name = "last_name";
    lastNameInput.type = "text";
    lastNameInput.classList.add("p-4", "m-4");
    var lastNameLabel = document.createElement("label");
    lastNameLabel.innerText = "Last Name";
    lastNameLabel.classList.add("text-gruvbox-green");
    var phoneInput = document.createElement("input");
    phoneInput.type = "tel";
    phoneInput.classList.add("p-4", "m-4");
    //phoneInputpattern = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
    var phoneLabel = document.createElement("label");
    phoneLabel.innerText = "Phone Number";
    phoneLabel.classList.add("text-gruvbox-green");
    var descriptionInput = document.createElement("textarea");
    descriptionInput.name = "description";
    descriptionInput.classList.add("p-4", "m-4");
    var descriptionLabel = document.createElement("label");
    descriptionLabel.innerText = "Description";
    descriptionLabel.classList.add("text-gruvbox-green");
    Playground.playground.classList.remove("touch-action-none");
    Playground.playground.appendChild(formWrap);
    formWrap.appendChild(closeForm);
    formWrap.appendChild(hireMeForm);
    hireMeForm.appendChild(formInfo);
    hireMeForm.appendChild(organizationLabel);
    hireMeForm.appendChild(organizationInput);
    hireMeForm.appendChild(firstNameLabel);
    hireMeForm.appendChild(firstNameInput);
    hireMeForm.appendChild(lastNameLabel);
    hireMeForm.appendChild(lastNameInput);
    hireMeForm.appendChild(emailLabel);
    hireMeForm.appendChild(emailInput);
    hireMeForm.appendChild(phoneLabel);
    hireMeForm.appendChild(phoneInput);
    hireMeForm.appendChild(descriptionLabel);
    hireMeForm.appendChild(descriptionInput);
    hireMeForm.appendChild(submitButton);
    submitButton.onclick = function (event) {
      submitButton.disabled = true;
      event = event || window.event;
      event.preventDefault();
      if (firstNameLabel.classList.contains("text-gruvbox-red")) {
        firstNameLabel.classList.remove("text-gruvbox-red");
        firstNameLabel.classList.add("text-gruvbox-green");
        firstNameLabel.innerText = "First Name";
      }
      if (lastNameLabel.classList.contains("text-gruvbox-red")) {
        lastNameLabel.classList.remove("text-gruvbox-red");
        lastNameLabel.classList.add("text-gruvbox-green");
        lastNameLabel.innerText = "Last Name";
      }
      if (emailLabel.classList.contains("text-gruvbox-red")) {
        emailLabel.classList.remove("text-gruvbox-red");
        emailLabel.classList.add("text-gruvbox-green");
        emailLabel.innerText = "Last Name";
      }
      if (formInfo.classList.contains("text-gruvbox-yellow")) {
        formInfo.classList.remove("text-gruvbox-orange");
        formInfo.classList.remove("text-gruvbox-green");
      }
      var hireMeForm = document.getElementById("hire_me_form");
      // console.log(hireMeForm[0])
      var data = new FormData(hireMeForm);
      // console.log(data)

      var csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
      var url = "/developer";
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text-plain, */*",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrf_token
        },
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({
          first_name: firstNameInput.value,
          last_name: lastNameInput.value,
          organization: organizationInput.value,
          phone: phoneInput.value,
          description: descriptionInput.value,
          email: emailInput.value
        })
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.errors) {
          if (data.errors["first_name"]) {
            firstNameLabel.classList.remove("text-gruvbox-green");
            firstNameLabel.innerText = "First Name *required";
            firstNameLabel.classList.add("text-gruvbox-red");
          }
          if (data.errors["last_name"]) {
            lastNameLabel.classList.remove("text-gruvbox-green");
            lastNameLabel.innerText = "Last Name *required";
            lastNameLabel.classList.add("text-gruvbox-red");
          }
          if (data.errors["email"] && data.errors["email"][0] !== "The email has already been taken.") {
            emailLabel.classList.remove("text-gruvbox-green");
            emailLabel.innerText = "Email *required";
            emailLabel.classList.add("text-gruvbox-red");
          }
          if (data.errors["email"] && data.errors["email"][0] == "The email has already been taken.") {
            formInfo.classList.remove("text-gruvbox-green");
            formInfo.classList.add("text-gruvbox-orange");
            formInfo.innerHTML = '<span class="text-gruvbox-yellow">Oh, ' + (firstNameInput.value.length > 0 ? firstNameInput.value + "," : ",") + " it looks like you have already contacted me. I will get to reviewing it right away!</span>";
          }
          submitButton.removeAttribute("disabled");
        }
        if (data.status == "ok") {
          formWrap.removeChild(hireMeForm);
          var _formInfo = document.createElement("p");
          _formInfo.innerText = data.message;
          _formInfo.classList.add("text-gruvbox-white", "mb-4");
          formWrap.appendChild(_formInfo);
        }
      })["catch"](function (errors) {
        var formInfo = document.createElement("p");
        formInfo.innerText = errors.message;
        formInfo.classList.add("text-gruvbox-red", "mb-4");
        formWrap.appendChild(formInfo);
      });
    };
  }
};
window.Playground = Playground;
//export { Playground };

/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
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