/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/gsap/CSSPlugin.js":
/*!****************************************!*\
  !*** ./node_modules/gsap/CSSPlugin.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSPlugin: () => (/* binding */ CSSPlugin),
/* harmony export */   _createElement: () => (/* binding */ _createElement),
/* harmony export */   _getBBox: () => (/* binding */ _getBBox),
/* harmony export */   checkPrefix: () => (/* binding */ _checkPropPrefix),
/* harmony export */   "default": () => (/* binding */ CSSPlugin)
/* harmony export */ });
/* harmony import */ var _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gsap-core.js */ "./node_modules/gsap/gsap-core.js");
/*!
 * CSSPlugin 3.13.0
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */


var _win,
    _doc,
    _docElement,
    _pluginInitted,
    _tempDiv,
    _tempDivStyler,
    _recentSetterPlugin,
    _reverting,
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _transformProps = {},
    _RAD2DEG = 180 / Math.PI,
    _DEG2RAD = Math.PI / 180,
    _atan2 = Math.atan2,
    _bigNum = 1e8,
    _capsExp = /([A-Z])/g,
    _horizontalExp = /(left|right|width|margin|padding|x)/i,
    _complexExp = /[\s,\(]\S/,
    _propertyAliases = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
},
    _renderCSSProp = function _renderCSSProp(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
},
    _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
  return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
},
    _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
  return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u : data.b, data);
},
    //if units change, we need a way to render the original unit/value when the tween goes all the way back to the beginning (ratio:0)
_renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
  var value = data.s + data.c * ratio;
  data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
},
    _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
  return data.set(data.t, data.p, ratio ? data.e : data.b, data);
},
    _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
  return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
},
    _setterCSSStyle = function _setterCSSStyle(target, property, value) {
  return target.style[property] = value;
},
    _setterCSSProp = function _setterCSSProp(target, property, value) {
  return target.style.setProperty(property, value);
},
    _setterTransform = function _setterTransform(target, property, value) {
  return target._gsap[property] = value;
},
    _setterScale = function _setterScale(target, property, value) {
  return target._gsap.scaleX = target._gsap.scaleY = value;
},
    _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache.scaleX = cache.scaleY = value;
  cache.renderTransform(ratio, cache);
},
    _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache[property] = value;
  cache.renderTransform(ratio, cache);
},
    _transformProp = "transform",
    _transformOriginProp = _transformProp + "Origin",
    _saveStyle = function _saveStyle(property, isNotCSS) {
  var _this = this;

  var target = this.target,
      style = target.style,
      cache = target._gsap;

  if (property in _transformProps && style) {
    this.tfm = this.tfm || {};

    if (property !== "transform") {
      property = _propertyAliases[property] || property;
      ~property.indexOf(",") ? property.split(",").forEach(function (a) {
        return _this.tfm[a] = _get(target, a);
      }) : this.tfm[property] = cache.x ? cache[property] : _get(target, property); // note: scale would map to "scaleX,scaleY", thus we loop and apply them both.

      property === _transformOriginProp && (this.tfm.zOrigin = cache.zOrigin);
    } else {
      return _propertyAliases.transform.split(",").forEach(function (p) {
        return _saveStyle.call(_this, p, isNotCSS);
      });
    }

    if (this.props.indexOf(_transformProp) >= 0) {
      return;
    }

    if (cache.svg) {
      this.svgo = target.getAttribute("data-svg-origin");
      this.props.push(_transformOriginProp, isNotCSS, "");
    }

    property = _transformProp;
  }

  (style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
},
    _removeIndependentTransforms = function _removeIndependentTransforms(style) {
  if (style.translate) {
    style.removeProperty("translate");
    style.removeProperty("scale");
    style.removeProperty("rotate");
  }
},
    _revertStyle = function _revertStyle() {
  var props = this.props,
      target = this.target,
      style = target.style,
      cache = target._gsap,
      i,
      p;

  for (i = 0; i < props.length; i += 3) {
    // stored like this: property, isNotCSS, value
    if (!props[i + 1]) {
      props[i + 2] ? style[props[i]] = props[i + 2] : style.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp, "-$1").toLowerCase());
    } else if (props[i + 1] === 2) {
      // non-CSS value (function-based)
      target[props[i]](props[i + 2]);
    } else {
      // non-CSS value (not function-based)
      target[props[i]] = props[i + 2];
    }
  }

  if (this.tfm) {
    for (p in this.tfm) {
      cache[p] = this.tfm[p];
    }

    if (cache.svg) {
      cache.renderTransform();
      target.setAttribute("data-svg-origin", this.svgo || "");
    }

    i = _reverting();

    if ((!i || !i.isStart) && !style[_transformProp]) {
      _removeIndependentTransforms(style);

      if (cache.zOrigin && style[_transformOriginProp]) {
        style[_transformOriginProp] += " " + cache.zOrigin + "px"; // since we're uncaching, we must put the zOrigin back into the transformOrigin so that we can pull it out accurately when we parse again. Otherwise, we'd lose the z portion of the origin since we extract it to protect from Safari bugs.

        cache.zOrigin = 0;
        cache.renderTransform();
      }

      cache.uncache = 1; // if it's a startAt that's being reverted in the _initTween() of the core, we don't need to uncache transforms. This is purely a performance optimization.
    }
  }
},
    _getStyleSaver = function _getStyleSaver(target, properties) {
  var saver = {
    target: target,
    props: [],
    revert: _revertStyle,
    save: _saveStyle
  };
  target._gsap || _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.gsap.core.getCache(target); // just make sure there's a _gsap cache defined because we read from it in _saveStyle() and it's more efficient to just check it here once.

  properties && target.style && target.nodeType && properties.split(",").forEach(function (p) {
    return saver.save(p);
  }); // make sure it's a DOM node too.

  return saver;
},
    _supports3D,
    _createElement = function _createElement(type, ns) {
  var e = _doc.createElementNS ? _doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc.createElement(type); //some servers swap in https for http in the namespace which can break things, making "style" inaccessible.

  return e && e.style ? e : _doc.createElement(type); //some environments won't allow access to the element's style when created with a namespace in which case we default to the standard createElement() to work around the issue. Also note that when GSAP is embedded directly inside an SVG file, createElement() won't allow access to the style object in Firefox (see https://gsap.com/forums/topic/20215-problem-using-tweenmax-in-standalone-self-containing-svg-file-err-cannot-set-property-csstext-of-undefined/).
},
    _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
  var cs = getComputedStyle(target);
  return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || ""; //css variables may not need caps swapped out for dashes and lowercase.
},
    _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
    _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
  var e = element || _tempDiv,
      s = e.style,
      i = 5;

  if (property in s && !preferPrefix) {
    return property;
  }

  property = property.charAt(0).toUpperCase() + property.substr(1);

  while (i-- && !(_prefixes[i] + property in s)) {}

  return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
},
    _initCore = function _initCore() {
  if (_windowExists() && window.document) {
    _win = window;
    _doc = _win.document;
    _docElement = _doc.documentElement;
    _tempDiv = _createElement("div") || {
      style: {}
    };
    _tempDivStyler = _createElement("div");
    _transformProp = _checkPropPrefix(_transformProp);
    _transformOriginProp = _transformProp + "Origin";
    _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0"; //make sure to override certain properties that may contaminate measurements, in case the user has overreaching style sheets.

    _supports3D = !!_checkPropPrefix("perspective");
    _reverting = _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.gsap.core.reverting;
    _pluginInitted = 1;
  }
},
    _getReparentedCloneBBox = function _getReparentedCloneBBox(target) {
  //works around issues in some browsers (like Firefox) that don't correctly report getBBox() on SVG elements inside a <defs> element and/or <mask>. We try creating an SVG, adding it to the documentElement and toss the element in there so that it's definitely part of the rendering tree, then grab the bbox and if it works, we actually swap out the original getBBox() method for our own that does these extra steps whenever getBBox is needed. This helps ensure that performance is optimal (only do all these extra steps when absolutely necessary...most elements don't need it).
  var owner = target.ownerSVGElement,
      svg = _createElement("svg", owner && owner.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
      clone = target.cloneNode(true),
      bbox;

  clone.style.display = "block";
  svg.appendChild(clone);

  _docElement.appendChild(svg);

  try {
    bbox = clone.getBBox();
  } catch (e) {}

  svg.removeChild(clone);

  _docElement.removeChild(svg);

  return bbox;
},
    _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
  var i = attributesArray.length;

  while (i--) {
    if (target.hasAttribute(attributesArray[i])) {
      return target.getAttribute(attributesArray[i]);
    }
  }
},
    _getBBox = function _getBBox(target) {
  var bounds, cloned;

  try {
    bounds = target.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
  } catch (error) {
    bounds = _getReparentedCloneBBox(target);
    cloned = 1;
  }

  bounds && (bounds.width || bounds.height) || cloned || (bounds = _getReparentedCloneBBox(target)); //some browsers (like Firefox) misreport the bounds if the element has zero width and height (it just assumes it's at x:0, y:0), thus we need to manually grab the position in that case.

  return bounds && !bounds.width && !bounds.x && !bounds.y ? {
    x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
    y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : bounds;
},
    _isSVG = function _isSVG(e) {
  return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
},
    //reports if the element is an SVG on which getBBox() actually works
_removeProperty = function _removeProperty(target, property) {
  if (property) {
    var style = target.style,
        first2Chars;

    if (property in _transformProps && property !== _transformOriginProp) {
      property = _transformProp;
    }

    if (style.removeProperty) {
      first2Chars = property.substr(0, 2);

      if (first2Chars === "ms" || property.substr(0, 6) === "webkit") {
        //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
        property = "-" + property;
      }

      style.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp, "-$1").toLowerCase());
    } else {
      //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
      style.removeAttribute(property);
    }
  }
},
    _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
  var pt = new _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
  plugin._pt = pt;
  pt.b = beginning;
  pt.e = end;

  plugin._props.push(property);

  return pt;
},
    _nonConvertibleUnits = {
  deg: 1,
  rad: 1,
  turn: 1
},
    _nonStandardLayouts = {
  grid: 1,
  flex: 1
},
    //takes a single value like 20px and converts it to the unit specified, like "%", returning only the numeric amount.
_convertToUnit = function _convertToUnit(target, property, value, unit) {
  var curValue = parseFloat(value) || 0,
      curUnit = (value + "").trim().substr((curValue + "").length) || "px",
      // some browsers leave extra whitespace at the beginning of CSS variables, hence the need to trim()
  style = _tempDiv.style,
      horizontal = _horizontalExp.test(property),
      isRootSVG = target.tagName.toLowerCase() === "svg",
      measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
      amount = 100,
      toPixels = unit === "px",
      toPercent = unit === "%",
      px,
      parent,
      cache,
      isSVG;

  if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
    return curValue;
  }

  curUnit !== "px" && !toPixels && (curValue = _convertToUnit(target, property, value, "px"));
  isSVG = target.getCTM && _isSVG(target);

  if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
    px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
    return (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(toPercent ? curValue / px * amount : curValue / 100 * px);
  }

  style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
  parent = unit !== "rem" && ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;

  if (isSVG) {
    parent = (target.ownerSVGElement || {}).parentNode;
  }

  if (!parent || parent === _doc || !parent.appendChild) {
    parent = _doc.body;
  }

  cache = parent._gsap;

  if (cache && toPercent && cache.width && horizontal && cache.time === _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._ticker.time && !cache.uncache) {
    return (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(curValue / cache.width * amount);
  } else {
    if (toPercent && (property === "height" || property === "width")) {
      // if we're dealing with width/height that's inside a container with padding and/or it's a flexbox/grid container, we must apply it to the target itself rather than the _tempDiv in order to ensure complete accuracy, factoring in the parent's padding.
      var v = target.style[property];
      target.style[property] = amount + unit;
      px = target[measureProperty];
      v ? target.style[property] = v : _removeProperty(target, property);
    } else {
      (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
      parent === target && (style.position = "static"); // like for borderRadius, if it's a % we must have it relative to the target itself but that may not have position: relative or position: absolute in which case it'd go up the chain until it finds its offsetParent (bad). position: static protects against that.

      parent.appendChild(_tempDiv);
      px = _tempDiv[measureProperty];
      parent.removeChild(_tempDiv);
      style.position = "absolute";
    }

    if (horizontal && toPercent) {
      cache = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._getCache)(parent);
      cache.time = _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._ticker.time;
      cache.width = parent[measureProperty];
    }
  }

  return (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
},
    _get = function _get(target, property, unit, uncache) {
  var value;
  _pluginInitted || _initCore();

  if (property in _propertyAliases && property !== "transform") {
    property = _propertyAliases[property];

    if (~property.indexOf(",")) {
      property = property.split(",")[0];
    }
  }

  if (_transformProps[property] && property !== "transform") {
    value = _parseTransform(target, uncache);
    value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
  } else {
    value = target.style[property];

    if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
      value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._getProperty)(target, property) || (property === "opacity" ? 1 : 0); // note: some browsers, like Firefox, don't report borderRadius correctly! Instead, it only reports every corner like  borderTopLeftRadius
    }
  }

  return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
},
    _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
  // note: we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
  if (!start || start === "none") {
    // some browsers like Safari actually PREFER the prefixed property and mis-report the unprefixed value like clipPath (BUG). In other words, even though clipPath exists in the style ("clipPath" in target.style) and it's set in the CSS properly (along with -webkit-clip-path), Safari reports clipPath as "none" whereas WebkitClipPath reports accurately like "ellipse(100% 0% at 50% 0%)", so in this case we must SWITCH to using the prefixed property instead. See https://gsap.com/forums/topic/18310-clippath-doesnt-work-on-ios/
    var p = _checkPropPrefix(prop, target, 1),
        s = p && _getComputedProperty(target, p, 1);

    if (s && s !== start) {
      prop = p;
      start = s;
    } else if (prop === "borderColor") {
      start = _getComputedProperty(target, "borderTopColor"); // Firefox bug: always reports "borderColor" as "", so we must fall back to borderTopColor. See https://gsap.com/forums/topic/24583-how-to-return-colors-that-i-had-after-reverse/
    }
  }

  var pt = new _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.PropTween(this._pt, target.style, prop, 0, 1, _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._renderComplexString),
      index = 0,
      matchIndex = 0,
      a,
      result,
      startValues,
      startNum,
      color,
      startValue,
      endValue,
      endNum,
      chunk,
      endUnit,
      startUnit,
      endValues;
  pt.b = start;
  pt.e = end;
  start += ""; // ensure values are strings

  end += "";

  if (end.substring(0, 6) === "var(--") {
    end = _getComputedProperty(target, end.substring(4, end.indexOf(")")));
  }

  if (end === "auto") {
    startValue = target.style[prop];
    target.style[prop] = end;
    end = _getComputedProperty(target, prop) || end;
    startValue ? target.style[prop] = startValue : _removeProperty(target, prop);
  }

  a = [start, end];

  (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._colorStringFilter)(a); // pass an array with the starting and ending values and let the filter do whatever it needs to the values. If colors are found, it returns true and then we must match where the color shows up order-wise because for things like boxShadow, sometimes the browser provides the computed values with the color FIRST, but the user provides it with the color LAST, so flip them if necessary. Same for drop-shadow().


  start = a[0];
  end = a[1];
  startValues = start.match(_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._numWithUnitExp) || [];
  endValues = end.match(_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._numWithUnitExp) || [];

  if (endValues.length) {
    while (result = _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._numWithUnitExp.exec(end)) {
      endValue = result[0];
      chunk = end.substring(index, result.index);

      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
        color = 1;
      }

      if (endValue !== (startValue = startValues[matchIndex++] || "")) {
        startNum = parseFloat(startValue) || 0;
        startUnit = startValue.substr((startNum + "").length);
        endValue.charAt(1) === "=" && (endValue = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._parseRelative)(startNum, endValue) + startUnit);
        endNum = parseFloat(endValue);
        endUnit = endValue.substr((endNum + "").length);
        index = _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._numWithUnitExp.lastIndex - endUnit.length;

        if (!endUnit) {
          //if something like "perspective:300" is passed in and we must add a unit to the end
          endUnit = endUnit || _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._config.units[prop] || startUnit;

          if (index === end.length) {
            end += endUnit;
            pt.e += endUnit;
          }
        }

        if (startUnit !== endUnit) {
          startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
        } // these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.


        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c: endNum - startNum,
          m: color && color < 4 || prop === "zIndex" ? Math.round : 0
        };
      }
    }

    pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)
  } else {
    pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
  }

  _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._relExp.test(end) && (pt.e = 0); //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).

  this._pt = pt; //start the linked list with this new PropTween. Remember, we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within another plugin too, thus "this" would refer to the plugin.

  return pt;
},
    _keywordToPercent = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
},
    _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
  var split = value.split(" "),
      x = split[0],
      y = split[1] || "50%";

  if (x === "top" || x === "bottom" || y === "left" || y === "right") {
    //the user provided them in the wrong order, so flip them
    value = x;
    x = y;
    y = value;
  }

  split[0] = _keywordToPercent[x] || x;
  split[1] = _keywordToPercent[y] || y;
  return split.join(" ");
},
    _renderClearProps = function _renderClearProps(ratio, data) {
  if (data.tween && data.tween._time === data.tween._dur) {
    var target = data.t,
        style = target.style,
        props = data.u,
        cache = target._gsap,
        prop,
        clearTransforms,
        i;

    if (props === "all" || props === true) {
      style.cssText = "";
      clearTransforms = 1;
    } else {
      props = props.split(",");
      i = props.length;

      while (--i > -1) {
        prop = props[i];

        if (_transformProps[prop]) {
          clearTransforms = 1;
          prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
        }

        _removeProperty(target, prop);
      }
    }

    if (clearTransforms) {
      _removeProperty(target, _transformProp);

      if (cache) {
        cache.svg && target.removeAttribute("transform");
        style.scale = style.rotate = style.translate = "none";

        _parseTransform(target, 1); // force all the cached values back to "normal"/identity, otherwise if there's another tween that's already set to render transforms on this element, it could display the wrong values.


        cache.uncache = 1;

        _removeIndependentTransforms(style);
      }
    }
  }
},
    // note: specialProps should return 1 if (and only if) they have a non-zero priority. It indicates we need to sort the linked list.
_specialProps = {
  clearProps: function clearProps(plugin, target, property, endValue, tween) {
    if (tween.data !== "isFromStart") {
      var pt = plugin._pt = new _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
      pt.u = endValue;
      pt.pr = -10;
      pt.tween = tween;

      plugin._props.push(property);

      return 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */

},

/*
 * --------------------------------------------------------------------------------------
 * TRANSFORMS
 * --------------------------------------------------------------------------------------
 */
_identity2DMatrix = [1, 0, 0, 1, 0, 0],
    _rotationalProperties = {},
    _isNullTransform = function _isNullTransform(value) {
  return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
},
    _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
  var matrixString = _getComputedProperty(target, _transformProp);

  return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._numExp).map(_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round);
},
    _getMatrix = function _getMatrix(target, force2D) {
  var cache = target._gsap || (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._getCache)(target),
      style = target.style,
      matrix = _getComputedTransformMatrixAsArray(target),
      parent,
      nextSibling,
      temp,
      addedToDOM;

  if (cache.svg && target.getAttribute("transform")) {
    temp = target.transform.baseVal.consolidate().matrix; //ensures that even complex values like "translate(50,60) rotate(135,0,0)" are parsed because it mashes it into a matrix.

    matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
    return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
  } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
    //note: if offsetParent is null, that means the element isn't in the normal document flow, like if it has display:none or one of its ancestors has display:none). Firefox returns null for getComputedStyle() if the element is in an iframe that has display:none. https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    //browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none". Firefox and Microsoft browsers have a partial bug where they'll report transforms even if display:none BUT not any percentage-based values like translate(-50%, 8px) will be reported as if it's translate(0, 8px).
    temp = style.display;
    style.display = "block";
    parent = target.parentNode;

    if (!parent || !target.offsetParent && !target.getBoundingClientRect().width) {
      // note: in 3.3.0 we switched target.offsetParent to _doc.body.contains(target) to avoid [sometimes unnecessary] MutationObserver calls but that wasn't adequate because there are edge cases where nested position: fixed elements need to get reparented to accurately sense transforms. See https://github.com/greensock/GSAP/issues/388 and https://github.com/greensock/GSAP/issues/375. Note: position: fixed elements report a null offsetParent but they could also be invisible because they're in an ancestor with display: none, so we check getBoundingClientRect(). We only want to alter the DOM if we absolutely have to because it can cause iframe content to reload, like a Vimeo video.
      addedToDOM = 1; //flag

      nextSibling = target.nextElementSibling;

      _docElement.appendChild(target); //we must add it to the DOM in order to get values properly

    }

    matrix = _getComputedTransformMatrixAsArray(target);
    temp ? style.display = temp : _removeProperty(target, "display");

    if (addedToDOM) {
      nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
    }
  }

  return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
},
    _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
  var cache = target._gsap,
      matrix = matrixArray || _getMatrix(target, true),
      xOriginOld = cache.xOrigin || 0,
      yOriginOld = cache.yOrigin || 0,
      xOffsetOld = cache.xOffset || 0,
      yOffsetOld = cache.yOffset || 0,
      a = matrix[0],
      b = matrix[1],
      c = matrix[2],
      d = matrix[3],
      tx = matrix[4],
      ty = matrix[5],
      originSplit = origin.split(" "),
      xOrigin = parseFloat(originSplit[0]) || 0,
      yOrigin = parseFloat(originSplit[1]) || 0,
      bounds,
      determinant,
      x,
      y;

  if (!originIsAbsolute) {
    bounds = _getBBox(target);
    xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
    yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin); // if (!("xOrigin" in cache) && (xOrigin || yOrigin)) { // added in 3.12.3, reverted in 3.12.4; requires more exploration
    // 	xOrigin -= bounds.x;
    // 	yOrigin -= bounds.y;
    // }
  } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
    //if it's zero (like if scaleX and scaleY are zero), skip it to avoid errors with dividing by zero.
    x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
    y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
    xOrigin = x;
    yOrigin = y; // theory: we only had to do this for smoothing and it assumes that the previous one was not originIsAbsolute.
  }

  if (smooth || smooth !== false && cache.smooth) {
    tx = xOrigin - xOriginOld;
    ty = yOrigin - yOriginOld;
    cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
    cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
  } else {
    cache.xOffset = cache.yOffset = 0;
  }

  cache.xOrigin = xOrigin;
  cache.yOrigin = yOrigin;
  cache.smooth = !!smooth;
  cache.origin = origin;
  cache.originIsAbsolute = !!originIsAbsolute;
  target.style[_transformOriginProp] = "0px 0px"; //otherwise, if someone sets  an origin via CSS, it will likely interfere with the SVG transform attribute ones (because remember, we're baking the origin into the matrix() value).

  if (pluginToAddPropTweensTo) {
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
  }

  target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
},
    _parseTransform = function _parseTransform(target, uncache) {
  var cache = target._gsap || new _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.GSCache(target);

  if ("x" in cache && !uncache && !cache.uncache) {
    return cache;
  }

  var style = target.style,
      invertedScaleX = cache.scaleX < 0,
      px = "px",
      deg = "deg",
      cs = getComputedStyle(target),
      origin = _getComputedProperty(target, _transformOriginProp) || "0",
      x,
      y,
      z,
      scaleX,
      scaleY,
      rotation,
      rotationX,
      rotationY,
      skewX,
      skewY,
      perspective,
      xOrigin,
      yOrigin,
      matrix,
      angle,
      cos,
      sin,
      a,
      b,
      c,
      d,
      a12,
      a22,
      t1,
      t2,
      t3,
      a13,
      a23,
      a33,
      a42,
      a43,
      a32;
  x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
  scaleX = scaleY = 1;
  cache.svg = !!(target.getCTM && _isSVG(target));

  if (cs.translate) {
    // accommodate independent transforms by combining them into normal ones.
    if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") {
      style[_transformProp] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp] !== "none" ? cs[_transformProp] : "");
    }

    style.scale = style.rotate = style.translate = "none";
  }

  matrix = _getMatrix(target, cache.svg);

  if (cache.svg) {
    if (cache.uncache) {
      // if cache.uncache is true (and maybe if origin is 0,0), we need to set element.style.transformOrigin = (cache.xOrigin - bbox.x) + "px " + (cache.yOrigin - bbox.y) + "px". Previously we let the data-svg-origin stay instead, but when introducing revert(), it complicated things.
      t2 = target.getBBox();
      origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
      t1 = "";
    } else {
      t1 = !uncache && target.getAttribute("data-svg-origin"); //  Remember, to work around browser inconsistencies we always force SVG elements' transformOrigin to 0,0 and offset the translation accordingly.
    }

    _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
  }

  xOrigin = cache.xOrigin || 0;
  yOrigin = cache.yOrigin || 0;

  if (matrix !== _identity2DMatrix) {
    a = matrix[0]; //a11

    b = matrix[1]; //a21

    c = matrix[2]; //a31

    d = matrix[3]; //a41

    x = a12 = matrix[4];
    y = a22 = matrix[5]; //2D matrix

    if (matrix.length === 6) {
      scaleX = Math.sqrt(a * a + b * b);
      scaleY = Math.sqrt(d * d + c * c);
      rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).

      skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
      skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));

      if (cache.svg) {
        x -= xOrigin - (xOrigin * a + yOrigin * c);
        y -= yOrigin - (xOrigin * b + yOrigin * d);
      } //3D matrix

    } else {
      a32 = matrix[6];
      a42 = matrix[7];
      a13 = matrix[8];
      a23 = matrix[9];
      a33 = matrix[10];
      a43 = matrix[11];
      x = matrix[12];
      y = matrix[13];
      z = matrix[14];
      angle = _atan2(a32, a33);
      rotationX = angle * _RAD2DEG; //rotationX

      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a12 * cos + a13 * sin;
        t2 = a22 * cos + a23 * sin;
        t3 = a32 * cos + a33 * sin;
        a13 = a12 * -sin + a13 * cos;
        a23 = a22 * -sin + a23 * cos;
        a33 = a32 * -sin + a33 * cos;
        a43 = a42 * -sin + a43 * cos;
        a12 = t1;
        a22 = t2;
        a32 = t3;
      } //rotationY


      angle = _atan2(-c, a33);
      rotationY = angle * _RAD2DEG;

      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a * cos - a13 * sin;
        t2 = b * cos - a23 * sin;
        t3 = c * cos - a33 * sin;
        a43 = d * sin + a43 * cos;
        a = t1;
        b = t2;
        c = t3;
      } //rotationZ


      angle = _atan2(b, a);
      rotation = angle * _RAD2DEG;

      if (angle) {
        cos = Math.cos(angle);
        sin = Math.sin(angle);
        t1 = a * cos + b * sin;
        t2 = a12 * cos + a22 * sin;
        b = b * cos - a * sin;
        a22 = a22 * cos - a12 * sin;
        a = t1;
        a12 = t2;
      }

      if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
        //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
        rotationX = rotation = 0;
        rotationY = 180 - rotationY;
      }

      scaleX = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(Math.sqrt(a * a + b * b + c * c));
      scaleY = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(Math.sqrt(a22 * a22 + a32 * a32));
      angle = _atan2(a12, a22);
      skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
      perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
    }

    if (cache.svg) {
      //sense if there are CSS transforms applied on an SVG element in which case we must overwrite them when rendering. The transform attribute is more reliable cross-browser, but we can't just remove the CSS ones because they may be applied in a CSS rule somewhere (not just inline).
      t1 = target.getAttribute("transform");
      cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
      t1 && target.setAttribute("transform", t1);
    }
  }

  if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
    if (invertedScaleX) {
      scaleX *= -1;
      skewX += rotation <= 0 ? 180 : -180;
      rotation += rotation <= 0 ? 180 : -180;
    } else {
      scaleY *= -1;
      skewX += skewX <= 0 ? 180 : -180;
    }
  }

  uncache = uncache || cache.uncache;
  cache.x = x - ((cache.xPercent = x && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
  cache.y = y - ((cache.yPercent = y && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
  cache.z = z + px;
  cache.scaleX = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(scaleX);
  cache.scaleY = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(scaleY);
  cache.rotation = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(rotation) + deg;
  cache.rotationX = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(rotationX) + deg;
  cache.rotationY = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(rotationY) + deg;
  cache.skewX = skewX + deg;
  cache.skewY = skewY + deg;
  cache.transformPerspective = perspective + px;

  if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || !uncache && cache.zOrigin || 0) {
    style[_transformOriginProp] = _firstTwoOnly(origin);
  }

  cache.xOffset = cache.yOffset = 0;
  cache.force3D = _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._config.force3D;
  cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
  cache.uncache = 0;
  return cache;
},
    _firstTwoOnly = function _firstTwoOnly(value) {
  return (value = value.split(" "))[0] + " " + value[1];
},
    //for handling transformOrigin values, stripping out the 3rd dimension
_addPxTranslate = function _addPxTranslate(target, start, value) {
  var unit = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.getUnit)(start);
  return (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
},
    _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
  cache.z = "0px";
  cache.rotationY = cache.rotationX = "0deg";
  cache.force3D = 0;

  _renderCSSTransforms(ratio, cache);
},
    _zeroDeg = "0deg",
    _zeroPx = "0px",
    _endParenthesis = ") ",
    _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
  var _ref = cache || this,
      xPercent = _ref.xPercent,
      yPercent = _ref.yPercent,
      x = _ref.x,
      y = _ref.y,
      z = _ref.z,
      rotation = _ref.rotation,
      rotationY = _ref.rotationY,
      rotationX = _ref.rotationX,
      skewX = _ref.skewX,
      skewY = _ref.skewY,
      scaleX = _ref.scaleX,
      scaleY = _ref.scaleY,
      transformPerspective = _ref.transformPerspective,
      force3D = _ref.force3D,
      target = _ref.target,
      zOrigin = _ref.zOrigin,
      transforms = "",
      use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true; // Safari has a bug that causes it not to render 3D transform-origin values properly, so we force the z origin to 0, record it in the cache, and then do the math here to offset the translate values accordingly (basically do the 3D transform-origin part manually)


  if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
    var angle = parseFloat(rotationY) * _DEG2RAD,
        a13 = Math.sin(angle),
        a33 = Math.cos(angle),
        cos;

    angle = parseFloat(rotationX) * _DEG2RAD;
    cos = Math.cos(angle);
    x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
    y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
    z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
  }

  if (transformPerspective !== _zeroPx) {
    transforms += "perspective(" + transformPerspective + _endParenthesis;
  }

  if (xPercent || yPercent) {
    transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
  }

  if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
    transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
  }

  if (rotation !== _zeroDeg) {
    transforms += "rotate(" + rotation + _endParenthesis;
  }

  if (rotationY !== _zeroDeg) {
    transforms += "rotateY(" + rotationY + _endParenthesis;
  }

  if (rotationX !== _zeroDeg) {
    transforms += "rotateX(" + rotationX + _endParenthesis;
  }

  if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
    transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
  }

  if (scaleX !== 1 || scaleY !== 1) {
    transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
  }

  target.style[_transformProp] = transforms || "translate(0, 0)";
},
    _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
  var _ref2 = cache || this,
      xPercent = _ref2.xPercent,
      yPercent = _ref2.yPercent,
      x = _ref2.x,
      y = _ref2.y,
      rotation = _ref2.rotation,
      skewX = _ref2.skewX,
      skewY = _ref2.skewY,
      scaleX = _ref2.scaleX,
      scaleY = _ref2.scaleY,
      target = _ref2.target,
      xOrigin = _ref2.xOrigin,
      yOrigin = _ref2.yOrigin,
      xOffset = _ref2.xOffset,
      yOffset = _ref2.yOffset,
      forceCSS = _ref2.forceCSS,
      tx = parseFloat(x),
      ty = parseFloat(y),
      a11,
      a21,
      a12,
      a22,
      temp;

  rotation = parseFloat(rotation);
  skewX = parseFloat(skewX);
  skewY = parseFloat(skewY);

  if (skewY) {
    //for performance reasons, we combine all skewing into the skewX and rotation values. Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of 10 degrees.
    skewY = parseFloat(skewY);
    skewX += skewY;
    rotation += skewY;
  }

  if (rotation || skewX) {
    rotation *= _DEG2RAD;
    skewX *= _DEG2RAD;
    a11 = Math.cos(rotation) * scaleX;
    a21 = Math.sin(rotation) * scaleX;
    a12 = Math.sin(rotation - skewX) * -scaleY;
    a22 = Math.cos(rotation - skewX) * scaleY;

    if (skewX) {
      skewY *= _DEG2RAD;
      temp = Math.tan(skewX - skewY);
      temp = Math.sqrt(1 + temp * temp);
      a12 *= temp;
      a22 *= temp;

      if (skewY) {
        temp = Math.tan(skewY);
        temp = Math.sqrt(1 + temp * temp);
        a11 *= temp;
        a21 *= temp;
      }
    }

    a11 = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(a11);
    a21 = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(a21);
    a12 = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(a12);
    a22 = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(a22);
  } else {
    a11 = scaleX;
    a22 = scaleY;
    a21 = a12 = 0;
  }

  if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
    tx = _convertToUnit(target, "x", x, "px");
    ty = _convertToUnit(target, "y", y, "px");
  }

  if (xOrigin || yOrigin || xOffset || yOffset) {
    tx = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
    ty = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
  }

  if (xPercent || yPercent) {
    //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the translation to simulate it.
    temp = target.getBBox();
    tx = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(tx + xPercent / 100 * temp.width);
    ty = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._round)(ty + yPercent / 100 * temp.height);
  }

  temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
  target.setAttribute("transform", temp);
  forceCSS && (target.style[_transformProp] = temp); //some browsers prioritize CSS transforms over the transform attribute. When we sense that the user has CSS transforms applied, we must overwrite them this way (otherwise some browser simply won't render the transform attribute changes!)
},
    _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue) {
  var cap = 360,
      isString = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._isString)(endValue),
      endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
      change = endNum - startNum,
      finalValue = startNum + change + "deg",
      direction,
      pt;

  if (isString) {
    direction = endValue.split("_")[1];

    if (direction === "short") {
      change %= cap;

      if (change !== change % (cap / 2)) {
        change += change < 0 ? cap : -cap;
      }
    }

    if (direction === "cw" && change < 0) {
      change = (change + cap * _bigNum) % cap - ~~(change / cap) * cap;
    } else if (direction === "ccw" && change > 0) {
      change = (change - cap * _bigNum) % cap - ~~(change / cap) * cap;
    }
  }

  plugin._pt = pt = new _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
  pt.e = finalValue;
  pt.u = "deg";

  plugin._props.push(property);

  return pt;
},
    _assign = function _assign(target, source) {
  // Internet Explorer doesn't have Object.assign(), so we recreate it here.
  for (var p in source) {
    target[p] = source[p];
  }

  return target;
},
    _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
  //for handling cases where someone passes in a whole transform string, like transform: "scale(2, 3) rotate(20deg) translateY(30em)"
  var startCache = _assign({}, target._gsap),
      exclude = "perspective,force3D,transformOrigin,svgOrigin",
      style = target.style,
      endCache,
      p,
      startValue,
      endValue,
      startNum,
      endNum,
      startUnit,
      endUnit;

  if (startCache.svg) {
    startValue = target.getAttribute("transform");
    target.setAttribute("transform", "");
    style[_transformProp] = transforms;
    endCache = _parseTransform(target, 1);

    _removeProperty(target, _transformProp);

    target.setAttribute("transform", startValue);
  } else {
    startValue = getComputedStyle(target)[_transformProp];
    style[_transformProp] = transforms;
    endCache = _parseTransform(target, 1);
    style[_transformProp] = startValue;
  }

  for (p in _transformProps) {
    startValue = startCache[p];
    endValue = endCache[p];

    if (startValue !== endValue && exclude.indexOf(p) < 0) {
      //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
      startUnit = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.getUnit)(startValue);
      endUnit = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.getUnit)(endValue);
      startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
      endNum = parseFloat(endValue);
      plugin._pt = new _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
      plugin._pt.u = endUnit || 0;

      plugin._props.push(p);
    }
  }

  _assign(endCache, startCache);
}; // handle splitting apart padding, margin, borderWidth, and borderRadius into their 4 components. Firefox, for example, won't report borderRadius correctly - it will only do borderTopLeftRadius and the other corners. We also want to handle paddingTop, marginLeft, borderRightWidth, etc.


(0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._forEachName)("padding,margin,Width,Radius", function (name, index) {
  var t = "Top",
      r = "Right",
      b = "Bottom",
      l = "Left",
      props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function (side) {
    return index < 2 ? name + side : "border" + side + name;
  });

  _specialProps[index > 1 ? "border" + name : name] = function (plugin, target, property, endValue, tween) {
    var a, vars;

    if (arguments.length < 4) {
      // getter, passed target, property, and unit (from _get())
      a = props.map(function (prop) {
        return _get(plugin, prop, property);
      });
      vars = a.join(" ");
      return vars.split(a[0]).length === 5 ? a[0] : vars;
    }

    a = (endValue + "").split(" ");
    vars = {};
    props.forEach(function (prop, i) {
      return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
    });
    plugin.init(target, vars, tween);
  };
});

var CSSPlugin = {
  name: "css",
  register: _initCore,
  targetTest: function targetTest(target) {
    return target.style && target.nodeType;
  },
  init: function init(target, vars, tween, index, targets) {
    var props = this._props,
        style = target.style,
        startAt = tween.vars.startAt,
        startValue,
        endValue,
        endNum,
        startNum,
        type,
        specialProp,
        p,
        startUnit,
        endUnit,
        relative,
        isTransformRelated,
        transformPropTween,
        cache,
        smooth,
        hasPriority,
        inlineProps;
    _pluginInitted || _initCore(); // we may call init() multiple times on the same plugin instance, like when adding special properties, so make sure we don't overwrite the revert data or inlineProps

    this.styles = this.styles || _getStyleSaver(target);
    inlineProps = this.styles.props;
    this.tween = tween;

    for (p in vars) {
      if (p === "autoRound") {
        continue;
      }

      endValue = vars[p];

      if (_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._plugins[p] && (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._checkPlugin)(p, vars, tween, index, target, targets)) {
        // plugins
        continue;
      }

      type = typeof endValue;
      specialProp = _specialProps[p];

      if (type === "function") {
        endValue = endValue.call(tween, index, target, targets);
        type = typeof endValue;
      }

      if (type === "string" && ~endValue.indexOf("random(")) {
        endValue = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._replaceRandom)(endValue);
      }

      if (specialProp) {
        specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
      } else if (p.substr(0, 2) === "--") {
        //CSS variable
        startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
        endValue += "";
        _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._colorExp.lastIndex = 0;

        if (!_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._colorExp.test(startValue)) {
          // colors don't have units
          startUnit = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.getUnit)(startValue);
          endUnit = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.getUnit)(endValue);
        }

        endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
        this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
        props.push(p);
        inlineProps.push(p, 0, style[p]);
      } else if (type !== "undefined") {
        if (startAt && p in startAt) {
          // in case someone hard-codes a complex value as the start, like top: "calc(2vh / 2)". Without this, it'd use the computed value (always in px)
          startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
          (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._isString)(startValue) && ~startValue.indexOf("random(") && (startValue = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._replaceRandom)(startValue));
          (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.getUnit)(startValue + "") || startValue === "auto" || (startValue += _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._config.units[p] || (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.getUnit)(_get(target, p)) || ""); // for cases when someone passes in a unitless value like {x: 100}; if we try setting translate(100, 0px) it won't work.

          (startValue + "").charAt(1) === "=" && (startValue = _get(target, p)); // can't work with relative values
        } else {
          startValue = _get(target, p);
        }

        startNum = parseFloat(startValue);
        relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
        relative && (endValue = endValue.substr(2));
        endNum = parseFloat(endValue);

        if (p in _propertyAliases) {
          if (p === "autoAlpha") {
            //special case where we control the visibility along with opacity. We still allow the opacity value to pass through and get tweened.
            if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
              //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
              startNum = 0;
            }

            inlineProps.push("visibility", 0, style.visibility);

            _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
          }

          if (p !== "scale" && p !== "transform") {
            p = _propertyAliases[p];
            ~p.indexOf(",") && (p = p.split(",")[0]);
          }
        }

        isTransformRelated = p in _transformProps; //--- TRANSFORM-RELATED ---

        if (isTransformRelated) {
          this.styles.save(p);

          if (type === "string" && endValue.substring(0, 6) === "var(--") {
            endValue = _getComputedProperty(target, endValue.substring(4, endValue.indexOf(")")));
            endNum = parseFloat(endValue);
          }

          if (!transformPropTween) {
            cache = target._gsap;
            cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform); // if, for example, gsap.set(... {transform:"translateX(50vw)"}), the _get() call doesn't parse the transform, thus cache.renderTransform won't be set yet so force the parsing of the transform here.

            smooth = vars.smoothOrigin !== false && cache.smooth;
            transformPropTween = this._pt = new _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1); //the first time through, create the rendering PropTween so that it runs LAST (in the linked list, we keep adding to the beginning)

            transformPropTween.dep = 1; //flag it as dependent so that if things get killed/overwritten and this is the only PropTween left, we can safely kill the whole tween.
          }

          if (p === "scale") {
            this._pt = new _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._parseRelative)(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
            this._pt.u = 0;
            props.push("scaleY", p);
            p += "X";
          } else if (p === "transformOrigin") {
            inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
            endValue = _convertKeywordsToPercentages(endValue); //in case something like "left top" or "bottom right" is passed in. Convert to percentages.

            if (cache.svg) {
              _applySVGOrigin(target, endValue, 0, smooth, 0, this);
            } else {
              endUnit = parseFloat(endValue.split(" ")[2]) || 0; //handle the zOrigin separately!

              endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);

              _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
            }

            continue;
          } else if (p === "svgOrigin") {
            _applySVGOrigin(target, endValue, 1, smooth, 0, this);

            continue;
          } else if (p in _rotationalProperties) {
            _addRotationalPropTween(this, cache, p, startNum, relative ? (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._parseRelative)(startNum, relative + endValue) : endValue);

            continue;
          } else if (p === "smoothOrigin") {
            _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);

            continue;
          } else if (p === "force3D") {
            cache[p] = endValue;
            continue;
          } else if (p === "transform") {
            _addRawTransformPTs(this, endValue, target);

            continue;
          }
        } else if (!(p in style)) {
          p = _checkPropPrefix(p) || p;
        }

        if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
          startUnit = (startValue + "").substr((startNum + "").length);
          endNum || (endNum = 0); // protect against NaN

          endUnit = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.getUnit)(endValue) || (p in _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._config.units ? _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._config.units[p] : startUnit);
          startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
          this._pt = new _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, (relative ? (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._parseRelative)(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
          this._pt.u = endUnit || 0;

          if (startUnit !== endUnit && endUnit !== "%") {
            //when the tween goes all the way back to the beginning, we need to revert it to the OLD/ORIGINAL value (with those units). We record that as a "b" (beginning) property and point to a render method that handles that. (performance optimization)
            this._pt.b = startValue;
            this._pt.r = _renderCSSPropWithBeginning;
          }
        } else if (!(p in style)) {
          if (p in target) {
            //maybe it's not a style - it could be a property added directly to an element in which case we'll try to animate that.
            this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
          } else if (p !== "parseTransform") {
            (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._missingPlugin)(p, endValue);

            continue;
          }
        } else {
          _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
        }

        isTransformRelated || (p in style ? inlineProps.push(p, 0, style[p]) : typeof target[p] === "function" ? inlineProps.push(p, 2, target[p]()) : inlineProps.push(p, 1, startValue || target[p]));
        props.push(p);
      }
    }

    hasPriority && (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._sortPropTweensByPriority)(this);
  },
  render: function render(ratio, data) {
    if (data.tween._time || !_reverting()) {
      var pt = data._pt;

      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
    } else {
      data.styles.revert();
    }
  },
  get: _get,
  aliases: _propertyAliases,
  getSetter: function getSetter(target, property, plugin) {
    //returns a setter function that accepts target, property, value and applies it accordingly. Remember, properties like "x" aren't as simple as target.style.property = value because they've got to be applied to a proxy object and then merged into a transform string in a renderer.
    var p = _propertyAliases[property];
    p && p.indexOf(",") < 0 && (property = p);
    return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !(0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._isUndefined)(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._getSetter)(target, property);
  },
  core: {
    _removeProperty: _removeProperty,
    _getMatrix: _getMatrix
  }
};
_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.gsap.utils.checkPrefix = _checkPropPrefix;
_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.gsap.core.getStyleSaver = _getStyleSaver;

(function (positionAndScale, rotation, others, aliases) {
  var all = (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._forEachName)(positionAndScale + "," + rotation + "," + others, function (name) {
    _transformProps[name] = 1;
  });

  (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._forEachName)(rotation, function (name) {
    _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._config.units[name] = "deg";
    _rotationalProperties[name] = 1;
  });

  _propertyAliases[all[13]] = positionAndScale + "," + rotation;

  (0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._forEachName)(aliases, function (name) {
    var split = name.split(":");
    _propertyAliases[split[1]] = all[split[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");

(0,_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._forEachName)("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
  _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__._config.units[name] = "px";
});

_gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.gsap.registerPlugin(CSSPlugin);


/***/ }),

/***/ "./node_modules/gsap/gsap-core.js":
/*!****************************************!*\
  !*** ./node_modules/gsap/gsap-core.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Animation: () => (/* binding */ Animation),
/* harmony export */   Back: () => (/* binding */ Back),
/* harmony export */   Bounce: () => (/* binding */ Bounce),
/* harmony export */   Circ: () => (/* binding */ Circ),
/* harmony export */   Cubic: () => (/* binding */ Cubic),
/* harmony export */   Elastic: () => (/* binding */ Elastic),
/* harmony export */   Expo: () => (/* binding */ Expo),
/* harmony export */   GSCache: () => (/* binding */ GSCache),
/* harmony export */   Linear: () => (/* binding */ Linear),
/* harmony export */   Power0: () => (/* binding */ Power0),
/* harmony export */   Power1: () => (/* binding */ Power1),
/* harmony export */   Power2: () => (/* binding */ Power2),
/* harmony export */   Power3: () => (/* binding */ Power3),
/* harmony export */   Power4: () => (/* binding */ Power4),
/* harmony export */   PropTween: () => (/* binding */ PropTween),
/* harmony export */   Quad: () => (/* binding */ Quad),
/* harmony export */   Quart: () => (/* binding */ Quart),
/* harmony export */   Quint: () => (/* binding */ Quint),
/* harmony export */   Sine: () => (/* binding */ Sine),
/* harmony export */   SteppedEase: () => (/* binding */ SteppedEase),
/* harmony export */   Strong: () => (/* binding */ Strong),
/* harmony export */   Timeline: () => (/* binding */ Timeline),
/* harmony export */   TimelineLite: () => (/* binding */ Timeline),
/* harmony export */   TimelineMax: () => (/* binding */ Timeline),
/* harmony export */   Tween: () => (/* binding */ Tween),
/* harmony export */   TweenLite: () => (/* binding */ Tween),
/* harmony export */   TweenMax: () => (/* binding */ Tween),
/* harmony export */   _checkPlugin: () => (/* binding */ _checkPlugin),
/* harmony export */   _colorExp: () => (/* binding */ _colorExp),
/* harmony export */   _colorStringFilter: () => (/* binding */ _colorStringFilter),
/* harmony export */   _config: () => (/* binding */ _config),
/* harmony export */   _forEachName: () => (/* binding */ _forEachName),
/* harmony export */   _getCache: () => (/* binding */ _getCache),
/* harmony export */   _getProperty: () => (/* binding */ _getProperty),
/* harmony export */   _getSetter: () => (/* binding */ _getSetter),
/* harmony export */   _isString: () => (/* binding */ _isString),
/* harmony export */   _isUndefined: () => (/* binding */ _isUndefined),
/* harmony export */   _missingPlugin: () => (/* binding */ _missingPlugin),
/* harmony export */   _numExp: () => (/* binding */ _numExp),
/* harmony export */   _numWithUnitExp: () => (/* binding */ _numWithUnitExp),
/* harmony export */   _parseRelative: () => (/* binding */ _parseRelative),
/* harmony export */   _plugins: () => (/* binding */ _plugins),
/* harmony export */   _relExp: () => (/* binding */ _relExp),
/* harmony export */   _removeLinkedListItem: () => (/* binding */ _removeLinkedListItem),
/* harmony export */   _renderComplexString: () => (/* binding */ _renderComplexString),
/* harmony export */   _replaceRandom: () => (/* binding */ _replaceRandom),
/* harmony export */   _round: () => (/* binding */ _round),
/* harmony export */   _roundModifier: () => (/* binding */ _roundModifier),
/* harmony export */   _setDefaults: () => (/* binding */ _setDefaults),
/* harmony export */   _sortPropTweensByPriority: () => (/* binding */ _sortPropTweensByPriority),
/* harmony export */   _ticker: () => (/* binding */ _ticker),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   "default": () => (/* binding */ gsap),
/* harmony export */   distribute: () => (/* binding */ distribute),
/* harmony export */   getUnit: () => (/* binding */ getUnit),
/* harmony export */   gsap: () => (/* binding */ gsap),
/* harmony export */   interpolate: () => (/* binding */ interpolate),
/* harmony export */   mapRange: () => (/* binding */ mapRange),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   pipe: () => (/* binding */ pipe),
/* harmony export */   random: () => (/* binding */ random),
/* harmony export */   selector: () => (/* binding */ selector),
/* harmony export */   shuffle: () => (/* binding */ shuffle),
/* harmony export */   snap: () => (/* binding */ snap),
/* harmony export */   splitColor: () => (/* binding */ splitColor),
/* harmony export */   toArray: () => (/* binding */ toArray),
/* harmony export */   unitize: () => (/* binding */ unitize),
/* harmony export */   wrap: () => (/* binding */ wrap),
/* harmony export */   wrapYoyo: () => (/* binding */ wrapYoyo)
/* harmony export */ });
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/*!
 * GSAP 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var _config = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
},
    _defaults = {
  duration: .5,
  overwrite: false,
  delay: 0
},
    _suppressOverwrites,
    _reverting,
    _context,
    _bigNum = 1e8,
    _tinyNum = 1 / _bigNum,
    _2PI = Math.PI * 2,
    _HALF_PI = _2PI / 4,
    _gsID = 0,
    _sqrt = Math.sqrt,
    _cos = Math.cos,
    _sin = Math.sin,
    _isString = function _isString(value) {
  return typeof value === "string";
},
    _isFunction = function _isFunction(value) {
  return typeof value === "function";
},
    _isNumber = function _isNumber(value) {
  return typeof value === "number";
},
    _isUndefined = function _isUndefined(value) {
  return typeof value === "undefined";
},
    _isObject = function _isObject(value) {
  return typeof value === "object";
},
    _isNotFalse = function _isNotFalse(value) {
  return value !== false;
},
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _isFuncOrString = function _isFuncOrString(value) {
  return _isFunction(value) || _isString(value);
},
    _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function () {},
    // note: IE10 has ArrayBuffer, but NOT ArrayBuffer.isView().
_isArray = Array.isArray,
    _strictNumExp = /(?:-?\.?\d|\.)+/gi,
    //only numbers (including negatives and decimals) but NOT relative values.
_numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
    //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
_numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
    _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
    //duplicate so that while we're looping through matches from exec(), it doesn't contaminate the lastIndex of _numExp which we use to search for colors too.
_relExp = /[+-]=-?[.\d]+/,
    _delimitedValueExp = /[^,'"\[\]\s]+/gi,
    // previously /[#\-+.]*\b[a-z\d\-=+%.]+/gi but didn't catch special characters.
_unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
    _globalTimeline,
    _win,
    _coreInitted,
    _doc,
    _globals = {},
    _installScope = {},
    _coreReady,
    _install = function _install(scope) {
  return (_installScope = _merge(scope, _globals)) && gsap;
},
    _missingPlugin = function _missingPlugin(property, value) {
  return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
},
    _warn = function _warn(message, suppress) {
  return !suppress && console.warn(message);
},
    _addGlobal = function _addGlobal(name, obj) {
  return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
},
    _emptyFunc = function _emptyFunc() {
  return 0;
},
    _startAtRevertConfig = {
  suppressEvents: true,
  isStart: true,
  kill: false
},
    _revertConfigNoKill = {
  suppressEvents: true,
  kill: false
},
    _revertConfig = {
  suppressEvents: true
},
    _reservedProps = {},
    _lazyTweens = [],
    _lazyLookup = {},
    _lastRenderedFrame,
    _plugins = {},
    _effects = {},
    _nextGCFrame = 30,
    _harnessPlugins = [],
    _callbackNames = "",
    _harness = function _harness(targets) {
  var target = targets[0],
      harnessPlugin,
      i;
  _isObject(target) || _isFunction(target) || (targets = [targets]);

  if (!(harnessPlugin = (target._gsap || {}).harness)) {
    // find the first target with a harness. We assume targets passed into an animation will be of similar type, meaning the same kind of harness can be used for them all (performance optimization)
    i = _harnessPlugins.length;

    while (i-- && !_harnessPlugins[i].targetTest(target)) {}

    harnessPlugin = _harnessPlugins[i];
  }

  i = targets.length;

  while (i--) {
    targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
  }

  return targets;
},
    _getCache = function _getCache(target) {
  return target._gsap || _harness(toArray(target))[0]._gsap;
},
    _getProperty = function _getProperty(target, property, v) {
  return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
},
    _forEachName = function _forEachName(names, func) {
  return (names = names.split(",")).forEach(func) || names;
},
    //split a comma-delimited list of names into an array, then run a forEach() function and return the split array (this is just a way to consolidate/shorten some code).
_round = function _round(value) {
  return Math.round(value * 100000) / 100000 || 0;
},
    _roundPrecise = function _roundPrecise(value) {
  return Math.round(value * 10000000) / 10000000 || 0;
},
    // increased precision mostly for timing values.
_parseRelative = function _parseRelative(start, value) {
  var operator = value.charAt(0),
      end = parseFloat(value.substr(2));
  start = parseFloat(start);
  return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
},
    _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
  //searches one array to find matches for any of the items in the toFind array. As soon as one is found, it returns true. It does NOT return all the matches; it's simply a boolean search.
  var l = toFind.length,
      i = 0;

  for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}

  return i < l;
},
    _lazyRender = function _lazyRender() {
  var l = _lazyTweens.length,
      a = _lazyTweens.slice(0),
      i,
      tween;

  _lazyLookup = {};
  _lazyTweens.length = 0;

  for (i = 0; i < l; i++) {
    tween = a[i];
    tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
  }
},
    _isRevertWorthy = function _isRevertWorthy(animation) {
  return !!(animation._initted || animation._startAt || animation.add);
},
    _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
  _lazyTweens.length && !_reverting && _lazyRender();
  animation.render(time, suppressEvents, force || !!(_reverting && time < 0 && _isRevertWorthy(animation)));
  _lazyTweens.length && !_reverting && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
},
    _numericIfPossible = function _numericIfPossible(value) {
  var n = parseFloat(value);
  return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
},
    _passThrough = function _passThrough(p) {
  return p;
},
    _setDefaults = function _setDefaults(obj, defaults) {
  for (var p in defaults) {
    p in obj || (obj[p] = defaults[p]);
  }

  return obj;
},
    _setKeyframeDefaults = function _setKeyframeDefaults(excludeDuration) {
  return function (obj, defaults) {
    for (var p in defaults) {
      p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults[p]);
    }
  };
},
    _merge = function _merge(base, toMerge) {
  for (var p in toMerge) {
    base[p] = toMerge[p];
  }

  return base;
},
    _mergeDeep = function _mergeDeep(base, toMerge) {
  for (var p in toMerge) {
    p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
  }

  return base;
},
    _copyExcluding = function _copyExcluding(obj, excluding) {
  var copy = {},
      p;

  for (p in obj) {
    p in excluding || (copy[p] = obj[p]);
  }

  return copy;
},
    _inheritDefaults = function _inheritDefaults(vars) {
  var parent = vars.parent || _globalTimeline,
      func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults;

  if (_isNotFalse(vars.inherit)) {
    while (parent) {
      func(vars, parent.vars.defaults);
      parent = parent.parent || parent._dp;
    }
  }

  return vars;
},
    _arraysMatch = function _arraysMatch(a1, a2) {
  var i = a1.length,
      match = i === a2.length;

  while (match && i-- && a1[i] === a2[i]) {}

  return i < 0;
},
    _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = parent[lastProp],
      t;

  if (sortBy) {
    t = child[sortBy];

    while (prev && prev[sortBy] > t) {
      prev = prev._prev;
    }
  }

  if (prev) {
    child._next = prev._next;
    prev._next = child;
  } else {
    child._next = parent[firstProp];
    parent[firstProp] = child;
  }

  if (child._next) {
    child._next._prev = child;
  } else {
    parent[lastProp] = child;
  }

  child._prev = prev;
  child.parent = child._dp = parent;
  return child;
},
    _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = child._prev,
      next = child._next;

  if (prev) {
    prev._next = next;
  } else if (parent[firstProp] === child) {
    parent[firstProp] = next;
  }

  if (next) {
    next._prev = prev;
  } else if (parent[lastProp] === child) {
    parent[lastProp] = prev;
  }

  child._next = child._prev = child.parent = null; // don't delete the _dp just so we can revert if necessary. But parent should be null to indicate the item isn't in a linked list.
},
    _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
  child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
  child._act = 0;
},
    _uncache = function _uncache(animation, child) {
  if (animation && (!child || child._end > animation._dur || child._start < 0)) {
    // performance optimization: if a child animation is passed in we should only uncache if that child EXTENDS the animation (its end time is beyond the end)
    var a = animation;

    while (a) {
      a._dirty = 1;
      a = a.parent;
    }
  }

  return animation;
},
    _recacheAncestors = function _recacheAncestors(animation) {
  var parent = animation.parent;

  while (parent && parent.parent) {
    //sometimes we must force a re-sort of all children and update the duration/totalDuration of all ancestor timelines immediately in case, for example, in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
    parent._dirty = 1;
    parent.totalDuration();
    parent = parent.parent;
  }

  return animation;
},
    _rewindStartAt = function _rewindStartAt(tween, totalTime, suppressEvents, force) {
  return tween._startAt && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
},
    _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
  return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
},
    _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
  return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
},
    // feed in the totalTime and cycleDuration and it'll return the cycle (iteration minus 1) and if the playhead is exactly at the very END, it will NOT bump up to the next cycle.
_animationCycle = function _animationCycle(tTime, cycleDuration) {
  var whole = Math.floor(tTime = _roundPrecise(tTime / cycleDuration));
  return tTime && whole === tTime ? whole - 1 : whole;
},
    _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
  return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
},
    _setEnd = function _setEnd(animation) {
  return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
},
    _alignPlayhead = function _alignPlayhead(animation, totalTime) {
  // adjusts the animation's _start and _end according to the provided totalTime (only if the parent's smoothChildTiming is true and the animation isn't paused). It doesn't do any rendering or forcing things back into parent timelines, etc. - that's what totalTime() is for.
  var parent = animation._dp;

  if (parent && parent.smoothChildTiming && animation._ts) {
    animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));

    _setEnd(animation);

    parent._dirty || _uncache(parent, animation); //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
  }

  return animation;
},

/*
_totalTimeToTime = (clampedTotalTime, duration, repeat, repeatDelay, yoyo) => {
	let cycleDuration = duration + repeatDelay,
		time = _round(clampedTotalTime % cycleDuration);
	if (time > duration) {
		time = duration;
	}
	return (yoyo && (~~(clampedTotalTime / cycleDuration) & 1)) ? duration - time : time;
},
*/
_postAddChecks = function _postAddChecks(timeline, child) {
  var t;

  if (child._time || !child._dur && child._initted || child._start < timeline._time && (child._dur || !child.add)) {
    // in case, for example, the _start is moved on a tween that has already rendered, or if it's being inserted into a timeline BEFORE where the playhead is currently. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning. Special case: if it's a timeline (has .add() method) and no duration, we can skip rendering because the user may be populating it AFTER adding it to a parent timeline (unconventional, but possible, and we wouldn't want it to get removed if the parent's autoRemoveChildren is true).
    t = _parentToChildTotalTime(timeline.rawTime(), child);

    if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
      child.render(t, true);
    }
  } //if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.


  if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
    //in case any of the ancestors had completed but should now be enabled...
    if (timeline._dur < timeline.duration()) {
      t = timeline;

      while (t._dp) {
        t.rawTime() >= 0 && t.totalTime(t._tTime); //moves the timeline (shifts its startTime) if necessary, and also enables it. If it's currently zero, though, it may not be scheduled to render until later so there's no need to force it to align with the current playhead position. Only move to catch up with the playhead.

        t = t._dp;
      }
    }

    timeline._zTime = -_tinyNum; // helps ensure that the next render() will be forced (crossingStart = true in render()), even if the duration hasn't changed (we're adding a child which would need to get rendered). Definitely an edge case. Note: we MUST do this AFTER the loop above where the totalTime() might trigger a render() because this _addToTimeline() method gets called from the Animation constructor, BEFORE tweens even record their targets, etc. so we wouldn't want things to get triggered in the wrong order.
  }
},
    _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
  child.parent && _removeFromParent(child);
  child._start = _roundPrecise((_isNumber(position) ? position : position || timeline !== _globalTimeline ? _parsePosition(timeline, position, child) : timeline._time) + child._delay);
  child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));

  _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);

  _isFromOrFromStart(child) || (timeline._recent = child);
  skipChecks || _postAddChecks(timeline, child);
  timeline._ts < 0 && _alignPlayhead(timeline, timeline._tTime); // if the timeline is reversed and the new child makes it longer, we may need to adjust the parent's _start (push it back)

  return timeline;
},
    _scrollTrigger = function _scrollTrigger(animation, trigger) {
  return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
},
    _attemptInitTween = function _attemptInitTween(tween, time, force, suppressEvents, tTime) {
  _initTween(tween, time, tTime);

  if (!tween._initted) {
    return 1;
  }

  if (!force && tween._pt && !_reverting && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
    _lazyTweens.push(tween);

    tween._lazy = [tTime, suppressEvents];
    return 1;
  }
},
    _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart(_ref) {
  var parent = _ref.parent;
  return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart(parent));
},
    // check parent's _lock because when a timeline repeats/yoyos and does its artificial wrapping, we shouldn't force the ratio back to 0
_isFromOrFromStart = function _isFromOrFromStart(_ref2) {
  var data = _ref2.data;
  return data === "isFromStart" || data === "isStart";
},
    _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
  var prevRatio = tween.ratio,
      ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1,
      // if the tween or its parent is reversed and the totalTime is 0, we should go to a ratio of 0. Edge case: if a from() or fromTo() stagger tween is placed later in a timeline, the "startAt" zero-duration tween could initially render at a time when the parent timeline's playhead is technically BEFORE where this tween is, so make sure that any "from" and "fromTo" startAt tweens are rendered the first time at a ratio of 1.
  repeatDelay = tween._rDelay,
      tTime = 0,
      pt,
      iteration,
      prevIteration;

  if (repeatDelay && tween._repeat) {
    // in case there's a zero-duration tween that has a repeat with a repeatDelay
    tTime = _clamp(0, tween._tDur, totalTime);
    iteration = _animationCycle(tTime, repeatDelay);
    tween._yoyo && iteration & 1 && (ratio = 1 - ratio);

    if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
      // if iteration changed
      prevRatio = 1 - ratio;
      tween.vars.repeatRefresh && tween._initted && tween.invalidate();
    }
  }

  if (ratio !== prevRatio || _reverting || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
    if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) {
      // if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
      return;
    }

    prevIteration = tween._zTime;
    tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0); // when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

    suppressEvents || (suppressEvents = totalTime && !prevIteration); // if it was rendered previously at exactly 0 (_zTime) and now the playhead is moving away, DON'T fire callbacks otherwise they'll seem like duplicates.

    tween.ratio = ratio;
    tween._from && (ratio = 1 - ratio);
    tween._time = 0;
    tween._tTime = tTime;
    pt = tween._pt;

    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }

    totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
    tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
    tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");

    if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
      ratio && _removeFromParent(tween, 1);

      if (!suppressEvents && !_reverting) {
        _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);

        tween._prom && tween._prom();
      }
    }
  } else if (!tween._zTime) {
    tween._zTime = totalTime;
  }
},
    _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
  var child;

  if (time > prevTime) {
    child = animation._first;

    while (child && child._start <= time) {
      if (child.data === "isPause" && child._start > prevTime) {
        return child;
      }

      child = child._next;
    }
  } else {
    child = animation._last;

    while (child && child._start >= time) {
      if (child.data === "isPause" && child._start < prevTime) {
        return child;
      }

      child = child._prev;
    }
  }
},
    _setDuration = function _setDuration(animation, duration, skipUncache, leavePlayhead) {
  var repeat = animation._repeat,
      dur = _roundPrecise(duration) || 0,
      totalProgress = animation._tTime / animation._tDur;
  totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
  animation._dur = dur;
  animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
  totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
  animation.parent && _setEnd(animation);
  skipUncache || _uncache(animation.parent, animation);
  return animation;
},
    _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
  return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
},
    _zeroPosition = {
  _start: 0,
  endTime: _emptyFunc,
  totalDuration: _emptyFunc
},
    _parsePosition = function _parsePosition(animation, position, percentAnimation) {
  var labels = animation.labels,
      recent = animation._recent || _zeroPosition,
      clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur,
      //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
  i,
      offset,
      isPercent;

  if (_isString(position) && (isNaN(position) || position in labels)) {
    //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
    offset = position.charAt(0);
    isPercent = position.substr(-1) === "%";
    i = position.indexOf("=");

    if (offset === "<" || offset === ">") {
      i >= 0 && (position = position.replace(/=/, ""));
      return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
    }

    if (i < 0) {
      position in labels || (labels[position] = clippedDuration);
      return labels[position];
    }

    offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));

    if (isPercent && percentAnimation) {
      offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
    }

    return i > 1 ? _parsePosition(animation, position.substr(0, i - 1), percentAnimation) + offset : clippedDuration + offset;
  }

  return position == null ? clippedDuration : +position;
},
    _createTweenType = function _createTweenType(type, params, timeline) {
  var isLegacy = _isNumber(params[1]),
      varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
      vars = params[varsIndex],
      irVars,
      parent;

  isLegacy && (vars.duration = params[1]);
  vars.parent = timeline;

  if (type) {
    irVars = vars;
    parent = timeline;

    while (parent && !("immediateRender" in irVars)) {
      // inheritance hasn't happened yet, but someone may have set a default in an ancestor timeline. We could do vars.immediateRender = _isNotFalse(_inheritDefaults(vars).immediateRender) but that'd exact a slight performance penalty because _inheritDefaults() also runs in the Tween constructor. We're paying a small kb price here to gain speed.
      irVars = parent.vars.defaults || {};
      parent = _isNotFalse(parent.vars.inherit) && parent.parent;
    }

    vars.immediateRender = _isNotFalse(irVars.immediateRender);
    type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1]; // "from" vars
  }

  return new Tween(params[0], vars, params[varsIndex + 1]);
},
    _conditionalReturn = function _conditionalReturn(value, func) {
  return value || value === 0 ? func(value) : func;
},
    _clamp = function _clamp(min, max, value) {
  return value < min ? min : value > max ? max : value;
},
    getUnit = function getUnit(value, v) {
  return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
},
    // note: protect against padded numbers as strings, like "100.100". That shouldn't return "00" as the unit. If it's numeric, return no unit.
clamp = function clamp(min, max, value) {
  return _conditionalReturn(value, function (v) {
    return _clamp(min, max, v);
  });
},
    _slice = [].slice,
    _isArrayLike = function _isArrayLike(value, nonEmpty) {
  return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
},
    _flatten = function _flatten(ar, leaveStrings, accumulator) {
  if (accumulator === void 0) {
    accumulator = [];
  }

  return ar.forEach(function (value) {
    var _accumulator;

    return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
  }) || accumulator;
},
    //takes any value and returns an array. If it's a string (and leaveStrings isn't true), it'll use document.querySelectorAll() and convert that to an array. It'll also accept iterables like jQuery objects.
toArray = function toArray(value, scope, leaveStrings) {
  return _context && !scope && _context.selector ? _context.selector(value) : _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call((scope || _doc).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
},
    selector = function selector(value) {
  value = toArray(value)[0] || _warn("Invalid scope") || {};
  return function (v) {
    var el = value.current || value.nativeElement || value;
    return toArray(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc.createElement("div") : value);
  };
},
    shuffle = function shuffle(a) {
  return a.sort(function () {
    return .5 - Math.random();
  });
},
    // alternative that's a bit faster and more reliably diverse but bigger:   for (let j, v, i = a.length; i; j = (Math.random() * i) | 0, v = a[--i], a[i] = a[j], a[j] = v); return a;
//for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
distribute = function distribute(v) {
  if (_isFunction(v)) {
    return v;
  }

  var vars = _isObject(v) ? v : {
    each: v
  },
      //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
  ease = _parseEase(vars.ease),
      from = vars.from || 0,
      base = parseFloat(vars.base) || 0,
      cache = {},
      isDecimal = from > 0 && from < 1,
      ratios = isNaN(from) || isDecimal,
      axis = vars.axis,
      ratioX = from,
      ratioY = from;

  if (_isString(from)) {
    ratioX = ratioY = {
      center: .5,
      edges: .5,
      end: 1
    }[from] || 0;
  } else if (!isDecimal && ratios) {
    ratioX = from[0];
    ratioY = from[1];
  }

  return function (i, target, a) {
    var l = (a || vars).length,
        distances = cache[l],
        originX,
        originY,
        x,
        y,
        d,
        j,
        max,
        min,
        wrapAt;

    if (!distances) {
      wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];

      if (!wrapAt) {
        max = -_bigNum;

        while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}

        wrapAt < l && wrapAt--;
      }

      distances = cache[l] = [];
      originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
      originY = wrapAt === _bigNum ? 0 : ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
      max = 0;
      min = _bigNum;

      for (j = 0; j < l; j++) {
        x = j % wrapAt - originX;
        y = originY - (j / wrapAt | 0);
        distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
        d > max && (max = d);
        d < min && (min = d);
      }

      from === "random" && shuffle(distances);
      distances.max = max - min;
      distances.min = min;
      distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
      distances.b = l < 0 ? base - l : base;
      distances.u = getUnit(vars.amount || vars.each) || 0; //unit

      ease = ease && l < 0 ? _invertEase(ease) : ease;
    }

    l = (distances[i] - distances.min) / distances.max || 0;
    return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u; //round in order to work around floating point errors
  };
},
    _roundModifier = function _roundModifier(v) {
  //pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
  var p = Math.pow(10, ((v + "").split(".")[1] || "").length); //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed())

  return function (raw) {
    var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);

    return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw)); // n - n % 1 replaces Math.floor() in order to handle negative values properly. For example, Math.floor(-150.00000000000003) is 151!
  };
},
    snap = function snap(snapTo, value) {
  var isArray = _isArray(snapTo),
      radius,
      is2D;

  if (!isArray && _isObject(snapTo)) {
    radius = isArray = snapTo.radius || _bigNum;

    if (snapTo.values) {
      snapTo = toArray(snapTo.values);

      if (is2D = !_isNumber(snapTo[0])) {
        radius *= radius; //performance optimization so we don't have to Math.sqrt() in the loop.
      }
    } else {
      snapTo = _roundModifier(snapTo.increment);
    }
  }

  return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function (raw) {
    is2D = snapTo(raw);
    return Math.abs(is2D - raw) <= radius ? is2D : raw;
  } : function (raw) {
    var x = parseFloat(is2D ? raw.x : raw),
        y = parseFloat(is2D ? raw.y : 0),
        min = _bigNum,
        closest = 0,
        i = snapTo.length,
        dx,
        dy;

    while (i--) {
      if (is2D) {
        dx = snapTo[i].x - x;
        dy = snapTo[i].y - y;
        dx = dx * dx + dy * dy;
      } else {
        dx = Math.abs(snapTo[i] - x);
      }

      if (dx < min) {
        min = dx;
        closest = i;
      }
    }

    closest = !radius || min <= radius ? snapTo[closest] : raw;
    return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
  });
},
    random = function random(min, max, roundingIncrement, returnFunction) {
  return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function () {
    return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * .99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
  });
},
    pipe = function pipe() {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }

  return function (value) {
    return functions.reduce(function (v, f) {
      return f(v);
    }, value);
  };
},
    unitize = function unitize(func, unit) {
  return function (value) {
    return func(parseFloat(value)) + (unit || getUnit(value));
  };
},
    normalize = function normalize(min, max, value) {
  return mapRange(min, max, 0, 1, value);
},
    _wrapArray = function _wrapArray(a, wrapper, value) {
  return _conditionalReturn(value, function (index) {
    return a[~~wrapper(index)];
  });
},
    wrap = function wrap(min, max, value) {
  // NOTE: wrap() CANNOT be an arrow function! A very odd compiling bug causes problems (unrelated to GSAP).
  var range = max - min;
  return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
    return (range + (value - min) % range) % range + min;
  });
},
    wrapYoyo = function wrapYoyo(min, max, value) {
  var range = max - min,
      total = range * 2;
  return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
    value = (total + (value - min) % total) % total || 0;
    return min + (value > range ? total - value : value);
  });
},
    _replaceRandom = function _replaceRandom(value) {
  //replaces all occurrences of random(...) in a string with the calculated random value. can be a range like random(-100, 100, 5) or an array like random([0, 100, 500])
  var prev = 0,
      s = "",
      i,
      nums,
      end,
      isArray;

  while (~(i = value.indexOf("random(", prev))) {
    end = value.indexOf(")", i);
    isArray = value.charAt(i + 7) === "[";
    nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
    s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
    prev = end + 1;
  }

  return s + value.substr(prev, value.length - prev);
},
    mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
  var inRange = inMax - inMin,
      outRange = outMax - outMin;
  return _conditionalReturn(value, function (value) {
    return outMin + ((value - inMin) / inRange * outRange || 0);
  });
},
    interpolate = function interpolate(start, end, progress, mutate) {
  var func = isNaN(start + end) ? 0 : function (p) {
    return (1 - p) * start + p * end;
  };

  if (!func) {
    var isString = _isString(start),
        master = {},
        p,
        i,
        interpolators,
        l,
        il;

    progress === true && (mutate = 1) && (progress = null);

    if (isString) {
      start = {
        p: start
      };
      end = {
        p: end
      };
    } else if (_isArray(start) && !_isArray(end)) {
      interpolators = [];
      l = start.length;
      il = l - 2;

      for (i = 1; i < l; i++) {
        interpolators.push(interpolate(start[i - 1], start[i])); //build the interpolators up front as a performance optimization so that when the function is called many times, it can just reuse them.
      }

      l--;

      func = function func(p) {
        p *= l;
        var i = Math.min(il, ~~p);
        return interpolators[i](p - i);
      };

      progress = end;
    } else if (!mutate) {
      start = _merge(_isArray(start) ? [] : {}, start);
    }

    if (!interpolators) {
      for (p in end) {
        _addPropTween.call(master, start, p, "get", end[p]);
      }

      func = function func(p) {
        return _renderPropTweens(p, master) || (isString ? start.p : start);
      };
    }
  }

  return _conditionalReturn(progress, func);
},
    _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
  //used for nextLabel() and previousLabel()
  var labels = timeline.labels,
      min = _bigNum,
      p,
      distance,
      label;

  for (p in labels) {
    distance = labels[p] - fromTime;

    if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
      label = p;
      min = distance;
    }
  }

  return label;
},
    _callback = function _callback(animation, type, executeLazyFirst) {
  var v = animation.vars,
      callback = v[type],
      prevContext = _context,
      context = animation._ctx,
      params,
      scope,
      result;

  if (!callback) {
    return;
  }

  params = v[type + "Params"];
  scope = v.callbackScope || animation;
  executeLazyFirst && _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.

  context && (_context = context);
  result = params ? callback.apply(scope, params) : callback.call(scope);
  _context = prevContext;
  return result;
},
    _interrupt = function _interrupt(animation) {
  _removeFromParent(animation);

  animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting);
  animation.progress() < 1 && _callback(animation, "onInterrupt");
  return animation;
},
    _quickTween,
    _registerPluginQueue = [],
    _createPlugin = function _createPlugin(config) {
  if (!config) return;
  config = !config.name && config["default"] || config; // UMD packaging wraps things oddly, so for example MotionPathHelper becomes {MotionPathHelper:MotionPathHelper, default:MotionPathHelper}.

  if (_windowExists() || config.headless) {
    // edge case: some build tools may pass in a null/undefined value
    var name = config.name,
        isFunc = _isFunction(config),
        Plugin = name && !isFunc && config.init ? function () {
      this._props = [];
    } : config,
        //in case someone passes in an object that's not a plugin, like CustomEase
    instanceDefaults = {
      init: _emptyFunc,
      render: _renderPropTweens,
      add: _addPropTween,
      kill: _killPropTweensOf,
      modifier: _addPluginModifier,
      rawVars: 0
    },
        statics = {
      targetTest: 0,
      get: 0,
      getSetter: _getSetter,
      aliases: {},
      register: 0
    };

    _wake();

    if (config !== Plugin) {
      if (_plugins[name]) {
        return;
      }

      _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics)); //static methods


      _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics))); //instance methods


      _plugins[Plugin.prop = name] = Plugin;

      if (config.targetTest) {
        _harnessPlugins.push(Plugin);

        _reservedProps[name] = 1;
      }

      name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin"; //for the global name. "motionPath" should become MotionPathPlugin
    }

    _addGlobal(name, Plugin);

    config.register && config.register(gsap, Plugin, PropTween);
  } else {
    _registerPluginQueue.push(config);
  }
},

/*
 * --------------------------------------------------------------------------------------
 * COLORS
 * --------------------------------------------------------------------------------------
 */
_255 = 255,
    _colorLookup = {
  aqua: [0, _255, _255],
  lime: [0, _255, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, _255],
  navy: [0, 0, 128],
  white: [_255, _255, _255],
  olive: [128, 128, 0],
  yellow: [_255, _255, 0],
  orange: [_255, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [_255, 0, 0],
  pink: [_255, 192, 203],
  cyan: [0, _255, _255],
  transparent: [_255, _255, _255, 0]
},
    // possible future idea to replace the hard-coded color name values - put this in the ticker.wake() where we set the _doc:
// let ctx = _doc.createElement("canvas").getContext("2d");
// _forEachName("aqua,lime,silver,black,maroon,teal,blue,navy,white,olive,yellow,orange,gray,purple,green,red,pink,cyan", color => {ctx.fillStyle = color; _colorLookup[color] = splitColor(ctx.fillStyle)});
_hue = function _hue(h, m1, m2) {
  h += h < 0 ? 1 : h > 1 ? -1 : 0;
  return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
},
    splitColor = function splitColor(v, toHSL, forceAlpha) {
  var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
      r,
      g,
      b,
      h,
      s,
      l,
      max,
      min,
      d,
      wasHSL;

  if (!a) {
    if (v.substr(-1) === ",") {
      //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
      v = v.substr(0, v.length - 1);
    }

    if (_colorLookup[v]) {
      a = _colorLookup[v];
    } else if (v.charAt(0) === "#") {
      if (v.length < 6) {
        //for shorthand like #9F0 or #9F0F (could have alpha)
        r = v.charAt(1);
        g = v.charAt(2);
        b = v.charAt(3);
        v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
      }

      if (v.length === 9) {
        // hex with alpha, like #fd5e53ff
        a = parseInt(v.substr(1, 6), 16);
        return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
      }

      v = parseInt(v.substr(1), 16);
      a = [v >> 16, v >> 8 & _255, v & _255];
    } else if (v.substr(0, 3) === "hsl") {
      a = wasHSL = v.match(_strictNumExp);

      if (!toHSL) {
        h = +a[0] % 360 / 360;
        s = +a[1] / 100;
        l = +a[2] / 100;
        g = l <= .5 ? l * (s + 1) : l + s - l * s;
        r = l * 2 - g;
        a.length > 3 && (a[3] *= 1); //cast as number

        a[0] = _hue(h + 1 / 3, r, g);
        a[1] = _hue(h, r, g);
        a[2] = _hue(h - 1 / 3, r, g);
      } else if (~v.indexOf("=")) {
        //if relative values are found, just return the raw strings with the relative prefixes in place.
        a = v.match(_numExp);
        forceAlpha && a.length < 4 && (a[3] = 1);
        return a;
      }
    } else {
      a = v.match(_strictNumExp) || _colorLookup.transparent;
    }

    a = a.map(Number);
  }

  if (toHSL && !wasHSL) {
    r = a[0] / _255;
    g = a[1] / _255;
    b = a[2] / _255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }

    a[0] = ~~(h + .5);
    a[1] = ~~(s * 100 + .5);
    a[2] = ~~(l * 100 + .5);
  }

  forceAlpha && a.length < 4 && (a[3] = 1);
  return a;
},
    _colorOrderData = function _colorOrderData(v) {
  // strips out the colors from the string, finds all the numeric slots (with units) and returns an array of those. The Array also has a "c" property which is an Array of the index values where the colors belong. This is to help work around issues where there's a mis-matched order of color/numeric data like drop-shadow(#f00 0px 1px 2px) and drop-shadow(0x 1px 2px #f00). This is basically a helper function used in _formatColors()
  var values = [],
      c = [],
      i = -1;
  v.split(_colorExp).forEach(function (v) {
    var a = v.match(_numWithUnitExp) || [];
    values.push.apply(values, a);
    c.push(i += a.length + 1);
  });
  values.c = c;
  return values;
},
    _formatColors = function _formatColors(s, toHSL, orderMatchData) {
  var result = "",
      colors = (s + result).match(_colorExp),
      type = toHSL ? "hsla(" : "rgba(",
      i = 0,
      c,
      shell,
      d,
      l;

  if (!colors) {
    return s;
  }

  colors = colors.map(function (color) {
    return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
  });

  if (orderMatchData) {
    d = _colorOrderData(s);
    c = orderMatchData.c;

    if (c.join(result) !== d.c.join(result)) {
      shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
      l = shell.length - 1;

      for (; i < l; i++) {
        result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
      }
    }
  }

  if (!shell) {
    shell = s.split(_colorExp);
    l = shell.length - 1;

    for (; i < l; i++) {
      result += shell[i] + colors[i];
    }
  }

  return result + shell[l];
},
    _colorExp = function () {
  var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
      //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.,
  p;

  for (p in _colorLookup) {
    s += "|" + p + "\\b";
  }

  return new RegExp(s + ")", "gi");
}(),
    _hslExp = /hsl[a]?\(/,
    _colorStringFilter = function _colorStringFilter(a) {
  var combined = a.join(" "),
      toHSL;
  _colorExp.lastIndex = 0;

  if (_colorExp.test(combined)) {
    toHSL = _hslExp.test(combined);
    a[1] = _formatColors(a[1], toHSL);
    a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1])); // make sure the order of numbers/colors match with the END value.

    return true;
  }
},

/*
 * --------------------------------------------------------------------------------------
 * TICKER
 * --------------------------------------------------------------------------------------
 */
_tickerActive,
    _ticker = function () {
  var _getTime = Date.now,
      _lagThreshold = 500,
      _adjustedLag = 33,
      _startTime = _getTime(),
      _lastUpdate = _startTime,
      _gap = 1000 / 240,
      _nextTime = _gap,
      _listeners = [],
      _id,
      _req,
      _raf,
      _self,
      _delta,
      _i,
      _tick = function _tick(v) {
    var elapsed = _getTime() - _lastUpdate,
        manual = v === true,
        overlap,
        dispatch,
        time,
        frame;

    (elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
    _lastUpdate += elapsed;
    time = _lastUpdate - _startTime;
    overlap = time - _nextTime;

    if (overlap > 0 || manual) {
      frame = ++_self.frame;
      _delta = time - _self.time * 1000;
      _self.time = time = time / 1000;
      _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
      dispatch = 1;
    }

    manual || (_id = _req(_tick)); //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.

    if (dispatch) {
      for (_i = 0; _i < _listeners.length; _i++) {
        // use _i and check _listeners.length instead of a variable because a listener could get removed during the loop, and if that happens to an element less than the current index, it'd throw things off in the loop.
        _listeners[_i](time, _delta, frame, v);
      }
    }
  };

  _self = {
    time: 0,
    frame: 0,
    tick: function tick() {
      _tick(true);
    },
    deltaRatio: function deltaRatio(fps) {
      return _delta / (1000 / (fps || 60));
    },
    wake: function wake() {
      if (_coreReady) {
        if (!_coreInitted && _windowExists()) {
          _win = _coreInitted = window;
          _doc = _win.document || {};
          _globals.gsap = gsap;
          (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);

          _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});

          _registerPluginQueue.forEach(_createPlugin);
        }

        _raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
        _id && _self.sleep();

        _req = _raf || function (f) {
          return setTimeout(f, _nextTime - _self.time * 1000 + 1 | 0);
        };

        _tickerActive = 1;

        _tick(2);
      }
    },
    sleep: function sleep() {
      (_raf ? cancelAnimationFrame : clearTimeout)(_id);
      _tickerActive = 0;
      _req = _emptyFunc;
    },
    lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
      _lagThreshold = threshold || Infinity; // zero should be interpreted as basically unlimited

      _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
    },
    fps: function fps(_fps) {
      _gap = 1000 / (_fps || 240);
      _nextTime = _self.time * 1000 + _gap;
    },
    add: function add(callback, once, prioritize) {
      var func = once ? function (t, d, f, v) {
        callback(t, d, f, v);

        _self.remove(func);
      } : callback;

      _self.remove(callback);

      _listeners[prioritize ? "unshift" : "push"](func);

      _wake();

      return func;
    },
    remove: function remove(callback, i) {
      ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1) && _i >= i && _i--;
    },
    _listeners: _listeners
  };
  return _self;
}(),
    _wake = function _wake() {
  return !_tickerActive && _ticker.wake();
},
    //also ensures the core classes are initialized.

/*
* -------------------------------------------------
* EASING
* -------------------------------------------------
*/
_easeMap = {},
    _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
    _quotesExp = /["']/g,
    _parseObjectInString = function _parseObjectInString(value) {
  //takes a string like "{wiggles:10, type:anticipate})" and turns it into a real object. Notice it ends in ")" and includes the {} wrappers. This is because we only use this function for parsing ease configs and prioritized optimization rather than reusability.
  var obj = {},
      split = value.substr(1, value.length - 3).split(":"),
      key = split[0],
      i = 1,
      l = split.length,
      index,
      val,
      parsedVal;

  for (; i < l; i++) {
    val = split[i];
    index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
    parsedVal = val.substr(0, index);
    obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
    key = val.substr(index + 1).trim();
  }

  return obj;
},
    _valueInParentheses = function _valueInParentheses(value) {
  var open = value.indexOf("(") + 1,
      close = value.indexOf(")"),
      nested = value.indexOf("(", open);
  return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
},
    _configEaseFromString = function _configEaseFromString(name) {
  //name can be a string like "elastic.out(1,0.5)", and pass in _easeMap as obj and it'll parse it out and call the actual function like _easeMap.Elastic.easeOut.config(1,0.5). It will also parse custom ease strings as long as CustomEase is loaded and registered (internally as _easeMap._CE).
  var split = (name + "").split("("),
      ease = _easeMap[split[0]];
  return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
},
    _invertEase = function _invertEase(ease) {
  return function (p) {
    return 1 - ease(1 - p);
  };
},
    // allow yoyoEase to be set in children and have those affected when the parent/ancestor timeline yoyos.
_propagateYoyoEase = function _propagateYoyoEase(timeline, isYoyo) {
  var child = timeline._first,
      ease;

  while (child) {
    if (child instanceof Timeline) {
      _propagateYoyoEase(child, isYoyo);
    } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
      if (child.timeline) {
        _propagateYoyoEase(child.timeline, isYoyo);
      } else {
        ease = child._ease;
        child._ease = child._yEase;
        child._yEase = ease;
        child._yoyo = isYoyo;
      }
    }

    child = child._next;
  }
},
    _parseEase = function _parseEase(ease, defaultEase) {
  return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
},
    _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
  if (easeOut === void 0) {
    easeOut = function easeOut(p) {
      return 1 - easeIn(1 - p);
    };
  }

  if (easeInOut === void 0) {
    easeInOut = function easeInOut(p) {
      return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
    };
  }

  var ease = {
    easeIn: easeIn,
    easeOut: easeOut,
    easeInOut: easeInOut
  },
      lowercaseName;

  _forEachName(names, function (name) {
    _easeMap[name] = _globals[name] = ease;
    _easeMap[lowercaseName = name.toLowerCase()] = easeOut;

    for (var p in ease) {
      _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
    }
  });

  return ease;
},
    _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
  return function (p) {
    return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
  };
},
    _configElastic = function _configElastic(type, amplitude, period) {
  var p1 = amplitude >= 1 ? amplitude : 1,
      //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
  p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
      p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
      easeOut = function easeOut(p) {
    return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  p2 = _2PI / p2; //precalculate to optimize

  ease.config = function (amplitude, period) {
    return _configElastic(type, amplitude, period);
  };

  return ease;
},
    _configBack = function _configBack(type, overshoot) {
  if (overshoot === void 0) {
    overshoot = 1.70158;
  }

  var easeOut = function easeOut(p) {
    return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  ease.config = function (overshoot) {
    return _configBack(type, overshoot);
  };

  return ease;
}; // a cheaper (kb and cpu) but more mild way to get a parameterized weighted ease by feeding in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEase = ratio => {
// 	let y = 0.5 + ratio / 2;
// 	return p => (2 * (1 - p) * p * y + p * p);
// },
// a stronger (but more expensive kb/cpu) parameterized weighted ease that lets you feed in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEaseStrong = ratio => {
// 	ratio = .5 + ratio / 2;
// 	let o = 1 / 3 * (ratio < .5 ? ratio : 1 - ratio),
// 		b = ratio - o,
// 		c = ratio + o;
// 	return p => p === 1 ? p : 3 * b * (1 - p) * (1 - p) * p + 3 * c * (1 - p) * p * p + p * p * p;
// };


_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
  var power = i < 5 ? i + 1 : i;

  _insertEase(name + ",Power" + (power - 1), i ? function (p) {
    return Math.pow(p, power);
  } : function (p) {
    return p;
  }, function (p) {
    return 1 - Math.pow(1 - p, power);
  }, function (p) {
    return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
  });
});

_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;

_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());

(function (n, c) {
  var n1 = 1 / c,
      n2 = 2 * n1,
      n3 = 2.5 * n1,
      easeOut = function easeOut(p) {
    return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
  };

  _insertEase("Bounce", function (p) {
    return 1 - easeOut(1 - p);
  }, easeOut);
})(7.5625, 2.75);

_insertEase("Expo", function (p) {
  return Math.pow(2, 10 * (p - 1)) * p + p * p * p * p * p * p * (1 - p);
}); // previously 2 ** (10 * (p - 1)) but that doesn't end up with the value quite at the right spot so we do a blended ease to ensure it lands where it should perfectly.


_insertEase("Circ", function (p) {
  return -(_sqrt(1 - p * p) - 1);
});

_insertEase("Sine", function (p) {
  return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
});

_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());

_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
  config: function config(steps, immediateStart) {
    if (steps === void 0) {
      steps = 1;
    }

    var p1 = 1 / steps,
        p2 = steps + (immediateStart ? 0 : 1),
        p3 = immediateStart ? 1 : 0,
        max = 1 - _tinyNum;
    return function (p) {
      return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
    };
  }
};
_defaults.ease = _easeMap["quad.out"];

_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
  return _callbackNames += name + "," + name + "Params,";
});
/*
 * --------------------------------------------------------------------------------------
 * CACHE
 * --------------------------------------------------------------------------------------
 */


var GSCache = function GSCache(target, harness) {
  this.id = _gsID++;
  target._gsap = this;
  this.target = target;
  this.harness = harness;
  this.get = harness ? harness.get : _getProperty;
  this.set = harness ? harness.getSetter : _getSetter;
};
/*
 * --------------------------------------------------------------------------------------
 * ANIMATION
 * --------------------------------------------------------------------------------------
 */

var Animation = /*#__PURE__*/function () {
  function Animation(vars) {
    this.vars = vars;
    this._delay = +vars.delay || 0;

    if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
      // TODO: repeat: Infinity on a timeline's children must flag that timeline internally and affect its totalDuration, otherwise it'll stop in the negative direction when reaching the start.
      this._rDelay = vars.repeatDelay || 0;
      this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
    }

    this._ts = 1;

    _setDuration(this, +vars.duration, 1, 1);

    this.data = vars.data;

    if (_context) {
      this._ctx = _context;

      _context.data.push(this);
    }

    _tickerActive || _ticker.wake();
  }

  var _proto = Animation.prototype;

  _proto.delay = function delay(value) {
    if (value || value === 0) {
      this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
      this._delay = value;
      return this;
    }

    return this._delay;
  };

  _proto.duration = function duration(value) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
  };

  _proto.totalDuration = function totalDuration(value) {
    if (!arguments.length) {
      return this._tDur;
    }

    this._dirty = 0;
    return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
  };

  _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
    _wake();

    if (!arguments.length) {
      return this._tTime;
    }

    var parent = this._dp;

    if (parent && parent.smoothChildTiming && this._ts) {
      _alignPlayhead(this, _totalTime);

      !parent._dp || parent.parent || _postAddChecks(parent, this); // edge case: if this is a child of a timeline that already completed, for example, we must re-activate the parent.
      //in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The start of that child would get pushed out, but one of the ancestors may have completed.

      while (parent && parent.parent) {
        if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
          parent.totalTime(parent._tTime, true);
        }

        parent = parent.parent;
      }

      if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
        //if the animation doesn't have a parent, put it back into its last parent (recorded as _dp for exactly cases like this). Limit to parents with autoRemoveChildren (like globalTimeline) so that if the user manually removes an animation from a timeline and then alters its playhead, it doesn't get added back in.
        _addToTimeline(this._dp, this, this._start - this._delay);
      }
    }

    if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
      // check for _ptLookup on a Tween instance to ensure it has actually finished being instantiated, otherwise if this.reverse() gets called in the Animation constructor, it could trigger a render() here even though the _targets weren't populated, thus when _init() is called there won't be any PropTweens (it'll act like the tween is non-functional)
      this._ts || (this._pTime = _totalTime); // otherwise, if an animation is paused, then the playhead is moved back to zero, then resumed, it'd revert back to the original time at the pause
      //if (!this._lock) { // avoid endless recursion (not sure we need this yet or if it's worth the performance hit)
      //   this._lock = 1;

      _lazySafeRender(this, _totalTime, suppressEvents); //   this._lock = 0;
      //}

    }

    return this;
  };

  _proto.time = function time(value, suppressEvents) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time; // note: if the modulus results in 0, the playhead could be exactly at the end or the beginning, and we always defer to the END with a non-zero value, otherwise if you set the time() to the very end (duration()), it would render at the START!
  };

  _proto.totalProgress = function totalProgress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
  };

  _proto.progress = function progress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  };

  _proto.iteration = function iteration(value, suppressEvents) {
    var cycleDuration = this.duration() + this._rDelay;

    return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
  } // potential future addition:
  // isPlayingBackwards() {
  // 	let animation = this,
  // 		orientation = 1; // 1 = forward, -1 = backward
  // 	while (animation) {
  // 		orientation *= animation.reversed() || (animation.repeat() && !(animation.iteration() & 1)) ? -1 : 1;
  // 		animation = animation.parent;
  // 	}
  // 	return orientation < 0;
  // }
  ;

  _proto.timeScale = function timeScale(value, suppressEvents) {
    if (!arguments.length) {
      return this._rts === -_tinyNum ? 0 : this._rts; // recorded timeScale. Special case: if someone calls reverse() on an animation with timeScale of 0, we assign it -_tinyNum to remember it's reversed.
    }

    if (this._rts === value) {
      return this;
    }

    var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime; // make sure to do the parentToChildTotalTime() BEFORE setting the new _ts because the old one must be used in that calculation.
    // future addition? Up side: fast and minimal file size. Down side: only works on this animation; if a timeline is reversed, for example, its childrens' onReverse wouldn't get called.
    //(+value < 0 && this._rts >= 0) && _callback(this, "onReverse", true);
    // prioritize rendering where the parent's playhead lines up instead of this._tTime because there could be a tween that's animating another tween's timeScale in the same rendering loop (same parent), thus if the timeScale tween renders first, it would alter _start BEFORE _tTime was set on that tick (in the rendering loop), effectively freezing it until the timeScale tween finishes.

    this._rts = +value || 0;
    this._ts = this._ps || value === -_tinyNum ? 0 : this._rts; // _ts is the functional timeScale which would be 0 if the animation is paused.

    this.totalTime(_clamp(-Math.abs(this._delay), this.totalDuration(), tTime), suppressEvents !== false);

    _setEnd(this); // if parent.smoothChildTiming was false, the end time didn't get updated in the _alignPlayhead() method, so do it here.


    return _recacheAncestors(this);
  };

  _proto.paused = function paused(value) {
    if (!arguments.length) {
      return this._ps;
    } // possible future addition - if an animation is removed from its parent and then .restart() or .play() or .resume() is called, perhaps we should force it back into the globalTimeline but be careful because what if it's already at its end? We don't want it to just persist forever and not get released for GC.
    // !this.parent && !value && this._tTime < this._tDur && this !== _globalTimeline && _globalTimeline.add(this);


    if (this._ps !== value) {
      this._ps = value;

      if (value) {
        this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()); // if the pause occurs during the delay phase, make sure that's factored in when resuming.

        this._ts = this._act = 0; // _ts is the functional timeScale, so a paused tween would effectively have a timeScale of 0. We record the "real" timeScale as _rts (recorded time scale)
      } else {
        _wake();

        this._ts = this._rts; //only defer to _pTime (pauseTime) if tTime is zero. Remember, someone could pause() an animation, then scrub the playhead and resume(). If the parent doesn't have smoothChildTiming, we render at the rawTime() because the startTime won't get updated.

        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum)); // edge case: animation.progress(1).pause().play() wouldn't render again because the playhead is already at the end, but the call to totalTime() below will add it back to its parent...and not remove it again (since removing only happens upon rendering at a new time). Offsetting the _tTime slightly is done simply to cause the final render in totalTime() that'll pop it off its timeline (if autoRemoveChildren is true, of course). Check to make sure _zTime isn't -_tinyNum to avoid an edge case where the playhead is pushed to the end but INSIDE a tween/callback, the timeline itself is paused thus halting rendering and leaving a few unrendered. When resuming, it wouldn't render those otherwise.
      }
    }

    return this;
  };

  _proto.startTime = function startTime(value) {
    if (arguments.length) {
      this._start = value;
      var parent = this.parent || this._dp;
      parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
      return this;
    }

    return this._start;
  };

  _proto.endTime = function endTime(includeRepeats) {
    return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  };

  _proto.rawTime = function rawTime(wrapRepeats) {
    var parent = this.parent || this._dp; // _dp = detached parent

    return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
  };

  _proto.revert = function revert(config) {
    if (config === void 0) {
      config = _revertConfig;
    }

    var prevIsReverting = _reverting;
    _reverting = config;

    if (_isRevertWorthy(this)) {
      this.timeline && this.timeline.revert(config);
      this.totalTime(-0.01, config.suppressEvents);
    }

    this.data !== "nested" && config.kill !== false && this.kill();
    _reverting = prevIsReverting;
    return this;
  };

  _proto.globalTime = function globalTime(rawTime) {
    var animation = this,
        time = arguments.length ? rawTime : animation.rawTime();

    while (animation) {
      time = animation._start + time / (Math.abs(animation._ts) || 1);
      animation = animation._dp;
    }

    return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time; // the _startAt tweens for .fromTo() and .from() that have immediateRender should always be FIRST in the timeline (important for context.revert()). "_sat" stands for _startAtTween, referring to the parent tween that created the _startAt. We must discern if that tween had immediateRender so that we can know whether or not to prioritize it in revert().
  };

  _proto.repeat = function repeat(value) {
    if (arguments.length) {
      this._repeat = value === Infinity ? -2 : value;
      return _onUpdateTotalDuration(this);
    }

    return this._repeat === -2 ? Infinity : this._repeat;
  };

  _proto.repeatDelay = function repeatDelay(value) {
    if (arguments.length) {
      var time = this._time;
      this._rDelay = value;

      _onUpdateTotalDuration(this);

      return time ? this.time(time) : this;
    }

    return this._rDelay;
  };

  _proto.yoyo = function yoyo(value) {
    if (arguments.length) {
      this._yoyo = value;
      return this;
    }

    return this._yoyo;
  };

  _proto.seek = function seek(position, suppressEvents) {
    return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
  };

  _proto.restart = function restart(includeDelay, suppressEvents) {
    this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
    this._dur || (this._zTime = -_tinyNum); // ensures onComplete fires on a zero-duration animation that gets restarted.

    return this;
  };

  _proto.play = function play(from, suppressEvents) {
    from != null && this.seek(from, suppressEvents);
    return this.reversed(false).paused(false);
  };

  _proto.reverse = function reverse(from, suppressEvents) {
    from != null && this.seek(from || this.totalDuration(), suppressEvents);
    return this.reversed(true).paused(false);
  };

  _proto.pause = function pause(atTime, suppressEvents) {
    atTime != null && this.seek(atTime, suppressEvents);
    return this.paused(true);
  };

  _proto.resume = function resume() {
    return this.paused(false);
  };

  _proto.reversed = function reversed(value) {
    if (arguments.length) {
      !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0)); // in case timeScale is zero, reversing would have no effect so we use _tinyNum.

      return this;
    }

    return this._rts < 0;
  };

  _proto.invalidate = function invalidate() {
    this._initted = this._act = 0;
    this._zTime = -_tinyNum;
    return this;
  };

  _proto.isActive = function isActive() {
    var parent = this.parent || this._dp,
        start = this._start,
        rawTime;
    return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
  };

  _proto.eventCallback = function eventCallback(type, callback, params) {
    var vars = this.vars;

    if (arguments.length > 1) {
      if (!callback) {
        delete vars[type];
      } else {
        vars[type] = callback;
        params && (vars[type + "Params"] = params);
        type === "onUpdate" && (this._onUpdate = callback);
      }

      return this;
    }

    return vars[type];
  };

  _proto.then = function then(onFulfilled) {
    var self = this;
    return new Promise(function (resolve) {
      var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
          _resolve = function _resolve() {
        var _then = self.then;
        self.then = null; // temporarily null the then() method to avoid an infinite loop (see https://github.com/greensock/GSAP/issues/322)

        _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
        resolve(f);
        self.then = _then;
      };

      if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
        _resolve();
      } else {
        self._prom = _resolve;
      }
    });
  };

  _proto.kill = function kill() {
    _interrupt(this);
  };

  return Animation;
}();

_setDefaults(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: false,
  parent: null,
  _initted: false,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _ps: false,
  _rts: 1
});
/*
 * -------------------------------------------------
 * TIMELINE
 * -------------------------------------------------
 */


var Timeline = /*#__PURE__*/function (_Animation) {
  _inheritsLoose(Timeline, _Animation);

  function Timeline(vars, position) {
    var _this;

    if (vars === void 0) {
      vars = {};
    }

    _this = _Animation.call(this, vars) || this;
    _this.labels = {};
    _this.smoothChildTiming = !!vars.smoothChildTiming;
    _this.autoRemoveChildren = !!vars.autoRemoveChildren;
    _this._sort = _isNotFalse(vars.sortChildren);
    _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
    vars.reversed && _this.reverse();
    vars.paused && _this.paused(true);
    vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
    return _this;
  }

  var _proto2 = Timeline.prototype;

  _proto2.to = function to(targets, vars, position) {
    _createTweenType(0, arguments, this);

    return this;
  };

  _proto2.from = function from(targets, vars, position) {
    _createTweenType(1, arguments, this);

    return this;
  };

  _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
    _createTweenType(2, arguments, this);

    return this;
  };

  _proto2.set = function set(targets, vars, position) {
    vars.duration = 0;
    vars.parent = this;
    _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
    vars.immediateRender = !!vars.immediateRender;
    new Tween(targets, vars, _parsePosition(this, position), 1);
    return this;
  };

  _proto2.call = function call(callback, params, position) {
    return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
  } //ONLY for backward compatibility! Maybe delete?
  ;

  _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.duration = duration;
    vars.stagger = vars.stagger || stagger;
    vars.onComplete = onCompleteAll;
    vars.onCompleteParams = onCompleteAllParams;
    vars.parent = this;
    new Tween(targets, vars, _parsePosition(this, position));
    return this;
  };

  _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.runBackwards = 1;
    _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
    return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
    toVars.startAt = fromVars;
    _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
    return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._dirty ? this.totalDuration() : this._tDur,
        dur = this._dur,
        tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime),
        // if a paused timeline is resumed (or its _start is updated for another reason...which rounds it), that could result in the playhead shifting a **tiny** amount and a zero-duration child at that spot may get rendered at a different ratio, like its totalTime in render() may be 1e-17 instead of 0, for example.
    crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
        time,
        child,
        next,
        iteration,
        cycleDuration,
        prevPaused,
        pauseTween,
        timeScale,
        prevStart,
        prevIteration,
        yoyo,
        isYoyo;
    this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);

    if (tTime !== this._tTime || force || crossingStart) {
      if (prevTime !== this._time && dur) {
        //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
        tTime += this._time - prevTime;
        totalTime += this._time - prevTime;
      }

      time = tTime;
      prevStart = this._start;
      timeScale = this._ts;
      prevPaused = !timeScale;

      if (crossingStart) {
        dur || (prevTime = this._zTime); //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

        (totalTime || !suppressEvents) && (this._zTime = totalTime);
      }

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        yoyo = this._yoyo;
        cycleDuration = dur + this._rDelay;

        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }

        time = _roundPrecise(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (tTime === tDur) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          iteration = this._repeat;
          time = dur;
        } else {
          prevIteration = _roundPrecise(tTime / cycleDuration); // full decimal version of iterations, not the previous iteration (we're reusing prevIteration variable for efficiency)

          iteration = ~~prevIteration;

          if (iteration && iteration === prevIteration) {
            time = dur;
            iteration--;
          }

          time > dur && (time = dur);
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);
        !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration); // edge case - if someone does addPause() at the very beginning of a repeating timeline, that pause is technically at the same spot as the end which causes this._time to get set to 0 when the totalTime would normally place the playhead at the end. See https://gsap.com/forums/topic/23823-closing-nav-animation-not-working-on-ie-and-iphone-6-maybe-other-older-browser/?tab=comments#comment-113005 also, this._tTime - prevIteration * cycleDuration - this._dur <= 0 just checks to make sure it wasn't previously in the "repeatDelay" portion

        if (yoyo && iteration & 1) {
          time = dur - time;
          isYoyo = 1;
        }
        /*
        make sure children at the end/beginning of the timeline are rendered properly. If, for example,
        a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
        would get translated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
        could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
        we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
        ensure that zero-duration tweens at the very beginning or end of the Timeline work.
        */


        if (iteration !== prevIteration && !this._lock) {
          var rewinding = yoyo && prevIteration & 1,
              doesWrap = rewinding === (yoyo && iteration & 1);
          iteration < prevIteration && (rewinding = !rewinding);
          prevTime = rewinding ? 0 : tTime % dur ? dur : tTime; // if the playhead is landing exactly at the end of an iteration, use that totalTime rather than only the duration, otherwise it'll skip the 2nd render since it's effectively at the same time.

          this._lock = 1;
          this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
          this._tTime = tTime; // if a user gets the iteration() inside the onRepeat, for example, it should be accurate.

          !suppressEvents && this.parent && _callback(this, "onRepeat");
          this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);

          if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
            // if prevTime is 0 and we render at the very end, _time will be the end, thus won't match. So in this edge case, prevTime won't match _time but that's okay. If it gets killed in the onRepeat, eject as well.
            return this;
          }

          dur = this._dur; // in case the duration changed in the onRepeat

          tDur = this._tDur;

          if (doesWrap) {
            this._lock = 2;
            prevTime = rewinding ? dur : -0.0001;
            this.render(prevTime, true);
            this.vars.repeatRefresh && !isYoyo && this.invalidate();
          }

          this._lock = 0;

          if (!this._ts && !prevPaused) {
            return this;
          } //in order for yoyoEase to work properly when there's a stagger, we must swap out the ease in each sub-tween.


          _propagateYoyoEase(this, isYoyo);
        }
      }

      if (this._hasPause && !this._forcing && this._lock < 2) {
        pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));

        if (pauseTween) {
          tTime -= time - (time = pauseTween._start);
        }
      }

      this._tTime = tTime;
      this._time = time;
      this._act = !timeScale; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

      if (!this._initted) {
        this._onUpdate = this.vars.onUpdate;
        this._initted = 1;
        this._zTime = totalTime;
        prevTime = 0; // upon init, the playhead should always go forward; someone could invalidate() a completed timeline and then if they restart(), that would make child tweens render in reverse order which could lock in the wrong starting values if they build on each other, like tl.to(obj, {x: 100}).to(obj, {x: 0}).
      }

      if (!prevTime && tTime && !suppressEvents && !prevIteration) {
        _callback(this, "onStart");

        if (this._tTime !== tTime) {
          // in case the onStart triggered a render at a different spot, eject. Like if someone did animation.pause(0.5) or something inside the onStart.
          return this;
        }
      }

      if (time >= prevTime && totalTime >= 0) {
        child = this._first;

        while (child) {
          next = child._next;

          if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = -_tinyNum); // it didn't finish rendering, so flag zTime as negative so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      } else {
        child = this._last;
        var adjustedTime = totalTime < 0 ? totalTime : time; //when the playhead goes backward beyond the start of this timeline, we must pass that information down to the child animations so that zero-duration tweens know whether to render their starting or ending values.

        while (child) {
          next = child._prev;

          if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting && _isRevertWorthy(child)); // if reverting, we should always force renders of initted tweens (but remember that .fromTo() or .from() may have a _startAt but not _initted yet). If, for example, a .fromTo() tween with a stagger (which creates an internal timeline) gets reverted BEFORE some of its child tweens render for the first time, it may not properly trigger them to revert.

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum); // it didn't finish rendering, so adjust zTime so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      }

      if (pauseTween && !suppressEvents) {
        this.pause();
        pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;

        if (this._ts) {
          //the callback resumed playback! So since we may have held back the playhead due to where the pause is positioned, go ahead and jump to where it's SUPPOSED to be (if no pause happened).
          this._start = prevStart; //if the pause was at an earlier time and the user resumed in the callback, it could reposition the timeline (changing its startTime), throwing things off slightly, so we make sure the _start doesn't shift.

          _setEnd(this);

          return this.render(totalTime, suppressEvents, force);
        }
      }

      this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
      if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
        // remember, a child's callback may alter this timeline's playhead or timeScale which is why we need to add some of these checks.
        (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
          _callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);

          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }

    return this;
  };

  _proto2.add = function add(child, position) {
    var _this2 = this;

    _isNumber(position) || (position = _parsePosition(this, position, child));

    if (!(child instanceof Animation)) {
      if (_isArray(child)) {
        child.forEach(function (obj) {
          return _this2.add(obj, position);
        });
        return this;
      }

      if (_isString(child)) {
        return this.addLabel(child, position);
      }

      if (_isFunction(child)) {
        child = Tween.delayedCall(0, child);
      } else {
        return this;
      }
    }

    return this !== child ? _addToTimeline(this, child, position) : this; //don't allow a timeline to be added to itself as a child!
  };

  _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
    if (nested === void 0) {
      nested = true;
    }

    if (tweens === void 0) {
      tweens = true;
    }

    if (timelines === void 0) {
      timelines = true;
    }

    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = -_bigNum;
    }

    var a = [],
        child = this._first;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        if (child instanceof Tween) {
          tweens && a.push(child);
        } else {
          timelines && a.push(child);
          nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
        }
      }

      child = child._next;
    }

    return a;
  };

  _proto2.getById = function getById(id) {
    var animations = this.getChildren(1, 1, 1),
        i = animations.length;

    while (i--) {
      if (animations[i].vars.id === id) {
        return animations[i];
      }
    }
  };

  _proto2.remove = function remove(child) {
    if (_isString(child)) {
      return this.removeLabel(child);
    }

    if (_isFunction(child)) {
      return this.killTweensOf(child);
    }

    child.parent === this && _removeLinkedListItem(this, child);

    if (child === this._recent) {
      this._recent = this._last;
    }

    return _uncache(this);
  };

  _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
    if (!arguments.length) {
      return this._tTime;
    }

    this._forcing = 1;

    if (!this._dp && this._ts) {
      //special case for the global timeline (or any other that has no parent or detached parent).
      this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
    }

    _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);

    this._forcing = 0;
    return this;
  };

  _proto2.addLabel = function addLabel(label, position) {
    this.labels[label] = _parsePosition(this, position);
    return this;
  };

  _proto2.removeLabel = function removeLabel(label) {
    delete this.labels[label];
    return this;
  };

  _proto2.addPause = function addPause(position, callback, params) {
    var t = Tween.delayedCall(0, callback || _emptyFunc, params);
    t.data = "isPause";
    this._hasPause = 1;
    return _addToTimeline(this, t, _parsePosition(this, position));
  };

  _proto2.removePause = function removePause(position) {
    var child = this._first;
    position = _parsePosition(this, position);

    while (child) {
      if (child._start === position && child.data === "isPause") {
        _removeFromParent(child);
      }

      child = child._next;
    }
  };

  _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    var tweens = this.getTweensOf(targets, onlyActive),
        i = tweens.length;

    while (i--) {
      _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
    }

    return this;
  };

  _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
    var a = [],
        parsedTargets = toArray(targets),
        child = this._first,
        isGlobalTime = _isNumber(onlyActive),
        // a number is interpreted as a global time. If the animation spans
    children;

    while (child) {
      if (child instanceof Tween) {
        if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
          // note: if this is for overwriting, it should only be for tweens that aren't paused and are initted.
          a.push(child);
        }
      } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
        a.push.apply(a, children);
      }

      child = child._next;
    }

    return a;
  } // potential future feature - targets() on timelines
  // targets() {
  // 	let result = [];
  // 	this.getChildren(true, true, false).forEach(t => result.push(...t.targets()));
  // 	return result.filter((v, i) => result.indexOf(v) === i);
  // }
  ;

  _proto2.tweenTo = function tweenTo(position, vars) {
    vars = vars || {};

    var tl = this,
        endTime = _parsePosition(tl, position),
        _vars = vars,
        startAt = _vars.startAt,
        _onStart = _vars.onStart,
        onStartParams = _vars.onStartParams,
        immediateRender = _vars.immediateRender,
        initted,
        tween = Tween.to(tl, _setDefaults({
      ease: vars.ease || "none",
      lazy: false,
      immediateRender: false,
      time: endTime,
      overwrite: "auto",
      duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
      onStart: function onStart() {
        tl.pause();

        if (!initted) {
          var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
          tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
          initted = 1;
        }

        _onStart && _onStart.apply(tween, onStartParams || []); //in case the user had an onStart in the vars - we don't want to overwrite it.
      }
    }, vars));

    return immediateRender ? tween.render(0) : tween;
  };

  _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
    return this.tweenTo(toPosition, _setDefaults({
      startAt: {
        time: _parsePosition(this, fromPosition)
      }
    }, vars));
  };

  _proto2.recent = function recent() {
    return this._recent;
  };

  _proto2.nextLabel = function nextLabel(afterTime) {
    if (afterTime === void 0) {
      afterTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, afterTime));
  };

  _proto2.previousLabel = function previousLabel(beforeTime) {
    if (beforeTime === void 0) {
      beforeTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
  };

  _proto2.currentLabel = function currentLabel(value) {
    return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
  };

  _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = 0;
    }

    var child = this._first,
        labels = this.labels,
        p;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        child._start += amount;
        child._end += amount;
      }

      child = child._next;
    }

    if (adjustLabels) {
      for (p in labels) {
        if (labels[p] >= ignoreBeforeTime) {
          labels[p] += amount;
        }
      }
    }

    return _uncache(this);
  };

  _proto2.invalidate = function invalidate(soft) {
    var child = this._first;
    this._lock = 0;

    while (child) {
      child.invalidate(soft);
      child = child._next;
    }

    return _Animation.prototype.invalidate.call(this, soft);
  };

  _proto2.clear = function clear(includeLabels) {
    if (includeLabels === void 0) {
      includeLabels = true;
    }

    var child = this._first,
        next;

    while (child) {
      next = child._next;
      this.remove(child);
      child = next;
    }

    this._dp && (this._time = this._tTime = this._pTime = 0);
    includeLabels && (this.labels = {});
    return _uncache(this);
  };

  _proto2.totalDuration = function totalDuration(value) {
    var max = 0,
        self = this,
        child = self._last,
        prevStart = _bigNum,
        prev,
        start,
        parent;

    if (arguments.length) {
      return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
    }

    if (self._dirty) {
      parent = self.parent;

      while (child) {
        prev = child._prev; //record it here in case the tween changes position in the sequence...

        child._dirty && child.totalDuration(); //could change the tween._startTime, so make sure the animation's cache is clean before analyzing it.

        start = child._start;

        if (start > prevStart && self._sort && child._ts && !self._lock) {
          //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
          self._lock = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add().

          _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
        } else {
          prevStart = start;
        }

        if (start < 0 && child._ts) {
          //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
          max -= start;

          if (!parent && !self._dp || parent && parent.smoothChildTiming) {
            self._start += start / self._ts;
            self._time -= start;
            self._tTime -= start;
          }

          self.shiftChildren(-start, false, -1e999);
          prevStart = 0;
        }

        child._end > max && child._ts && (max = child._end);
        child = prev;
      }

      _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);

      self._dirty = 0;
    }

    return self._tDur;
  };

  Timeline.updateRoot = function updateRoot(time) {
    if (_globalTimeline._ts) {
      _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));

      _lastRenderedFrame = _ticker.frame;
    }

    if (_ticker.frame >= _nextGCFrame) {
      _nextGCFrame += _config.autoSleep || 120;
      var child = _globalTimeline._first;
      if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
        while (child && !child._ts) {
          child = child._next;
        }

        child || _ticker.sleep();
      }
    }
  };

  return Timeline;
}(Animation);

_setDefaults(Timeline.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});

var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
  //note: we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
  var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
      index = 0,
      matchIndex = 0,
      result,
      startNums,
      color,
      endNum,
      chunk,
      startNum,
      hasRandom,
      a;
  pt.b = start;
  pt.e = end;
  start += ""; //ensure values are strings

  end += "";

  if (hasRandom = ~end.indexOf("random(")) {
    end = _replaceRandom(end);
  }

  if (stringFilter) {
    a = [start, end];
    stringFilter(a, target, prop); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.

    start = a[0];
    end = a[1];
  }

  startNums = start.match(_complexStringNumExp) || [];

  while (result = _complexStringNumExp.exec(end)) {
    endNum = result[0];
    chunk = end.substring(index, result.index);

    if (color) {
      color = (color + 1) % 5;
    } else if (chunk.substr(-5) === "rgba(") {
      color = 1;
    }

    if (endNum !== startNums[matchIndex++]) {
      startNum = parseFloat(startNums[matchIndex - 1]) || 0; //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.

      pt._pt = {
        _next: pt._pt,
        p: chunk || matchIndex === 1 ? chunk : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: startNum,
        c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
        m: color && color < 4 ? Math.round : 0
      };
      index = _complexStringNumExp.lastIndex;
    }
  }

  pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)

  pt.fp = funcParam;

  if (_relExp.test(end) || hasRandom) {
    pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
  }

  this._pt = pt; //start the linked list with this new PropTween. Remember, we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.

  return pt;
},
    _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
  _isFunction(end) && (end = end(index || 0, target, targets));
  var currentValue = target[prop],
      parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
      setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
      pt;

  if (_isString(end)) {
    if (~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }

    if (end.charAt(1) === "=") {
      pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);

      if (pt || pt === 0) {
        // to avoid isNaN, like if someone passes in a value like "!= whatever"
        end = pt;
      }
    }
  }

  if (!optional || parsedStart !== end || _forceAllPropTweens) {
    if (!isNaN(parsedStart * end) && end !== "") {
      // fun fact: any number multiplied by "" is evaluated as the number 0!
      pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
      funcParam && (pt.fp = funcParam);
      modifier && pt.modifier(modifier, this, target);
      return this._pt = pt;
    }

    !currentValue && !(prop in target) && _missingPlugin(prop, end);
    return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
  }
},
    //creates a copy of the vars object and processes any function-based values (putting the resulting values directly into the copy) as well as strings with "random()" in them. It does NOT process relative values.
_processVars = function _processVars(vars, index, target, targets, tween) {
  _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));

  if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
    return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
  }

  var copy = {},
      p;

  for (p in vars) {
    copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
  }

  return copy;
},
    _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
  var plugin, pt, ptLookup, i;

  if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
    tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);

    if (tween !== _quickTween) {
      ptLookup = tween._ptLookup[tween._targets.indexOf(target)]; //note: we can't use tween._ptLookup[index] because for staggered tweens, the index from the fullTargets array won't match what it is in each individual tween that spawns from the stagger.

      i = plugin._props.length;

      while (i--) {
        ptLookup[plugin._props[i]] = pt;
      }
    }
  }

  return plugin;
},
    _overwritingTween,
    //store a reference temporarily so we can avoid overwriting itself.
_forceAllPropTweens,
    _initTween = function _initTween(tween, time, tTime) {
  var vars = tween.vars,
      ease = vars.ease,
      startAt = vars.startAt,
      immediateRender = vars.immediateRender,
      lazy = vars.lazy,
      onUpdate = vars.onUpdate,
      runBackwards = vars.runBackwards,
      yoyoEase = vars.yoyoEase,
      keyframes = vars.keyframes,
      autoRevert = vars.autoRevert,
      dur = tween._dur,
      prevStartAt = tween._startAt,
      targets = tween._targets,
      parent = tween.parent,
      fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets,
      autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites,
      tl = tween.timeline,
      cleanVars,
      i,
      p,
      pt,
      target,
      hasPriority,
      gsData,
      harness,
      plugin,
      ptLookup,
      index,
      harnessVars,
      overwritten;
  tl && (!keyframes || !ease) && (ease = "none");
  tween._ease = _parseEase(ease, _defaults.ease);
  tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;

  if (yoyoEase && tween._yoyo && !tween._repeat) {
    //there must have been a parent timeline with yoyo:true that is currently in its yoyo phase, so flip the eases.
    yoyoEase = tween._yEase;
    tween._yEase = tween._ease;
    tween._ease = yoyoEase;
  }

  tween._from = !tl && !!vars.runBackwards; //nested timelines should never run backwards - the backwards-ness is in the child tweens.

  if (!tl || keyframes && !vars.stagger) {
    //if there's an internal timeline, skip all the parsing because we passed that task down the chain.
    harness = targets[0] ? _getCache(targets[0]).harness : 0;
    harnessVars = harness && vars[harness.prop]; //someone may need to specify CSS-specific values AND non-CSS values, like if the element has an "x" property plus it's a standard DOM element. We allow people to distinguish by wrapping plugin-specific stuff in a css:{} object for example.

    cleanVars = _copyExcluding(vars, _reservedProps);

    if (prevStartAt) {
      prevStartAt._zTime < 0 && prevStartAt.progress(1); // in case it's a lazy startAt that hasn't rendered yet.

      time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig); // if it's a "startAt" (not "from()" or runBackwards: true), we only need to do a shallow revert (keep transforms cached in CSSPlugin)
      // don't just _removeFromParent(prevStartAt.render(-1, true)) because that'll leave inline styles. We're creating a new _startAt for "startAt" tweens that re-capture things to ensure that if the pre-tween values changed since the tween was created, they're recorded.

      prevStartAt._lazy = 0;
    }

    if (startAt) {
      _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
        data: "isStart",
        overwrite: false,
        parent: parent,
        immediateRender: true,
        lazy: !prevStartAt && _isNotFalse(lazy),
        startAt: null,
        delay: 0,
        onUpdate: onUpdate && function () {
          return _callback(tween, "onUpdate");
        },
        stagger: 0
      }, startAt))); //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, from, to).fromTo(e, to, from);


      tween._startAt._dp = 0; // don't allow it to get put back into root timeline! Like when revert() is called and totalTime() gets set.

      tween._startAt._sat = tween; // used in globalTime(). _sat stands for _startAtTween

      time < 0 && (_reverting || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill); // rare edge case, like if a render is forced in the negative direction of a non-initted tween.

      if (immediateRender) {
        if (dur && time <= 0 && tTime <= 0) {
          // check tTime here because in the case of a yoyo tween whose playhead gets pushed to the end like tween.progress(1), we should allow it through so that the onComplete gets fired properly.
          time && (tween._zTime = time);
          return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a Timeline, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
        }
      }
    } else if (runBackwards && dur) {
      //from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
      if (!prevStartAt) {
        time && (immediateRender = false); //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0

        p = _setDefaults({
          overwrite: false,
          data: "isFromStart",
          //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
          lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
          immediateRender: immediateRender,
          //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
          stagger: 0,
          parent: parent //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})

        }, cleanVars);
        harnessVars && (p[harness.prop] = harnessVars); // in case someone does something like .from(..., {css:{}})

        _removeFromParent(tween._startAt = Tween.set(targets, p));

        tween._startAt._dp = 0; // don't allow it to get put back into root timeline!

        tween._startAt._sat = tween; // used in globalTime()

        time < 0 && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
        tween._zTime = time;

        if (!immediateRender) {
          _initTween(tween._startAt, _tinyNum, _tinyNum); //ensures that the initial values are recorded

        } else if (!time) {
          return;
        }
      }
    }

    tween._pt = tween._ptCache = 0;
    lazy = dur && _isNotFalse(lazy) || lazy && !dur;

    for (i = 0; i < targets.length; i++) {
      target = targets[i];
      gsData = target._gsap || _harness(targets)[i]._gsap;
      tween._ptLookup[i] = ptLookup = {};
      _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)

      index = fullTargets === targets ? i : fullTargets.indexOf(target);

      if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
        tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);

        plugin._props.forEach(function (name) {
          ptLookup[name] = pt;
        });

        plugin.priority && (hasPriority = 1);
      }

      if (!harness || harnessVars) {
        for (p in cleanVars) {
          if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
            plugin.priority && (hasPriority = 1);
          } else {
            ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
          }
        }
      }

      tween._op && tween._op[i] && tween.kill(target, tween._op[i]);

      if (autoOverwrite && tween._pt) {
        _overwritingTween = tween;

        _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time)); // make sure the overwriting doesn't overwrite THIS tween!!!


        overwritten = !tween.parent;
        _overwritingTween = 0;
      }

      tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
    }

    hasPriority && _sortPropTweensByPriority(tween);
    tween._onInit && tween._onInit(tween); //plugins like RoundProps must wait until ALL of the PropTweens are instantiated. In the plugin's init() function, it sets the _onInit on the tween instance. May not be pretty/intuitive, but it's fast and keeps file size down.
  }

  tween._onUpdate = onUpdate;
  tween._initted = (!tween._op || tween._pt) && !overwritten; // if overwrittenProps resulted in the entire tween being killed, do NOT flag it as initted or else it may render for one tick.

  keyframes && time <= 0 && tl.render(_bigNum, true, true); // if there's a 0% keyframe, it'll render in the "before" state for any staggered/delayed animations thus when the following tween initializes, it'll use the "before" state instead of the "after" state as the initial values.
},
    _updatePropTweens = function _updatePropTweens(tween, property, value, start, startIsRelative, ratio, time, skipRecursion) {
  var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property],
      pt,
      rootPT,
      lookup,
      i;

  if (!ptCache) {
    ptCache = tween._ptCache[property] = [];
    lookup = tween._ptLookup;
    i = tween._targets.length;

    while (i--) {
      pt = lookup[i][property];

      if (pt && pt.d && pt.d._pt) {
        // it's a plugin, so find the nested PropTween
        pt = pt.d._pt;

        while (pt && pt.p !== property && pt.fp !== property) {
          // "fp" is functionParam for things like setting CSS variables which require .setProperty("--var-name", value)
          pt = pt._next;
        }
      }

      if (!pt) {
        // there is no PropTween associated with that property, so we must FORCE one to be created and ditch out of this
        // if the tween has other properties that already rendered at new positions, we'd normally have to rewind to put them back like tween.render(0, true) before forcing an _initTween(), but that can create another edge case like tweening a timeline's progress would trigger onUpdates to fire which could move other things around. It's better to just inform users that .resetTo() should ONLY be used for tweens that already have that property. For example, you can't gsap.to(...{ y: 0 }) and then tween.restTo("x", 200) for example.
        _forceAllPropTweens = 1; // otherwise, when we _addPropTween() and it finds no change between the start and end values, it skips creating a PropTween (for efficiency...why tween when there's no difference?) but in this case we NEED that PropTween created so we can edit it.

        tween.vars[property] = "+=0";

        _initTween(tween, time);

        _forceAllPropTweens = 0;
        return skipRecursion ? _warn(property + " not eligible for reset") : 1; // if someone tries to do a quickTo() on a special property like borderRadius which must get split into 4 different properties, that's not eligible for .resetTo().
      }

      ptCache.push(pt);
    }
  }

  i = ptCache.length;

  while (i--) {
    rootPT = ptCache[i];
    pt = rootPT._pt || rootPT; // complex values may have nested PropTweens. We only accommodate the FIRST value.

    pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
    pt.c = value - pt.s;
    rootPT.e && (rootPT.e = _round(value) + getUnit(rootPT.e)); // mainly for CSSPlugin (end value)

    rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b)); // (beginning value)
  }
},
    _addAliasesToVars = function _addAliasesToVars(targets, vars) {
  var harness = targets[0] ? _getCache(targets[0]).harness : 0,
      propertyAliases = harness && harness.aliases,
      copy,
      p,
      i,
      aliases;

  if (!propertyAliases) {
    return vars;
  }

  copy = _merge({}, vars);

  for (p in propertyAliases) {
    if (p in copy) {
      aliases = propertyAliases[p].split(",");
      i = aliases.length;

      while (i--) {
        copy[aliases[i]] = copy[p];
      }
    }
  }

  return copy;
},
    // parses multiple formats, like {"0%": {x: 100}, {"50%": {x: -20}} and { x: {"0%": 100, "50%": -20} }, and an "ease" can be set on any object. We populate an "allProps" object with an Array for each property, like {x: [{}, {}], y:[{}, {}]} with data for each property tween. The objects have a "t" (time), "v", (value), and "e" (ease) property. This allows us to piece together a timeline later.
_parseKeyframe = function _parseKeyframe(prop, obj, allProps, easeEach) {
  var ease = obj.ease || easeEach || "power1.inOut",
      p,
      a;

  if (_isArray(obj)) {
    a = allProps[prop] || (allProps[prop] = []); // t = time (out of 100), v = value, e = ease

    obj.forEach(function (value, i) {
      return a.push({
        t: i / (obj.length - 1) * 100,
        v: value,
        e: ease
      });
    });
  } else {
    for (p in obj) {
      a = allProps[p] || (allProps[p] = []);
      p === "ease" || a.push({
        t: parseFloat(prop),
        v: obj[p],
        e: ease
      });
    }
  }
},
    _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
  return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
},
    _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
    _staggerPropsToSkip = {};

_forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function (name) {
  return _staggerPropsToSkip[name] = 1;
});
/*
 * --------------------------------------------------------------------------------------
 * TWEEN
 * --------------------------------------------------------------------------------------
 */


var Tween = /*#__PURE__*/function (_Animation2) {
  _inheritsLoose(Tween, _Animation2);

  function Tween(targets, vars, position, skipInherit) {
    var _this3;

    if (typeof vars === "number") {
      position.duration = vars;
      vars = position;
      position = null;
    }

    _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
    var _this3$vars = _this3.vars,
        duration = _this3$vars.duration,
        delay = _this3$vars.delay,
        immediateRender = _this3$vars.immediateRender,
        stagger = _this3$vars.stagger,
        overwrite = _this3$vars.overwrite,
        keyframes = _this3$vars.keyframes,
        defaults = _this3$vars.defaults,
        scrollTrigger = _this3$vars.scrollTrigger,
        yoyoEase = _this3$vars.yoyoEase,
        parent = vars.parent || _globalTimeline,
        parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets),
        tl,
        i,
        copy,
        l,
        p,
        curTarget,
        staggerFunc,
        staggerVarsToMerge;
    _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config.nullTargetWarn) || [];
    _this3._ptLookup = []; //PropTween lookup. An array containing an object for each target, having keys for each tweening property

    _this3._overwrite = overwrite;

    if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
      vars = _this3.vars;
      tl = _this3.timeline = new Timeline({
        data: "nested",
        defaults: defaults || {},
        targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
      }); // we need to store the targets because for staggers and keyframes, we end up creating an individual tween for each but function-based values need to know the index and the whole Array of targets.

      tl.kill();
      tl.parent = tl._dp = _assertThisInitialized(_this3);
      tl._start = 0;

      if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        l = parsedTargets.length;
        staggerFunc = stagger && distribute(stagger);

        if (_isObject(stagger)) {
          //users can pass in callbacks like onStart/onComplete in the stagger object. These should fire with each individual tween.
          for (p in stagger) {
            if (~_staggerTweenProps.indexOf(p)) {
              staggerVarsToMerge || (staggerVarsToMerge = {});
              staggerVarsToMerge[p] = stagger[p];
            }
          }
        }

        for (i = 0; i < l; i++) {
          copy = _copyExcluding(vars, _staggerPropsToSkip);
          copy.stagger = 0;
          yoyoEase && (copy.yoyoEase = yoyoEase);
          staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
          curTarget = parsedTargets[i]; //don't just copy duration or delay because if they're a string or function, we'd end up in an infinite loop because _isFuncOrString() would evaluate as true in the child tweens, entering this loop, etc. So we parse the value straight from vars and default to 0.

          copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
          copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;

          if (!stagger && l === 1 && copy.delay) {
            // if someone does delay:"random(1, 5)", repeat:-1, for example, the delay shouldn't be inside the repeat.
            _this3._delay = delay = copy.delay;
            _this3._start += delay;
            copy.delay = 0;
          }

          tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
          tl._ease = _easeMap.none;
        }

        tl.duration() ? duration = delay = 0 : _this3.timeline = 0; // if the timeline's duration is 0, we don't need a timeline internally!
      } else if (keyframes) {
        _inheritDefaults(_setDefaults(tl.vars.defaults, {
          ease: "none"
        }));

        tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
        var time = 0,
            a,
            kf,
            v;

        if (_isArray(keyframes)) {
          keyframes.forEach(function (frame) {
            return tl.to(parsedTargets, frame, ">");
          });
          tl.duration(); // to ensure tl._dur is cached because we tap into it for performance purposes in the render() method.
        } else {
          copy = {};

          for (p in keyframes) {
            p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
          }

          for (p in copy) {
            a = copy[p].sort(function (a, b) {
              return a.t - b.t;
            });
            time = 0;

            for (i = 0; i < a.length; i++) {
              kf = a[i];
              v = {
                ease: kf.e,
                duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
              };
              v[p] = kf.v;
              tl.to(parsedTargets, v, time);
              time += v.duration;
            }
          }

          tl.duration() < duration && tl.to({}, {
            duration: duration - tl.duration()
          }); // in case keyframes didn't go to 100%
        }
      }

      duration || _this3.duration(duration = tl.duration());
    } else {
      _this3.timeline = 0; //speed optimization, faster lookups (no going up the prototype chain)
    }

    if (overwrite === true && !_suppressOverwrites) {
      _overwritingTween = _assertThisInitialized(_this3);

      _globalTimeline.killTweensOf(parsedTargets);

      _overwritingTween = 0;
    }

    _addToTimeline(parent, _assertThisInitialized(_this3), position);

    vars.reversed && _this3.reverse();
    vars.paused && _this3.paused(true);

    if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
      _this3._tTime = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)

      _this3.render(Math.max(0, -delay) || 0); //in case delay is negative

    }

    scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
    return _this3;
  }

  var _proto3 = Tween.prototype;

  _proto3.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._tDur,
        dur = this._dur,
        isNegative = totalTime < 0,
        tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        time,
        pt,
        iteration,
        cycleDuration,
        prevIteration,
        isYoyo,
        ratio,
        timeline,
        yoyoEase;

    if (!dur) {
      _renderZeroDurationTween(this, totalTime, suppressEvents, force);
    } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative || this._lazy) {
      // this senses if we're crossing over the start time, in which case we must record _zTime and force the render, but we do it in this lengthy conditional way for performance reasons (usually we can skip the calculations): this._initted && (this._zTime < 0) !== (totalTime < 0)
      time = tTime;
      timeline = this.timeline;

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        cycleDuration = dur + this._rDelay;

        if (this._repeat < -1 && isNegative) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }

        time = _roundPrecise(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (tTime === tDur) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          iteration = this._repeat;
          time = dur;
        } else {
          prevIteration = _roundPrecise(tTime / cycleDuration); // full decimal version of iterations, not the previous iteration (we're reusing prevIteration variable for efficiency)

          iteration = ~~prevIteration;

          if (iteration && iteration === prevIteration) {
            time = dur;
            iteration--;
          } else if (time > dur) {
            time = dur;
          }
        }

        isYoyo = this._yoyo && iteration & 1;

        if (isYoyo) {
          yoyoEase = this._yEase;
          time = dur - time;
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);

        if (time === prevTime && !force && this._initted && iteration === prevIteration) {
          //could be during the repeatDelay part. No need to render and fire callbacks.
          this._tTime = tTime;
          return this;
        }

        if (iteration !== prevIteration) {
          timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo); //repeatRefresh functionality

          if (this.vars.repeatRefresh && !isYoyo && !this._lock && time !== cycleDuration && this._initted) {
            // this._time will === cycleDuration when we render at EXACTLY the end of an iteration. Without this condition, it'd often do the repeatRefresh render TWICE (again on the very next tick).
            this._lock = force = 1; //force, otherwise if lazy is true, the _attemptInitTween() will return and we'll jump out and get caught bouncing on each tick.

            this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
          }
        }
      }

      if (!this._initted) {
        if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
          this._tTime = 0; // in constructor if immediateRender is true, we set _tTime to -_tinyNum to have the playhead cross the starting point but we can't leave _tTime as a negative number.

          return this;
        }

        if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) {
          // rare edge case - during initialization, an onUpdate in the _startAt (.fromTo()) might force this tween to render at a different spot in which case we should ditch this render() call so that it doesn't revert the values. But we also don't want to dump if we're doing a repeatRefresh render!
          return this;
        }

        if (dur !== this._dur) {
          // while initting, a plugin like InertiaPlugin might alter the duration, so rerun from the start to ensure everything renders as it should.
          return this.render(totalTime, suppressEvents, force);
        }
      }

      this._tTime = tTime;
      this._time = time;

      if (!this._act && this._ts) {
        this._act = 1; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

        this._lazy = 0;
      }

      this.ratio = ratio = (yoyoEase || this._ease)(time / dur);

      if (this._from) {
        this.ratio = ratio = 1 - ratio;
      }

      if (!prevTime && tTime && !suppressEvents && !prevIteration) {
        _callback(this, "onStart");

        if (this._tTime !== tTime) {
          // in case the onStart triggered a render at a different spot, eject. Like if someone did animation.pause(0.5) or something inside the onStart.
          return this;
        }
      }

      pt = this._pt;

      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }

      timeline && timeline.render(totalTime < 0 ? totalTime : timeline._dur * timeline._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);

      if (this._onUpdate && !suppressEvents) {
        isNegative && _rewindStartAt(this, totalTime, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.

        _callback(this, "onUpdate");
      }

      this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");

      if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
        isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
        (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if we're rendering at exactly a time of 0, as there could be autoRevert values that should get set on the next tick (if the playhead goes backward beyond the startTime, negative totalTime). Don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
          // if prevTime and tTime are zero, we shouldn't fire the onReverseComplete. This could happen if you gsap.to(... {paused:true}).play();
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }

    return this;
  };

  _proto3.targets = function targets() {
    return this._targets;
  };

  _proto3.invalidate = function invalidate(soft) {
    // "soft" gives us a way to clear out everything EXCEPT the recorded pre-"from" portion of from() tweens. Otherwise, for example, if you tween.progress(1).render(0, true true).invalidate(), the "from" values would persist and then on the next render, the from() tweens would initialize and the current value would match the "from" values, thus animate from the same value to the same value (no animation). We tap into this in ScrollTrigger's refresh() where we must push a tween to completion and then back again but honor its init state in case the tween is dependent on another tween further up on the page.
    (!soft || !this.vars.runBackwards) && (this._startAt = 0);
    this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
    this._ptLookup = [];
    this.timeline && this.timeline.invalidate(soft);
    return _Animation2.prototype.invalidate.call(this, soft);
  };

  _proto3.resetTo = function resetTo(property, value, start, startIsRelative, skipRecursion) {
    _tickerActive || _ticker.wake();
    this._ts || this.play();
    var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts),
        ratio;
    this._initted || _initTween(this, time);
    ratio = this._ease(time / this._dur); // don't just get tween.ratio because it may not have rendered yet.
    // possible future addition to allow an object with multiple values to update, like tween.resetTo({x: 100, y: 200}); At this point, it doesn't seem worth the added kb given the fact that most users will likely opt for the convenient gsap.quickTo() way of interacting with this method.
    // if (_isObject(property)) { // performance optimization
    // 	for (p in property) {
    // 		if (_updatePropTweens(this, p, property[p], value ? value[p] : null, start, ratio, time)) {
    // 			return this.resetTo(property, value, start, startIsRelative); // if a PropTween wasn't found for the property, it'll get forced with a re-initialization so we need to jump out and start over again.
    // 		}
    // 	}
    // } else {

    if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time, skipRecursion)) {
      return this.resetTo(property, value, start, startIsRelative, 1); // if a PropTween wasn't found for the property, it'll get forced with a re-initialization so we need to jump out and start over again.
    } //}


    _alignPlayhead(this, 0);

    this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
    return this.render(0);
  };

  _proto3.kill = function kill(targets, vars) {
    if (vars === void 0) {
      vars = "all";
    }

    if (!targets && (!vars || vars === "all")) {
      this._lazy = this._pt = 0;
      this.parent ? _interrupt(this) : this.scrollTrigger && this.scrollTrigger.kill(!!_reverting);
      return this;
    }

    if (this.timeline) {
      var tDur = this.timeline.totalDuration();
      this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this); // if nothing is left tweening, interrupt.

      this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1); // if a nested tween is killed that changes the duration, it should affect this tween's duration. We must use the ratio, though, because sometimes the internal timeline is stretched like for keyframes where they don't all add up to whatever the parent tween's duration was set to.

      return this;
    }

    var parsedTargets = this._targets,
        killingTargets = targets ? toArray(targets) : parsedTargets,
        propTweenLookup = this._ptLookup,
        firstPT = this._pt,
        overwrittenProps,
        curLookup,
        curOverwriteProps,
        props,
        p,
        pt,
        i;

    if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
      vars === "all" && (this._pt = 0);
      return _interrupt(this);
    }

    overwrittenProps = this._op = this._op || [];

    if (vars !== "all") {
      //so people can pass in a comma-delimited list of property names
      if (_isString(vars)) {
        p = {};

        _forEachName(vars, function (name) {
          return p[name] = 1;
        });

        vars = p;
      }

      vars = _addAliasesToVars(parsedTargets, vars);
    }

    i = parsedTargets.length;

    while (i--) {
      if (~killingTargets.indexOf(parsedTargets[i])) {
        curLookup = propTweenLookup[i];

        if (vars === "all") {
          overwrittenProps[i] = vars;
          props = curLookup;
          curOverwriteProps = {};
        } else {
          curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
          props = vars;
        }

        for (p in props) {
          pt = curLookup && curLookup[p];

          if (pt) {
            if (!("kill" in pt.d) || pt.d.kill(p) === true) {
              _removeLinkedListItem(this, pt, "_pt");
            }

            delete curLookup[p];
          }

          if (curOverwriteProps !== "all") {
            curOverwriteProps[p] = 1;
          }
        }
      }
    }

    this._initted && !this._pt && firstPT && _interrupt(this); //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.

    return this;
  };

  Tween.to = function to(targets, vars) {
    return new Tween(targets, vars, arguments[2]);
  };

  Tween.from = function from(targets, vars) {
    return _createTweenType(1, arguments);
  };

  Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
    return new Tween(callback, 0, {
      immediateRender: false,
      lazy: false,
      overwrite: false,
      delay: delay,
      onComplete: callback,
      onReverseComplete: callback,
      onCompleteParams: params,
      onReverseCompleteParams: params,
      callbackScope: scope
    }); // we must use onReverseComplete too for things like timeline.add(() => {...}) which should be triggered in BOTH directions (forward and reverse)
  };

  Tween.fromTo = function fromTo(targets, fromVars, toVars) {
    return _createTweenType(2, arguments);
  };

  Tween.set = function set(targets, vars) {
    vars.duration = 0;
    vars.repeatDelay || (vars.repeat = 0);
    return new Tween(targets, vars);
  };

  Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    return _globalTimeline.killTweensOf(targets, props, onlyActive);
  };

  return Tween;
}(Animation);

_setDefaults(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
}); //add the pertinent timeline methods to Tween instances so that users can chain conveniently and create a timeline automatically. (removed due to concerns that it'd ultimately add to more confusion especially for beginners)
// _forEachName("to,from,fromTo,set,call,add,addLabel,addPause", name => {
// 	Tween.prototype[name] = function() {
// 		let tl = new Timeline();
// 		return _addToTimeline(tl, this)[name].apply(tl, toArray(arguments));
// 	}
// });
//for backward compatibility. Leverage the timeline calls.


_forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
  Tween[name] = function () {
    var tl = new Timeline(),
        params = _slice.call(arguments, 0);

    params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
    return tl[name].apply(tl, params);
  };
});
/*
 * --------------------------------------------------------------------------------------
 * PROPTWEEN
 * --------------------------------------------------------------------------------------
 */


var _setterPlain = function _setterPlain(target, property, value) {
  return target[property] = value;
},
    _setterFunc = function _setterFunc(target, property, value) {
  return target[property](value);
},
    _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
  return target[property](data.fp, value);
},
    _setterAttribute = function _setterAttribute(target, property, value) {
  return target.setAttribute(property, value);
},
    _getSetter = function _getSetter(target, property) {
  return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
},
    _renderPlain = function _renderPlain(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1000000) / 1000000, data);
},
    _renderBoolean = function _renderBoolean(ratio, data) {
  return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
},
    _renderComplexString = function _renderComplexString(ratio, data) {
  var pt = data._pt,
      s = "";

  if (!ratio && data.b) {
    //b = beginning string
    s = data.b;
  } else if (ratio === 1 && data.e) {
    //e = ending string
    s = data.e;
  } else {
    while (pt) {
      s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s; //we use the "p" property for the text inbetween (like a suffix). And in the context of a complex string, the modifier (m) is typically just Math.round(), like for RGB colors.

      pt = pt._next;
    }

    s += data.c; //we use the "c" of the PropTween to store the final chunk of non-numeric text.
  }

  data.set(data.t, data.p, s, data);
},
    _renderPropTweens = function _renderPropTweens(ratio, data) {
  var pt = data._pt;

  while (pt) {
    pt.r(ratio, pt.d);
    pt = pt._next;
  }
},
    _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
  var pt = this._pt,
      next;

  while (pt) {
    next = pt._next;
    pt.p === property && pt.modifier(modifier, tween, target);
    pt = next;
  }
},
    _killPropTweensOf = function _killPropTweensOf(property) {
  var pt = this._pt,
      hasNonDependentRemaining,
      next;

  while (pt) {
    next = pt._next;

    if (pt.p === property && !pt.op || pt.op === property) {
      _removeLinkedListItem(this, pt, "_pt");
    } else if (!pt.dep) {
      hasNonDependentRemaining = 1;
    }

    pt = next;
  }

  return !hasNonDependentRemaining;
},
    _setterWithModifier = function _setterWithModifier(target, property, value, data) {
  data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
},
    _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
  var pt = parent._pt,
      next,
      pt2,
      first,
      last; //sorts the PropTween linked list in order of priority because some plugins need to do their work after ALL of the PropTweens were created (like RoundPropsPlugin and ModifiersPlugin)

  while (pt) {
    next = pt._next;
    pt2 = first;

    while (pt2 && pt2.pr > pt.pr) {
      pt2 = pt2._next;
    }

    if (pt._prev = pt2 ? pt2._prev : last) {
      pt._prev._next = pt;
    } else {
      first = pt;
    }

    if (pt._next = pt2) {
      pt2._prev = pt;
    } else {
      last = pt;
    }

    pt = next;
  }

  parent._pt = first;
}; //PropTween key: t = target, p = prop, r = renderer, d = data, s = start, c = change, op = overwriteProperty (ONLY populated when it's different than p), pr = priority, _next/_prev for the linked list siblings, set = setter, m = modifier, mSet = modifierSetter (the original setter, before a modifier was added)


var PropTween = /*#__PURE__*/function () {
  function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
    this.t = target;
    this.s = start;
    this.c = change;
    this.p = prop;
    this.r = renderer || _renderPlain;
    this.d = data || this;
    this.set = setter || _setterPlain;
    this.pr = priority || 0;
    this._next = next;

    if (next) {
      next._prev = this;
    }
  }

  var _proto4 = PropTween.prototype;

  _proto4.modifier = function modifier(func, tween, target) {
    this.mSet = this.mSet || this.set; //in case it was already set (a PropTween can only have one modifier)

    this.set = _setterWithModifier;
    this.m = func;
    this.mt = target; //modifier target

    this.tween = tween;
  };

  return PropTween;
}(); //Initialization tasks

_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function (name) {
  return _reservedProps[name] = 1;
});

_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: false,
  defaults: _defaults,
  autoRemoveChildren: true,
  id: "root",
  smoothChildTiming: true
});
_config.stringFilter = _colorStringFilter;

var _media = [],
    _listeners = {},
    _emptyArray = [],
    _lastMediaTime = 0,
    _contextID = 0,
    _dispatch = function _dispatch(type) {
  return (_listeners[type] || _emptyArray).map(function (f) {
    return f();
  });
},
    _onMediaChange = function _onMediaChange() {
  var time = Date.now(),
      matches = [];

  if (time - _lastMediaTime > 2) {
    _dispatch("matchMediaInit");

    _media.forEach(function (c) {
      var queries = c.queries,
          conditions = c.conditions,
          match,
          p,
          anyMatch,
          toggled;

      for (p in queries) {
        match = _win.matchMedia(queries[p]).matches; // Firefox doesn't update the "matches" property of the MediaQueryList object correctly - it only does so as it calls its change handler - so we must re-create a media query here to ensure it's accurate.

        match && (anyMatch = 1);

        if (match !== conditions[p]) {
          conditions[p] = match;
          toggled = 1;
        }
      }

      if (toggled) {
        c.revert();
        anyMatch && matches.push(c);
      }
    });

    _dispatch("matchMediaRevert");

    matches.forEach(function (c) {
      return c.onMatch(c, function (func) {
        return c.add(null, func);
      });
    });
    _lastMediaTime = time;

    _dispatch("matchMedia");
  }
};

var Context = /*#__PURE__*/function () {
  function Context(func, scope) {
    this.selector = scope && selector(scope);
    this.data = [];
    this._r = []; // returned/cleanup functions

    this.isReverted = false;
    this.id = _contextID++; // to work around issues that frameworks like Vue cause by making things into Proxies which make it impossible to do something like _media.indexOf(this) because "this" would no longer refer to the Context instance itself - it'd refer to a Proxy! We needed a way to identify the context uniquely

    func && this.add(func);
  }

  var _proto5 = Context.prototype;

  _proto5.add = function add(name, func, scope) {
    // possible future addition if we need the ability to add() an animation to a context and for whatever reason cannot create that animation inside of a context.add(() => {...}) function.
    // if (name && _isFunction(name.revert)) {
    // 	this.data.push(name);
    // 	return (name._ctx = this);
    // }
    if (_isFunction(name)) {
      scope = func;
      func = name;
      name = _isFunction;
    }

    var self = this,
        f = function f() {
      var prev = _context,
          prevSelector = self.selector,
          result;
      prev && prev !== self && prev.data.push(self);
      scope && (self.selector = selector(scope));
      _context = self;
      result = func.apply(self, arguments);
      _isFunction(result) && self._r.push(result);
      _context = prev;
      self.selector = prevSelector;
      self.isReverted = false;
      return result;
    };

    self.last = f;
    return name === _isFunction ? f(self, function (func) {
      return self.add(null, func);
    }) : name ? self[name] = f : f;
  };

  _proto5.ignore = function ignore(func) {
    var prev = _context;
    _context = null;
    func(this);
    _context = prev;
  };

  _proto5.getTweens = function getTweens() {
    var a = [];
    this.data.forEach(function (e) {
      return e instanceof Context ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
    });
    return a;
  };

  _proto5.clear = function clear() {
    this._r.length = this.data.length = 0;
  };

  _proto5.kill = function kill(revert, matchMedia) {
    var _this4 = this;

    if (revert) {
      (function () {
        var tweens = _this4.getTweens(),
            i = _this4.data.length,
            t;

        while (i--) {
          // Flip plugin tweens are very different in that they should actually be pushed to their end. The plugin replaces the timeline's .revert() method to do exactly that. But we also need to remove any of those nested tweens inside the flip timeline so that they don't get individually reverted.
          t = _this4.data[i];

          if (t.data === "isFlip") {
            t.revert();
            t.getChildren(true, true, false).forEach(function (tween) {
              return tweens.splice(tweens.indexOf(tween), 1);
            });
          }
        } // save as an object so that we can cache the globalTime for each tween to optimize performance during the sort


        tweens.map(function (t) {
          return {
            g: t._dur || t._delay || t._sat && !t._sat.vars.immediateRender ? t.globalTime(0) : -Infinity,
            t: t
          };
        }).sort(function (a, b) {
          return b.g - a.g || -Infinity;
        }).forEach(function (o) {
          return o.t.revert(revert);
        }); // note: all of the _startAt tweens should be reverted in reverse order that they were created, and they'll all have the same globalTime (-1) so the " || -1" in the sort keeps the order properly.

        i = _this4.data.length;

        while (i--) {
          // make sure we loop backwards so that, for example, SplitTexts that were created later on the same element get reverted first
          t = _this4.data[i];

          if (t instanceof Timeline) {
            if (t.data !== "nested") {
              t.scrollTrigger && t.scrollTrigger.revert();
              t.kill(); // don't revert() the timeline because that's duplicating efforts since we already reverted all the tweens
            }
          } else {
            !(t instanceof Tween) && t.revert && t.revert(revert);
          }
        }

        _this4._r.forEach(function (f) {
          return f(revert, _this4);
        });

        _this4.isReverted = true;
      })();
    } else {
      this.data.forEach(function (e) {
        return e.kill && e.kill();
      });
    }

    this.clear();

    if (matchMedia) {
      var i = _media.length;

      while (i--) {
        // previously, we checked _media.indexOf(this), but some frameworks like Vue enforce Proxy objects that make it impossible to get the proper result that way, so we must use a unique ID number instead.
        _media[i].id === this.id && _media.splice(i, 1);
      }
    }
  } // killWithCleanup() {
  // 	this.kill();
  // 	this._r.forEach(f => f(false, this));
  // }
  ;

  _proto5.revert = function revert(config) {
    this.kill(config || {});
  };

  return Context;
}();

var MatchMedia = /*#__PURE__*/function () {
  function MatchMedia(scope) {
    this.contexts = [];
    this.scope = scope;
    _context && _context.data.push(this);
  }

  var _proto6 = MatchMedia.prototype;

  _proto6.add = function add(conditions, func, scope) {
    _isObject(conditions) || (conditions = {
      matches: conditions
    });
    var context = new Context(0, scope || this.scope),
        cond = context.conditions = {},
        mq,
        p,
        active;
    _context && !context.selector && (context.selector = _context.selector); // in case a context is created inside a context. Like a gsap.matchMedia() that's inside a scoped gsap.context()

    this.contexts.push(context);
    func = context.add("onMatch", func);
    context.queries = conditions;

    for (p in conditions) {
      if (p === "all") {
        active = 1;
      } else {
        mq = _win.matchMedia(conditions[p]);

        if (mq) {
          _media.indexOf(context) < 0 && _media.push(context);
          (cond[p] = mq.matches) && (active = 1);
          mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
        }
      }
    }

    active && func(context, function (f) {
      return context.add(null, f);
    });
    return this;
  } // refresh() {
  // 	let time = _lastMediaTime,
  // 		media = _media;
  // 	_lastMediaTime = -1;
  // 	_media = this.contexts;
  // 	_onMediaChange();
  // 	_lastMediaTime = time;
  // 	_media = media;
  // }
  ;

  _proto6.revert = function revert(config) {
    this.kill(config || {});
  };

  _proto6.kill = function kill(revert) {
    this.contexts.forEach(function (c) {
      return c.kill(revert, true);
    });
  };

  return MatchMedia;
}();
/*
 * --------------------------------------------------------------------------------------
 * GSAP
 * --------------------------------------------------------------------------------------
 */


var _gsap = {
  registerPlugin: function registerPlugin() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args.forEach(function (config) {
      return _createPlugin(config);
    });
  },
  timeline: function timeline(vars) {
    return new Timeline(vars);
  },
  getTweensOf: function getTweensOf(targets, onlyActive) {
    return _globalTimeline.getTweensOf(targets, onlyActive);
  },
  getProperty: function getProperty(target, property, unit, uncache) {
    _isString(target) && (target = toArray(target)[0]); //in case selector text or an array is passed in

    var getter = _getCache(target || {}).get,
        format = unit ? _passThrough : _numericIfPossible;

    unit === "native" && (unit = "");
    return !target ? target : !property ? function (property, unit, uncache) {
      return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
  },
  quickSetter: function quickSetter(target, property, unit) {
    target = toArray(target);

    if (target.length > 1) {
      var setters = target.map(function (t) {
        return gsap.quickSetter(t, property, unit);
      }),
          l = setters.length;
      return function (value) {
        var i = l;

        while (i--) {
          setters[i](value);
        }
      };
    }

    target = target[0] || {};

    var Plugin = _plugins[property],
        cache = _getCache(target),
        p = cache.harness && (cache.harness.aliases || {})[property] || property,
        // in case it's an alias, like "rotate" for "rotation".
    setter = Plugin ? function (value) {
      var p = new Plugin();
      _quickTween._pt = 0;
      p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
      p.render(1, p);
      _quickTween._pt && _renderPropTweens(1, _quickTween);
    } : cache.set(target, p);

    return Plugin ? setter : function (value) {
      return setter(target, p, unit ? value + unit : value, cache, 1);
    };
  },
  quickTo: function quickTo(target, property, vars) {
    var _setDefaults2;

    var tween = gsap.to(target, _setDefaults((_setDefaults2 = {}, _setDefaults2[property] = "+=0.1", _setDefaults2.paused = true, _setDefaults2.stagger = 0, _setDefaults2), vars || {})),
        func = function func(value, start, startIsRelative) {
      return tween.resetTo(property, value, start, startIsRelative);
    };

    func.tween = tween;
    return func;
  },
  isTweening: function isTweening(targets) {
    return _globalTimeline.getTweensOf(targets, true).length > 0;
  },
  defaults: function defaults(value) {
    value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
    return _mergeDeep(_defaults, value || {});
  },
  config: function config(value) {
    return _mergeDeep(_config, value || {});
  },
  registerEffect: function registerEffect(_ref3) {
    var name = _ref3.name,
        effect = _ref3.effect,
        plugins = _ref3.plugins,
        defaults = _ref3.defaults,
        extendTimeline = _ref3.extendTimeline;
    (plugins || "").split(",").forEach(function (pluginName) {
      return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
    });

    _effects[name] = function (targets, vars, tl) {
      return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
    };

    if (extendTimeline) {
      Timeline.prototype[name] = function (targets, vars, position) {
        return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
      };
    }
  },
  registerEase: function registerEase(name, ease) {
    _easeMap[name] = _parseEase(ease);
  },
  parseEase: function parseEase(ease, defaultEase) {
    return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
  },
  getById: function getById(id) {
    return _globalTimeline.getById(id);
  },
  exportRoot: function exportRoot(vars, includeDelayedCalls) {
    if (vars === void 0) {
      vars = {};
    }

    var tl = new Timeline(vars),
        child,
        next;
    tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);

    _globalTimeline.remove(tl);

    tl._dp = 0; //otherwise it'll get re-activated when adding children and be re-introduced into _globalTimeline's linked list (then added to itself).

    tl._time = tl._tTime = _globalTimeline._time;
    child = _globalTimeline._first;

    while (child) {
      next = child._next;

      if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
        _addToTimeline(tl, child, child._start - child._delay);
      }

      child = next;
    }

    _addToTimeline(_globalTimeline, tl, 0);

    return tl;
  },
  context: function context(func, scope) {
    return func ? new Context(func, scope) : _context;
  },
  matchMedia: function matchMedia(scope) {
    return new MatchMedia(scope);
  },
  matchMediaRefresh: function matchMediaRefresh() {
    return _media.forEach(function (c) {
      var cond = c.conditions,
          found,
          p;

      for (p in cond) {
        if (cond[p]) {
          cond[p] = false;
          found = 1;
        }
      }

      found && c.revert();
    }) || _onMediaChange();
  },
  addEventListener: function addEventListener(type, callback) {
    var a = _listeners[type] || (_listeners[type] = []);
    ~a.indexOf(callback) || a.push(callback);
  },
  removeEventListener: function removeEventListener(type, callback) {
    var a = _listeners[type],
        i = a && a.indexOf(callback);
    i >= 0 && a.splice(i, 1);
  },
  utils: {
    wrap: wrap,
    wrapYoyo: wrapYoyo,
    distribute: distribute,
    random: random,
    snap: snap,
    normalize: normalize,
    getUnit: getUnit,
    clamp: clamp,
    splitColor: splitColor,
    toArray: toArray,
    selector: selector,
    mapRange: mapRange,
    pipe: pipe,
    unitize: unitize,
    interpolate: interpolate,
    shuffle: shuffle
  },
  install: _install,
  effects: _effects,
  ticker: _ticker,
  updateRoot: Timeline.updateRoot,
  plugins: _plugins,
  globalTimeline: _globalTimeline,
  core: {
    PropTween: PropTween,
    globals: _addGlobal,
    Tween: Tween,
    Timeline: Timeline,
    Animation: Animation,
    getCache: _getCache,
    _removeLinkedListItem: _removeLinkedListItem,
    reverting: function reverting() {
      return _reverting;
    },
    context: function context(toAdd) {
      if (toAdd && _context) {
        _context.data.push(toAdd);

        toAdd._ctx = _context;
      }

      return _context;
    },
    suppressOverwrites: function suppressOverwrites(value) {
      return _suppressOverwrites = value;
    }
  }
};

_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
  return _gsap[name] = Tween[name];
});

_ticker.add(Timeline.updateRoot);

_quickTween = _gsap.to({}, {
  duration: 0
}); // ---- EXTRA PLUGINS --------------------------------------------------------

var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
  var pt = plugin._pt;

  while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
    pt = pt._next;
  }

  return pt;
},
    _addModifiers = function _addModifiers(tween, modifiers) {
  var targets = tween._targets,
      p,
      i,
      pt;

  for (p in modifiers) {
    i = targets.length;

    while (i--) {
      pt = tween._ptLookup[i][p];

      if (pt && (pt = pt.d)) {
        if (pt._pt) {
          // is a plugin
          pt = _getPluginPropTween(pt, p);
        }

        pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
      }
    }
  }
},
    _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
  return {
    name: name,
    headless: 1,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function init(target, vars, tween) {
      tween._onInit = function (tween) {
        var temp, p;

        if (_isString(vars)) {
          temp = {};

          _forEachName(vars, function (name) {
            return temp[name] = 1;
          }); //if the user passes in a comma-delimited list of property names to roundProps, like "x,y", we round to whole numbers.


          vars = temp;
        }

        if (modifier) {
          temp = {};

          for (p in vars) {
            temp[p] = modifier(vars[p]);
          }

          vars = temp;
        }

        _addModifiers(tween, vars);
      };
    }
  };
}; //register core plugins


var gsap = _gsap.registerPlugin({
  name: "attr",
  init: function init(target, vars, tween, index, targets) {
    var p, pt, v;
    this.tween = tween;

    for (p in vars) {
      v = target.getAttribute(p) || "";
      pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
      pt.op = p;
      pt.b = v; // record the beginning value so we can revert()

      this._props.push(p);
    }
  },
  render: function render(ratio, data) {
    var pt = data._pt;

    while (pt) {
      _reverting ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d); // if reverting, go back to the original (pt.b)

      pt = pt._next;
    }
  }
}, {
  name: "endArray",
  headless: 1,
  init: function init(target, value) {
    var i = value.length;

    while (i--) {
      this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
    }
  }
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap; //to prevent the core plugins from being dropped via aggressive tree shaking, we must include them in the variable declaration in this way.

Tween.version = Timeline.version = gsap.version = "3.13.0";
_coreReady = 1;
_windowExists() && _wake();
var Power0 = _easeMap.Power0,
    Power1 = _easeMap.Power1,
    Power2 = _easeMap.Power2,
    Power3 = _easeMap.Power3,
    Power4 = _easeMap.Power4,
    Linear = _easeMap.Linear,
    Quad = _easeMap.Quad,
    Cubic = _easeMap.Cubic,
    Quart = _easeMap.Quart,
    Quint = _easeMap.Quint,
    Strong = _easeMap.Strong,
    Elastic = _easeMap.Elastic,
    Back = _easeMap.Back,
    SteppedEase = _easeMap.SteppedEase,
    Bounce = _easeMap.Bounce,
    Sine = _easeMap.Sine,
    Expo = _easeMap.Expo,
    Circ = _easeMap.Circ;

 //export some internal methods/orojects for use in CSSPlugin so that we can externalize that file and allow custom builds that exclude it.



/***/ }),

/***/ "./node_modules/gsap/index.js":
/*!************************************!*\
  !*** ./node_modules/gsap/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Back: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Back),
/* harmony export */   Bounce: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Bounce),
/* harmony export */   CSSPlugin: () => (/* reexport safe */ _CSSPlugin_js__WEBPACK_IMPORTED_MODULE_1__.CSSPlugin),
/* harmony export */   Circ: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Circ),
/* harmony export */   Cubic: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Cubic),
/* harmony export */   Elastic: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Elastic),
/* harmony export */   Expo: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Expo),
/* harmony export */   Linear: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Linear),
/* harmony export */   Power0: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Power0),
/* harmony export */   Power1: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Power1),
/* harmony export */   Power2: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Power2),
/* harmony export */   Power3: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Power3),
/* harmony export */   Power4: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Power4),
/* harmony export */   Quad: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Quad),
/* harmony export */   Quart: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Quart),
/* harmony export */   Quint: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Quint),
/* harmony export */   Sine: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Sine),
/* harmony export */   SteppedEase: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.SteppedEase),
/* harmony export */   Strong: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.Strong),
/* harmony export */   TimelineLite: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.TimelineLite),
/* harmony export */   TimelineMax: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.TimelineMax),
/* harmony export */   TweenLite: () => (/* reexport safe */ _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.TweenLite),
/* harmony export */   TweenMax: () => (/* binding */ TweenMaxWithCSS),
/* harmony export */   "default": () => (/* binding */ gsapWithCSS),
/* harmony export */   gsap: () => (/* binding */ gsapWithCSS)
/* harmony export */ });
/* harmony import */ var _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gsap-core.js */ "./node_modules/gsap/gsap-core.js");
/* harmony import */ var _CSSPlugin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CSSPlugin.js */ "./node_modules/gsap/CSSPlugin.js");


var gsapWithCSS = _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.gsap.registerPlugin(_CSSPlugin_js__WEBPACK_IMPORTED_MODULE_1__.CSSPlugin) || _gsap_core_js__WEBPACK_IMPORTED_MODULE_0__.gsap,
    // to protect from tree shaking
TweenMaxWithCSS = gsapWithCSS.core.Tween;


/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/components/ContentElement.js":
/*!***************************************************!*\
  !*** ./resources/js/components/ContentElement.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContentElement: () => (/* binding */ ContentElement)
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
      var _document$getElementB, _document$getElementB2;
      if (!selected) return;
      var lead = document.getElementById("lead");
      if (!lead) return;
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
      (_document$getElementB = document.getElementById("default")) === null || _document$getElementB === void 0 || _document$getElementB.classList.add("hidden");
      (_document$getElementB2 = document.getElementById("secondary")) === null || _document$getElementB2 === void 0 || _document$getElementB2.classList.add("hidden");
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
customElements.define('content-element', ContentElement);

/***/ }),

/***/ "./resources/js/components/FancyButtonElement.js":
/*!*******************************************************!*\
  !*** ./resources/js/components/FancyButtonElement.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FancyButtonElement: () => (/* binding */ FancyButtonElement)
/* harmony export */ });
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gsap */ "./node_modules/gsap/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldSet(e, t, r) { var s = _classPrivateFieldGet2(t, e); return _classApplyDescriptorSet(e, s, r), r; }
function _classApplyDescriptorSet(e, t, l) { if (t.set) t.set.call(e, l);else { if (!t.writable) throw new TypeError("attempted to set read only private field"); t.value = l; } }
function _classPrivateFieldGet(e, t) { var r = _classPrivateFieldGet2(t, e); return _classApplyDescriptorGet(e, r); }
function _classPrivateFieldGet2(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classApplyDescriptorGet(e, t) { return t.get ? t.get.call(e) : t.value; }
function _classPrivateMethodGet(s, a, r) { return _assertClassBrand(a, s), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }

var clamp = function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
};

/**
 * FancyButtonElement
 *
 * Takes a standard anchor link and splits its label text into individual
 * span elements to run complex staggered GSAP animations on hover/press.
 * Alternatively, wraps a container with `data-fancy-letters` and applies
 * animations to its pre-existing SVG path children natively.
 */
var _label = /*#__PURE__*/new WeakMap();
var _link = /*#__PURE__*/new WeakMap();
var _usingPointerEvents = /*#__PURE__*/new WeakMap();
var _placeholder = /*#__PURE__*/new WeakMap();
var _letterLayer = /*#__PURE__*/new WeakMap();
var _letters = /*#__PURE__*/new WeakMap();
var _placeholderLetters = /*#__PURE__*/new WeakMap();
var _letterAnchors = /*#__PURE__*/new WeakMap();
var _letterSizes = /*#__PURE__*/new WeakMap();
var _placeholderRect = /*#__PURE__*/new WeakMap();
var _containerRect = /*#__PURE__*/new WeakMap();
var _pressTimeline = /*#__PURE__*/new WeakMap();
var _releaseTimeline = /*#__PURE__*/new WeakMap();
var _hoverAnimation = /*#__PURE__*/new WeakMap();
var _config = /*#__PURE__*/new WeakMap();
var _hydrateStructure = /*#__PURE__*/new WeakSet();
var _prepareLabelLayers = /*#__PURE__*/new WeakSet();
var _initializeTweens = /*#__PURE__*/new WeakSet();
var _handlePointerEnter = /*#__PURE__*/new WeakMap();
var _handlePointerDown = /*#__PURE__*/new WeakMap();
var _handlePointerLeave = /*#__PURE__*/new WeakMap();
var _handlePointerUp = /*#__PURE__*/new WeakMap();
var _handleTouchStart = /*#__PURE__*/new WeakMap();
var _handleTouchEnd = /*#__PURE__*/new WeakMap();
var _handleResize = /*#__PURE__*/new WeakMap();
var _applyLayoutStyles = /*#__PURE__*/new WeakSet();
var _hoverTweens = /*#__PURE__*/new WeakMap();
var _startHoverAnimation = /*#__PURE__*/new WeakSet();
var _endHoverAnimation = /*#__PURE__*/new WeakSet();
var _resetLettersToAnchors = /*#__PURE__*/new WeakSet();
var _updateMetrics = /*#__PURE__*/new WeakSet();
var _adjustLayoutDimensions = /*#__PURE__*/new WeakSet();
var _startPressEffect = /*#__PURE__*/new WeakSet();
var _endPressEffect = /*#__PURE__*/new WeakSet();
var _cancelPressEffect = /*#__PURE__*/new WeakSet();
var FancyButtonElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(FancyButtonElement, _HTMLElement);
  function FancyButtonElement() {
    var _this;
    _classCallCheck(this, FancyButtonElement);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, FancyButtonElement, [].concat(args));
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _cancelPressEffect);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _endPressEffect);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _startPressEffect);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _adjustLayoutDimensions);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _updateMetrics);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _resetLettersToAnchors);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _endHoverAnimation);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _startHoverAnimation);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _applyLayoutStyles);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _initializeTweens);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _prepareLabelLayers);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _hydrateStructure);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _label, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _link, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _usingPointerEvents, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _placeholder, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _letterLayer, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _letters, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _placeholderLetters, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _letterAnchors, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _letterSizes, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _placeholderRect, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _containerRect, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _pressTimeline, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _releaseTimeline, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _hoverAnimation, {
      writable: true,
      value: null
    });
    // Fine-tune the hover animation feel here
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _config, {
      writable: true,
      value: {
        waveHeight: 15,
        // How high the letters jump (positive is up)
        staggerAmount: 0.05,
        // Delay cascade between each letter
        duration: 0.4 // Base animation duration
      }
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _handlePointerEnter, {
      writable: true,
      value: function value(event) {
        _classPrivateMethodGet(_assertThisInitialized(_this), _startHoverAnimation, _startHoverAnimation2).call(_assertThisInitialized(_this));
      }
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _handlePointerDown, {
      writable: true,
      value: function value(event) {
        _classPrivateMethodGet(_assertThisInitialized(_this), _startPressEffect, _startPressEffect2).call(_assertThisInitialized(_this));
      }
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _handlePointerLeave, {
      writable: true,
      value: function value() {
        _classPrivateMethodGet(_assertThisInitialized(_this), _endHoverAnimation, _endHoverAnimation2).call(_assertThisInitialized(_this));
        _classPrivateMethodGet(_assertThisInitialized(_this), _cancelPressEffect, _cancelPressEffect2).call(_assertThisInitialized(_this));
      }
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _handlePointerUp, {
      writable: true,
      value: function value(event) {
        _classPrivateMethodGet(_assertThisInitialized(_this), _endPressEffect, _endPressEffect2).call(_assertThisInitialized(_this), true);
      }
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _handleTouchStart, {
      writable: true,
      value: function value(event) {
        if (!event.touches || event.touches.length === 0) return;
        _classPrivateMethodGet(_assertThisInitialized(_this), _startHoverAnimation, _startHoverAnimation2).call(_assertThisInitialized(_this));
        _classPrivateMethodGet(_assertThisInitialized(_this), _startPressEffect, _startPressEffect2).call(_assertThisInitialized(_this));
      }
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _handleTouchEnd, {
      writable: true,
      value: function value() {
        _classPrivateMethodGet(_assertThisInitialized(_this), _endHoverAnimation, _endHoverAnimation2).call(_assertThisInitialized(_this));
        _classPrivateMethodGet(_assertThisInitialized(_this), _endPressEffect, _endPressEffect2).call(_assertThisInitialized(_this), true);
      }
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _handleResize, {
      writable: true,
      value: function value() {
        _classPrivateMethodGet(_assertThisInitialized(_this), _updateMetrics, _updateMetrics2).call(_assertThisInitialized(_this));
        _classPrivateMethodGet(_assertThisInitialized(_this), _adjustLayoutDimensions, _adjustLayoutDimensions2).call(_assertThisInitialized(_this));
        _classPrivateMethodGet(_assertThisInitialized(_this), _resetLettersToAnchors, _resetLettersToAnchors2).call(_assertThisInitialized(_this));
      }
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _hoverTweens, {
      writable: true,
      value: []
    });
    return _this;
  }
  _createClass(FancyButtonElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      _classPrivateMethodGet(this, _hydrateStructure, _hydrateStructure2).call(this);
      if (!_classPrivateFieldGet(this, _link) || !_classPrivateFieldGet(this, _label) && !_classPrivateFieldGet(this, _letters).length) {
        return;
      }
      _classPrivateFieldSet(this, _usingPointerEvents, typeof window !== "undefined" && window.PointerEvent !== undefined);
      if (getComputedStyle(this).display === "inline") {
        this.style.display = "block";
      }
      this.style.touchAction = this.style.touchAction || "none";

      // Pointer events should pass through the label so the link remains clickable
      if (_classPrivateFieldGet(this, _label)) {
        _classPrivateFieldGet(this, _label).style.pointerEvents = "none";
      }
      _classPrivateMethodGet(this, _applyLayoutStyles, _applyLayoutStyles2).call(this);
      _classPrivateMethodGet(this, _updateMetrics, _updateMetrics2).call(this);
      _classPrivateMethodGet(this, _adjustLayoutDimensions, _adjustLayoutDimensions2).call(this);
      _classPrivateMethodGet(this, _initializeTweens, _initializeTweens2).call(this);
      if (_classPrivateFieldGet(this, _usingPointerEvents)) {
        this.addEventListener("pointerenter", _classPrivateFieldGet(this, _handlePointerEnter));
        this.addEventListener("pointerdown", _classPrivateFieldGet(this, _handlePointerDown));
        this.addEventListener("pointerleave", _classPrivateFieldGet(this, _handlePointerLeave));
        this.addEventListener("pointercancel", _classPrivateFieldGet(this, _handlePointerUp));
        this.addEventListener("pointerup", _classPrivateFieldGet(this, _handlePointerUp));
      } else {
        this.addEventListener("mouseenter", _classPrivateFieldGet(this, _handlePointerEnter));
        this.addEventListener("mouseleave", _classPrivateFieldGet(this, _handlePointerLeave));
        this.addEventListener("touchstart", _classPrivateFieldGet(this, _handleTouchStart), {
          passive: false
        });
        this.addEventListener("touchend", _classPrivateFieldGet(this, _handleTouchEnd));
        this.addEventListener("touchcancel", _classPrivateFieldGet(this, _handleTouchEnd));
      }
      window.addEventListener("resize", _classPrivateFieldGet(this, _handleResize));
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      if (_classPrivateFieldGet(this, _usingPointerEvents)) {
        this.removeEventListener("pointerenter", _classPrivateFieldGet(this, _handlePointerEnter));
        this.removeEventListener("pointerdown", _classPrivateFieldGet(this, _handlePointerDown));
        this.removeEventListener("pointerleave", _classPrivateFieldGet(this, _handlePointerLeave));
        this.removeEventListener("pointercancel", _classPrivateFieldGet(this, _handlePointerUp));
        this.removeEventListener("pointerup", _classPrivateFieldGet(this, _handlePointerUp));
      } else {
        this.removeEventListener("mouseenter", _classPrivateFieldGet(this, _handlePointerEnter));
        this.removeEventListener("mouseleave", _classPrivateFieldGet(this, _handlePointerLeave));
        this.removeEventListener("touchstart", _classPrivateFieldGet(this, _handleTouchStart));
        this.removeEventListener("touchend", _classPrivateFieldGet(this, _handleTouchEnd));
        this.removeEventListener("touchcancel", _classPrivateFieldGet(this, _handleTouchEnd));
      }
      window.removeEventListener("resize", _classPrivateFieldGet(this, _handleResize));
      _classPrivateMethodGet(this, _cancelPressEffect, _cancelPressEffect2).call(this, true);
    }
  }]);
  return FancyButtonElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
function _hydrateStructure2() {
  _classPrivateFieldSet(this, _link, this.querySelector("a"));
  if (!_classPrivateFieldGet(this, _link)) {
    var href = this.dataset.href;
    if (!href) {
      return;
    }
    _classPrivateFieldSet(this, _link, document.createElement("a"));
    _classPrivateFieldGet(this, _link).href = href;
    _classPrivateFieldGet(this, _link).classList.add("block", "h-full", "w-full", "relative");
    this.appendChild(_classPrivateFieldGet(this, _link));
  }
  var fancyLettersContainer = this.querySelector("[data-fancy-letters]");
  if (fancyLettersContainer) {
    _classPrivateFieldSet(this, _placeholder, fancyLettersContainer);
    _classPrivateFieldSet(this, _letterLayer, fancyLettersContainer);
    _classPrivateFieldSet(this, _letters, Array.from(fancyLettersContainer.children));
    return;
  }
  _classPrivateFieldSet(this, _label, this.querySelector("[data-fancy-label]") || this.querySelector("span, h2"));
  if (!_classPrivateFieldGet(this, _label)) {
    _classPrivateFieldSet(this, _label, document.createElement("span"));
    _classPrivateFieldGet(this, _label).dataset.fancyLabel = "";
    _classPrivateFieldGet(this, _label).textContent = this.dataset.label || "";
    _classPrivateFieldGet(this, _link).appendChild(_classPrivateFieldGet(this, _label));
  } else if (!_classPrivateFieldGet(this, _label).dataset.fancyLabel) {
    _classPrivateFieldGet(this, _label).dataset.fancyLabel = "";
  }
  _classPrivateMethodGet(this, _prepareLabelLayers, _prepareLabelLayers2).call(this);
}
function _prepareLabelLayers2() {
  var _classPrivateFieldGet3,
    _this2 = this;
  if (!_classPrivateFieldGet(this, _label)) return;
  var originalText = (_classPrivateFieldGet3 = _classPrivateFieldGet(this, _label).textContent) !== null && _classPrivateFieldGet3 !== void 0 ? _classPrivateFieldGet3 : "";
  _classPrivateFieldGet(this, _label).innerHTML = "";
  _classPrivateFieldGet(this, _label).classList.add("relative", "inline-block");
  _classPrivateFieldGet(this, _label).style.position = "absolute";
  _classPrivateFieldGet(this, _label).style.left = "0";
  _classPrivateFieldGet(this, _label).style.top = "0";
  _classPrivateFieldGet(this, _label).style.width = "100%";
  _classPrivateFieldGet(this, _label).style.height = "100%";
  _classPrivateFieldGet(this, _label).style.display = "flex";
  _classPrivateFieldGet(this, _label).style.alignItems = "center";
  _classPrivateFieldGet(this, _label).style.justifyContent = "center";
  _classPrivateFieldGet(this, _label).setAttribute("aria-label", originalText.trim());
  _classPrivateFieldSet(this, _placeholder, document.createElement("span"));
  _classPrivateFieldGet(this, _placeholder).dataset.fancyPlaceholder = "";
  _classPrivateFieldGet(this, _placeholder).setAttribute("aria-hidden", "true");
  _classPrivateFieldGet(this, _placeholder).style.visibility = "hidden";
  _classPrivateFieldGet(this, _placeholder).style.pointerEvents = "none";
  _classPrivateFieldGet(this, _placeholder).style.display = "inline-block";
  _classPrivateFieldGet(this, _placeholder).style.whiteSpace = "pre";
  _classPrivateFieldGet(this, _label).appendChild(_classPrivateFieldGet(this, _placeholder));
  _classPrivateFieldSet(this, _letterLayer, document.createElement("span"));
  _classPrivateFieldGet(this, _letterLayer).dataset.fancyLayer = "";
  _classPrivateFieldGet(this, _letterLayer).style.position = "absolute";
  _classPrivateFieldGet(this, _letterLayer).style.left = "0";
  _classPrivateFieldGet(this, _letterLayer).style.top = "0";
  _classPrivateFieldGet(this, _letterLayer).style.display = "block";
  _classPrivateFieldGet(this, _letterLayer).style.whiteSpace = "pre";
  _classPrivateFieldGet(this, _letterLayer).style.pointerEvents = "none";
  _classPrivateFieldGet(this, _letterLayer).style.color = "inherit";
  _classPrivateFieldGet(this, _label).appendChild(_classPrivateFieldGet(this, _letterLayer));
  _classPrivateFieldSet(this, _letters, []);
  _classPrivateFieldSet(this, _placeholderLetters, []);
  var characters = _toConsumableArray(originalText);
  characters.forEach(function (_char) {
    var safeChar = _char === " " ? "\xA0" : _char;
    var placeholderLetter = document.createElement("span");
    placeholderLetter.dataset.fancyPlaceholderLetter = "";
    placeholderLetter.textContent = safeChar;
    placeholderLetter.style.display = "inline-block";
    placeholderLetter.style.whiteSpace = "pre";
    _classPrivateFieldGet(_this2, _placeholder).appendChild(placeholderLetter);
    _classPrivateFieldGet(_this2, _placeholderLetters).push(placeholderLetter);
    var interactiveLetter = document.createElement("span");
    interactiveLetter.dataset.fancyLetter = "";
    interactiveLetter.textContent = safeChar;
    interactiveLetter.style.position = "absolute";
    interactiveLetter.style.display = "inline-block";
    interactiveLetter.style.whiteSpace = "pre";
    interactiveLetter.style.pointerEvents = "none";
    interactiveLetter.style.willChange = "transform";
    interactiveLetter.style.transformOrigin = "50% 50%";
    _classPrivateFieldGet(_this2, _letterLayer).appendChild(interactiveLetter);
    _classPrivateFieldGet(_this2, _letters).push(interactiveLetter);
  });
  if (!_classPrivateFieldGet(this, _letters).length) {
    var fallback = document.createElement("span");
    fallback.dataset.fancyLetter = "";
    fallback.textContent = originalText || "";
    fallback.style.position = "absolute";
    fallback.style.left = "0";
    fallback.style.top = "0";
    fallback.style.display = "inline-block";
    fallback.style.whiteSpace = "pre";
    fallback.style.pointerEvents = "none";
    _classPrivateFieldGet(this, _letterLayer).appendChild(fallback);
    _classPrivateFieldGet(this, _letters).push(fallback);
  }
}
function _initializeTweens2() {
  var _this3 = this;
  if (!_classPrivateFieldGet(this, _letters).length) return;
  if (!_classPrivateFieldGet(this, _letterAnchors).length) {
    _classPrivateMethodGet(this, _updateMetrics, _updateMetrics2).call(this);
  }
  _classPrivateFieldGet(this, _letters).forEach(function (letter, index) {
    var anchor = _classPrivateFieldGet(_this3, _letterAnchors)[index] || {
      x: 0,
      y: 0
    };
    gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.set(letter, {
      x: anchor.x,
      y: anchor.y,
      transformOrigin: "50% 100%"
    });
  });
}
function _applyLayoutStyles2() {
  if (!_classPrivateFieldGet(this, _link) || !_classPrivateFieldGet(this, _label) && !_classPrivateFieldGet(this, _letters).length) return;
  this.style.display = this.style.display || "block";
  this.style.position = this.style.position || "relative";
  this.style.overflow = this.style.overflow || "hidden";
  _classPrivateFieldGet(this, _link).style.position = "relative";
  _classPrivateFieldGet(this, _link).style.display = "flex";
  _classPrivateFieldGet(this, _link).style.alignItems = "center";
  _classPrivateFieldGet(this, _link).style.justifyContent = "center";
  _classPrivateFieldGet(this, _link).style.width = "100%";
  _classPrivateFieldGet(this, _link).style.height = "100%";
  _classPrivateFieldGet(this, _link).style.overflow = "hidden";
  if (_classPrivateFieldGet(this, _label)) {
    _classPrivateFieldGet(this, _label).style.position = "absolute";
    _classPrivateFieldGet(this, _label).style.left = "0";
    _classPrivateFieldGet(this, _label).style.top = "0";
    _classPrivateFieldGet(this, _label).style.width = "100%";
    _classPrivateFieldGet(this, _label).style.height = "100%";
    _classPrivateFieldGet(this, _label).style.display = "flex";
    _classPrivateFieldGet(this, _label).style.alignItems = "center";
    _classPrivateFieldGet(this, _label).style.justifyContent = "center";
  }
}
function _startHoverAnimation2() {
  var _this4 = this;
  if (_classPrivateFieldGet(this, _hoverAnimation)) {
    _classPrivateFieldGet(this, _hoverAnimation).kill();
  }
  _classPrivateFieldGet(this, _hoverTweens).forEach(function (t) {
    return t.kill();
  });
  _classPrivateFieldSet(this, _hoverTweens, []);

  // Ensure starting from anchors before animating to avoid jumping
  _classPrivateMethodGet(this, _resetLettersToAnchors, _resetLettersToAnchors2).call(this, {
    immediate: true
  });

  // Expand up and bounce down
  _classPrivateFieldGet(this, _letters).forEach(function (letter, index) {
    var letterTl = gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.timeline({
      delay: index * _classPrivateFieldGet(_this4, _config).staggerAmount
    });

    // Calculate jump based on the config.waveHeight.
    // We add a random factor so it feels organic, not perfectly uniform.
    var jumpOffset = gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.utils.random(_classPrivateFieldGet(_this4, _config).waveHeight * 0.5, _classPrivateFieldGet(_this4, _config).waveHeight);
    // Subtract offset to move visually upwards within DOM coordinates
    var targetY = _classPrivateFieldGet(_this4, _letterAnchors)[index].y - jumpOffset;

    // Pop upward
    letterTl.to(letter, {
      y: targetY,
      rotationZ: function rotationZ() {
        return gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.utils.random(-30, 30);
      },
      scale: function scale() {
        return gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.utils.random(1.1, 1.3);
      },
      color: "#b16286",
      // High contrast accent color
      fill: "#b16286",
      // Used for SVG paths
      duration: _classPrivateFieldGet(_this4, _config).duration * 0.5,
      // Fast pop-up
      ease: "power2.out"
    });

    // Fall back to original resting position
    letterTl.to(letter, {
      y: function y() {
        return _classPrivateFieldGet(_this4, _letterAnchors)[index].y;
      },
      rotationZ: 0,
      scale: 1,
      color: "inherit",
      fill: "",
      duration: _classPrivateFieldGet(_this4, _config).duration * 1.5,
      // Slower fall with bounce
      ease: "bounce.out"
    });
    _classPrivateFieldGet(_this4, _hoverTweens).push(letterTl);
  });
}
function _endHoverAnimation2() {
  var _this5 = this;
  if (_classPrivateFieldGet(this, _hoverAnimation)) {
    _classPrivateFieldGet(this, _hoverAnimation).kill();
    _classPrivateFieldSet(this, _hoverAnimation, null);
  }
  _classPrivateFieldGet(this, _hoverTweens).forEach(function (t) {
    return t.kill();
  });
  _classPrivateFieldSet(this, _hoverTweens, []);
  gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.to(_classPrivateFieldGet(this, _letters), {
    y: function y(index) {
      var _classPrivateFieldGet4;
      return ((_classPrivateFieldGet4 = _classPrivateFieldGet(_this5, _letterAnchors)[index]) === null || _classPrivateFieldGet4 === void 0 ? void 0 : _classPrivateFieldGet4.y) || 0;
    },
    rotationZ: 0,
    scale: 1,
    color: "inherit",
    fill: "",
    duration: 0.5,
    ease: "elastic.out(1, 0.4)"
  });
}
function _resetLettersToAnchors2() {
  var _this6 = this;
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  if (!_classPrivateFieldGet(this, _letters).length) return;
  _classPrivateFieldGet(this, _letters).forEach(function (letter, index) {
    var anchor = _classPrivateFieldGet(_this6, _letterAnchors)[index] || {
      x: 0,
      y: 0
    };
    if (options.immediate) {
      gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.set(letter, {
        x: anchor.x,
        y: anchor.y,
        rotationZ: 0
      });
    } else {
      gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.to(letter, {
        x: anchor.x,
        y: anchor.y,
        rotationZ: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  });
}
function _updateMetrics2() {
  var _this7 = this;
  if (!_classPrivateFieldGet(this, _placeholder) || !_classPrivateFieldGet(this, _link)) return;
  _classPrivateFieldSet(this, _containerRect, _classPrivateFieldGet(this, _link).getBoundingClientRect());
  _classPrivateFieldSet(this, _placeholderRect, _classPrivateFieldGet(this, _placeholder).getBoundingClientRect());
  if (_classPrivateFieldGet(this, _letterLayer) && _classPrivateFieldGet(this, _containerRect)) {
    _classPrivateFieldGet(this, _letterLayer).style.width = "".concat(_classPrivateFieldGet(this, _containerRect).width, "px");
    _classPrivateFieldGet(this, _letterLayer).style.height = "".concat(_classPrivateFieldGet(this, _containerRect).height, "px");
  }
  _classPrivateFieldSet(this, _letterAnchors, []);
  _classPrivateFieldSet(this, _letterSizes, []);
  var offsetX = _classPrivateFieldGet(this, _placeholderRect).left - _classPrivateFieldGet(this, _containerRect).left;
  var offsetY = _classPrivateFieldGet(this, _placeholderRect).top - _classPrivateFieldGet(this, _containerRect).top;
  if (_classPrivateFieldGet(this, _placeholderLetters).length) {
    _classPrivateFieldGet(this, _placeholderLetters).forEach(function (placeholderLetter, index) {
      var rect = placeholderLetter.getBoundingClientRect();
      _classPrivateFieldGet(_this7, _letterAnchors)[index] = {
        x: offsetX + (rect.left - _classPrivateFieldGet(_this7, _placeholderRect).left),
        y: offsetY + (rect.top - _classPrivateFieldGet(_this7, _placeholderRect).top)
      };
      _classPrivateFieldGet(_this7, _letterSizes)[index] = {
        width: rect.width,
        height: rect.height
      };
    });
  } else if (this.querySelector("[data-fancy-letters]")) {
    // For SVG SVGs or manual opt-ins, their layout origin is naturally `{ x: 0, y: 0 }`
    _classPrivateFieldGet(this, _letters).forEach(function (l, index) {
      _classPrivateFieldGet(_this7, _letterAnchors)[index] = {
        x: 0,
        y: 0
      };
    });
  } else {
    var rect = _classPrivateFieldGet(this, _placeholderRect);
    _classPrivateFieldGet(this, _letterAnchors)[0] = {
      x: offsetX,
      y: offsetY
    };
    _classPrivateFieldGet(this, _letterSizes)[0] = {
      width: rect.width,
      height: rect.height
    };
  }
}
function _adjustLayoutDimensions2() {
  if (!_classPrivateFieldGet(this, _placeholder) || !_classPrivateFieldGet(this, _link)) return;
  var linkStyles = getComputedStyle(_classPrivateFieldGet(this, _link));
  var paddingX = parseFloat(linkStyles.paddingLeft) + parseFloat(linkStyles.paddingRight);
  var paddingY = parseFloat(linkStyles.paddingTop) + parseFloat(linkStyles.paddingBottom);
  var _classPrivateFieldGet5 = _classPrivateFieldGet(this, _placeholder).getBoundingClientRect(),
    width = _classPrivateFieldGet5.width,
    height = _classPrivateFieldGet5.height;
  var totalWidth = width + paddingX;
  var totalHeight = height + paddingY;
  this.style.minHeight = "".concat(totalHeight, "px");
  _classPrivateFieldGet(this, _link).style.minHeight = "".concat(totalHeight, "px");
  _classPrivateFieldGet(this, _link).style.minWidth = "".concat(totalWidth, "px");
  if (_classPrivateFieldGet(this, _label)) {
    _classPrivateFieldGet(this, _label).style.minHeight = "".concat(height, "px");
    _classPrivateFieldGet(this, _label).style.minWidth = "".concat(width, "px");
  }
}
function _startPressEffect2() {
  if (!_classPrivateFieldGet(this, _letters).length) return;
  if (_classPrivateFieldGet(this, _releaseTimeline)) {
    _classPrivateFieldGet(this, _releaseTimeline).kill();
    _classPrivateFieldSet(this, _releaseTimeline, null);
  }
  if (_classPrivateFieldGet(this, _pressTimeline)) {
    _classPrivateFieldGet(this, _pressTimeline).kill();
  }
  var tl = gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.timeline();
  tl.to(_classPrivateFieldGet(this, _letters), {
    scale: 0.7,
    duration: 0.12,
    ease: "power2.out"
  });
  tl.to(_classPrivateFieldGet(this, _letters), {
    scale: 0.92,
    duration: 0.08,
    ease: "power1.out"
  });
  _classPrivateFieldSet(this, _pressTimeline, tl);
  gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.to(_classPrivateFieldGet(this, _link), {
    backgroundColor: "rgba(0,0,0,0.05)",
    duration: 0.12,
    ease: "power2.out"
  });
}
function _endPressEffect2() {
  var _this8 = this;
  var withRelease = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  if (!withRelease) {
    _classPrivateMethodGet(this, _cancelPressEffect, _cancelPressEffect2).call(this);
    return;
  }
  if (_classPrivateFieldGet(this, _pressTimeline)) {
    _classPrivateFieldGet(this, _pressTimeline).kill();
    _classPrivateFieldSet(this, _pressTimeline, null);
  }
  if (_classPrivateFieldGet(this, _releaseTimeline)) {
    _classPrivateFieldGet(this, _releaseTimeline).kill();
  }
  var tl = gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.timeline({
    onComplete: function onComplete() {
      _classPrivateFieldSet(_this8, _releaseTimeline, null);
    }
  });
  tl.to(_classPrivateFieldGet(this, _letters), {
    scale: 1.2,
    duration: 0.1,
    ease: "back.out(2)"
  });
  tl.to(_classPrivateFieldGet(this, _letters), {
    scale: 1,
    duration: 0.2,
    ease: "power3.out"
  });
  _classPrivateFieldSet(this, _releaseTimeline, tl);
  gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.to(_classPrivateFieldGet(this, _link), {
    backgroundColor: "rgba(0,0,0,0)",
    duration: 0.24,
    ease: "power2.out"
  });
}
function _cancelPressEffect2() {
  var silent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (_classPrivateFieldGet(this, _pressTimeline)) {
    _classPrivateFieldGet(this, _pressTimeline).kill();
    _classPrivateFieldSet(this, _pressTimeline, null);
  }
  if (_classPrivateFieldGet(this, _releaseTimeline)) {
    _classPrivateFieldGet(this, _releaseTimeline).kill();
    _classPrivateFieldSet(this, _releaseTimeline, null);
  }
  gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.to(_classPrivateFieldGet(this, _letters), {
    scale: 1,
    duration: silent ? 0 : 0.12,
    ease: "power2.out"
  });
  gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.to(_classPrivateFieldGet(this, _link), {
    backgroundColor: "rgba(0,0,0,0)",
    duration: silent ? 0 : 0.12,
    ease: "power2.out"
  });
}
if (!customElements.get("fancy-button-element")) {
  customElements.define("fancy-button-element", FancyButtonElement);
}

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
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gsap */ "./node_modules/gsap/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet2(e, t) { var r = _classPrivateFieldGet(t, e); return _classApplyDescriptorGet(e, r); }
function _classApplyDescriptorGet(e, t) { return t.get ? t.get.call(e) : t.value; }
function _classPrivateFieldSet(e, t, r) { var s = _classPrivateFieldGet(t, e); return _classApplyDescriptorSet(e, s, r), r; }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
function _classApplyDescriptorSet(e, t, l) { if (t.set) t.set.call(e, l);else { if (!t.writable) throw new TypeError("attempted to set read only private field"); t.value = l; } }

var _time = /*#__PURE__*/new WeakMap();
var _level = /*#__PURE__*/new WeakMap();
var _hintCount = /*#__PURE__*/new WeakMap();
var _hintEvery = /*#__PURE__*/new WeakMap();
var _hintInterval = /*#__PURE__*/new WeakMap();
var _held = /*#__PURE__*/new WeakMap();
var _scoring = /*#__PURE__*/new WeakMap();
var _animating = /*#__PURE__*/new WeakMap();
var _rngX = /*#__PURE__*/new WeakMap();
var _rngY = /*#__PURE__*/new WeakMap();
var _targetPosition = /*#__PURE__*/new WeakMap();
var _emoji = /*#__PURE__*/new WeakMap();
var _disableRotateEmoji = /*#__PURE__*/new WeakMap();
var _glimmerHintTimeout = /*#__PURE__*/new WeakMap();
var _treasureElement = /*#__PURE__*/new WeakMap();
var _gemOverlay = /*#__PURE__*/new WeakMap();
var _levelTwoTimeline = /*#__PURE__*/new WeakMap();
var _isAnimatingReturn = /*#__PURE__*/new WeakMap();
var _dragHintText = /*#__PURE__*/new WeakMap();
var _globalDragOverHandler = /*#__PURE__*/new WeakMap();
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
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _hintEvery, {
      writable: true,
      value: 4000
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
      value: document.createElement('div')
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _disableRotateEmoji, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _glimmerHintTimeout, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _treasureElement, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _gemOverlay, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _levelTwoTimeline, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _isAnimatingReturn, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _dragHintText, {
      writable: true,
      value: null
    });
    // Global dragover handler to prevent the browser from doing the 300ms 
    // "ghost snap-back" animation on unhandled drops, which delays dragend.
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _globalDragOverHandler, {
      writable: true,
      value: function value(e) {
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'none';
        }
      }
    });
    _defineProperty(_assertThisInitialized(_this), "loadEventListeners", function () {
      _this.addEventListener('mousedown', _this.handleMouseDown);
      _this.addEventListener('mouseup', _this.handleMouseUp);
      _this.addEventListener('touchcancel', _this.handleMouseUp);
      _this.addEventListener('dragstart', _this.handleDragStart);
      _this.addEventListener('touchstart', _this.handleDragStart, {
        passive: true
      });
      _this.addEventListener('dragend', _this.handleDragEnd);
      _this.addEventListener('touchend', _this.handleDragEnd, {
        passive: true
      });
      _this.addEventListener('drag', _this.handleDrag);
      _this.addEventListener('touchmove', _this.handleDrag, {
        passive: true
      });
      document.addEventListener('dragenter', _classPrivateFieldGet2(_assertThisInitialized(_this), _globalDragOverHandler));
      document.addEventListener('dragover', _classPrivateFieldGet2(_assertThisInitialized(_this), _globalDragOverHandler));
      document.addEventListener('drop', _classPrivateFieldGet2(_assertThisInitialized(_this), _globalDragOverHandler));
    });
    _defineProperty(_assertThisInitialized(_this), "removeEventListeners", function () {
      clearInterval(_classPrivateFieldGet2(_assertThisInitialized(_this), _hintInterval));
      _this.removeEventListener('mousedown', _this.handleMouseDown);
      _this.removeEventListener('mouseup', _this.handleMouseUp);
      _this.removeEventListener('dragstart', _this.handleDragStart);
      _this.removeEventListener('dragend', _this.handleDragEnd);
      _this.removeEventListener('drag', _this.handleDrag);
      _this.removeEventListener('touchstart', _this.handleDragStart);
      _this.removeEventListener('touchend', _this.handleDragEnd);
      _this.removeEventListener('touchmove', _this.handleDrag);
      document.removeEventListener('dragenter', _classPrivateFieldGet2(_assertThisInitialized(_this), _globalDragOverHandler));
      document.removeEventListener('dragover', _classPrivateFieldGet2(_assertThisInitialized(_this), _globalDragOverHandler));
      document.removeEventListener('drop', _classPrivateFieldGet2(_assertThisInitialized(_this), _globalDragOverHandler));
    });
    _defineProperty(_assertThisInitialized(_this), "handleMouseDown", function (e) {
      var target = e.target;
      target.setAttribute('draggable', true);
      target.classList.replace('cursor-pointer', 'cursor-grab');
      target.classList.add('shadow-outer', 'text-gruvbox-gray');
    });
    _defineProperty(_assertThisInitialized(_this), "handleMouseUp", function (e) {
      var target = e.target;
      target.classList.remove('text-gruvbox-gray', 'shadow-outer', 'cursor-grab', 'cursor-grabbing', 'cursor-progress');
      target.classList.add('cursor-pointer');
      target.setAttribute('draggable', false);
    });
    _defineProperty(_assertThisInitialized(_this), "handleDragStart", function (e) {
      var target = e.target;
      var mainHeader = document.getElementById('main_header');
      var footer = document.getElementById('footer');
      var body = document.querySelector('body');
      var mainHeaderHeight = mainHeader ? mainHeader.offsetHeight : 0;
      var footerHeight = footer ? footer.offsetHeight : 0;
      var padding = 15;
      var maxHeight = window.innerHeight - footerHeight - padding;
      var minHeight = mainHeaderHeight + padding;
      clearInterval(_classPrivateFieldGet2(_assertThisInitialized(_this), _hintInterval));
      target.textContent = "\xA0\xA0\xA0\xA0\xA0\xA0";
      _classPrivateFieldSet(_assertThisInitialized(_this), _rngX, Math.random() * (window.innerWidth - padding - padding) + padding);
      _classPrivateFieldSet(_assertThisInitialized(_this), _rngY, Math.random() * (maxHeight - minHeight) + minHeight);
      _this.levelUp();
      gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.killTweensOf(_classPrivateFieldGet2(_assertThisInitialized(_this), _emoji));
      gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.set(_classPrivateFieldGet2(_assertThisInitialized(_this), _emoji), {
        clearProps: "all"
      });
      _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).innerHTML = '🧭';
      _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).className = 'absolute z-50 text-5xl pointer-events-none m-0';
      _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).style.position = 'absolute';
      var startX = e.clientX !== undefined ? e.clientX : e.touches && e.touches.length > 0 ? e.touches[0].clientX : 0;
      var startY = e.clientY !== undefined ? e.clientY : e.touches && e.touches.length > 0 ? e.touches[0].clientY : 0;
      _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).style.left = "".concat(startX - 45, "px");
      _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).style.top = "".concat(startY - 45, "px");
      _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).id = 'emoji';
      body.appendChild(_classPrivateFieldGet2(_assertThisInitialized(_this), _emoji));
      target.classList.remove('cursor-grab', 'cursor-pointer', 'shadow-outer');
      target.classList.add('cursor-grabbing');
      _classPrivateFieldSet(_assertThisInitialized(_this), _dragHintText, document.getElementById('drag-hint-text'));
      if (_classPrivateFieldGet2(_assertThisInitialized(_this), _dragHintText)) {
        _classPrivateFieldGet2(_assertThisInitialized(_this), _dragHintText).textContent = '❌ marks the spot';
      }
    });
    _defineProperty(_assertThisInitialized(_this), "handleDrag", function (e) {
      var target = e.target;
      var clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
      var clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
      if (clientX === 0 && clientY === 0) {
        // Start the return animation identically to when the mouse is let go
        if (!_classPrivateFieldGet2(_assertThisInitialized(_this), _isAnimatingReturn)) {
          _this.executeReturnAnimation(target, 'drag(0,0)');
        }
        return;
      }
      var emojiOffset = 45;
      _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).style.left = "".concat(clientX - emojiOffset, "px");
      _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).style.top = "".concat(clientY - emojiOffset, "px");
      var distanceToTreasure = _this.rotateKeyAndReturnDistanceToTarget(clientX, clientY);
      if (_this.isInTarget(clientX, clientY)) {
        if (!_this._wasInTarget) {
          _this._wasInTarget = true;
        }
        _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).style.transform = 'none';
        target.classList.remove('cursor-grabbing');
        target.classList.add('cursor-progress');
        if (!_classPrivateFieldGet2(_assertThisInitialized(_this), _held)) {
          var duration = parseInt(_this.dataset.holdDuration) || 1000;
          _classPrivateFieldSet(_assertThisInitialized(_this), _held, Date.now() + duration);
        } else if (_classPrivateFieldGet2(_assertThisInitialized(_this), _held) < Date.now()) {
          target.classList.remove('cursor-progress');
          _this.levelUp();
          if (_classPrivateFieldGet2(_assertThisInitialized(_this), _level) == 2) {
            target.classList.add('cursor-grabbing');
            _this.animateLevelTwo();
          } else {
            _this.animateLevelThree();
          }
        } else {
          _classPrivateFieldGet2(_assertThisInitialized(_this), _level) == 1 ? _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).innerHTML = '⏳' : _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).innerHTML = '🔐';
        }
      } else {
        if (_this._wasInTarget) {
          _this._wasInTarget = false;
        }
        _classPrivateFieldSet(_assertThisInitialized(_this), _held, false);
        if (_this.isInTreasureElement(clientX, clientY)) {
          if (_classPrivateFieldGet2(_assertThisInitialized(_this), _level) < 2) _classPrivateFieldSet(_assertThisInitialized(_this), _disableRotateEmoji, true);
          _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).style.transform = 'none';
          _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).innerHTML = '🔒';
        } else if (!_classPrivateFieldGet2(_assertThisInitialized(_this), _animating)) {
          _classPrivateFieldSet(_assertThisInitialized(_this), _disableRotateEmoji, false);
          _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).innerHTML = _classPrivateFieldGet2(_assertThisInitialized(_this), _level) == 1 ? '🧭' : '🔑';
        }
        target.classList.remove('text-gruvbox-yellow', 'cursor-progress');
        target.classList.add('text-gruvbox-gray', 'cursor-grabbing');
      }
      if (_this.inRangeOfTreasureHintAndOfLevel(distanceToTreasure)) {
        window.dispatchEvent(new CustomEvent('treasureHint', {
          detail: {
            distanceToTreasure: distanceToTreasure
          }
        }));
      }
    });
    _defineProperty(_assertThisInitialized(_this), "handleDragEnd", function (e) {
      var target = e.target;
      if (!_classPrivateFieldGet2(_assertThisInitialized(_this), _isAnimatingReturn)) {
        _this.executeReturnAnimation(target, 'dragend');
      }

      // Reset the animating lock for the next interaction
      _classPrivateFieldSet(_assertThisInitialized(_this), _isAnimatingReturn, false);
    });
    _defineProperty(_assertThisInitialized(_this), "executeReturnAnimation", function (target, sourceEvent) {
      _classPrivateFieldSet(_assertThisInitialized(_this), _isAnimatingReturn, true);
      clearTimeout(_classPrivateFieldGet2(_assertThisInitialized(_this), _glimmerHintTimeout));
      _classPrivateFieldSet(_assertThisInitialized(_this), _glimmerHintTimeout, setTimeout(function () {
        _this.glimmerHint();
      }, _classPrivateFieldGet2(_assertThisInitialized(_this), _hintEvery)));
      var emojiEl = document.getElementById('emoji');
      _classPrivateFieldSet(_assertThisInitialized(_this), _level, 0);
      target.textContent = _this.dataset.content;
      target.classList.remove('text-gruvbox-gray', 'shadow-outer', 'cursor-grab', 'cursor-grabbing', 'cursor-progress');
      target.classList.add('cursor-pointer');
      if (_classPrivateFieldGet2(_assertThisInitialized(_this), _dragHintText)) {
        _classPrivateFieldGet2(_assertThisInitialized(_this), _dragHintText).textContent = 'Drag me!';
      }
      if (emojiEl) {
        // Record where the emoji currently is visually on screen before we swap it
        var emojiRect = emojiEl.getBoundingClientRect();

        // Get the final destination of the inline text
        var rect = target.getBoundingClientRect();

        // Swap the flying emoji out for the actual word
        emojiEl.innerHTML = _this.dataset.content;

        // Optimize the swap to prevent DOM repaint lag. 
        // We manually assign the exact classes it needs instead of copying the target's entire classList
        emojiEl.className = 'absolute z-50 pointer-events-none m-0 text-gruvbox-gray select-none text-lg leading-[3rem] md:text-xl md:leading-[3.5rem] lg:text-2xl lg:leading-[4.5rem]';

        // Instantly snap the element's actual position to the destination using left/top (which are slow to animate)
        emojiEl.style.left = "".concat(rect.left + window.scrollX, "px");
        emojiEl.style.top = "".concat(rect.top + window.scrollY, "px");

        // Hide the actual inline text temporarily so we don't see double
        target.style.opacity = '0';

        // Calculate the delta distance
        var deltaX = emojiRect.left - rect.left;
        var deltaY = emojiRect.top - rect.top;

        // Look up what angle the compass had at the moment it was dropped
        var currentRotation = 0;
        if (emojiEl.style.transform && emojiEl.style.transform.includes('rotate')) {
          var match = emojiEl.style.transform.match(/rotate\(([-\d.]+)deg\)/);
          if (match) currentRotation = parseFloat(match[1]);
        }

        // Magnetically pull the flying text back into the sentence using hardware-accelerated transforms (x/y)
        gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.fromTo(emojiEl, {
          x: deltaX,
          y: deltaY,
          rotation: currentRotation
        }, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.35,
          ease: "power2.out",
          onComplete: function onComplete() {
            if (emojiEl.parentNode) {
              emojiEl.parentNode.removeChild(emojiEl);
            }
            // Restore visibility seamlessly
            target.style.opacity = '1';
          }
        });
      }
    });
    _defineProperty(_assertThisInitialized(_this), "glimmerHint", function () {
      var _this$hintCount, _this$hintCount2;
      var content = _this.dataset.content;
      var duration = 300 / _this.dataset.content.split('').length;
      _this.innerHTML = '';
      _this.classList.remove('cursor-pointer');
      _this.classList.add('select-none');
      _this.removeAttribute('draggable');
      _this.removeEventListener('mousedown', _this.handleMouseDown);
      clearInterval(_classPrivateFieldGet2(_assertThisInitialized(_this), _hintInterval));
      content.split('').forEach(function (letter, index) {
        var offset = index * duration;
        var span = document.createElement('span');
        span.innerText = letter;
        _this.appendChild(span);
        setTimeout(function () {
          if (index > 0 && index < content.length) {
            _this.childNodes[index - 1].classList.remove('text-gruvbox-white');
          }
          span.classList.add('text-gruvbox-white');
        }, offset);
      });
      setTimeout(function () {
        _this.innerText = _this.dataset.content;
        _this.classList.remove('select-none');
        _this.classList.add('cursor-pointer');
        _this.setAttribute('draggable', true);
        _this.addEventListener('mousedown', _this.handleMouseDown);
      }, 300);
      _classPrivateFieldSet(_assertThisInitialized(_this), _hintInterval, setInterval(_this.glimmerHint, _classPrivateFieldGet2(_assertThisInitialized(_this), _hintEvery)));
      _classPrivateFieldSet(_assertThisInitialized(_this), _hintCount, (_this$hintCount = _classPrivateFieldGet2(_assertThisInitialized(_this), _hintCount), _this$hintCount2 = _this$hintCount++, _this$hintCount)), _this$hintCount2;
    });
    _defineProperty(_assertThisInitialized(_this), "rotateKeyAndReturnDistanceToTarget", function (mouseX, mouseY) {
      if (!_classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition)) return;
      var deltaX = _classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition).x + _classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition).width / 2 - mouseX;
      var deltaY = _classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition).y + _classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition).height / 2 - mouseY;
      var distanceToTreasure = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      var theta = Math.atan2(deltaY, deltaX);
      var angle = theta / Math.PI * 180 + (theta > 0 ? 0 : 360);

      // adjusting the initial rotation of the emojis
      var rotate = 0;
      if (!_classPrivateFieldGet2(_assertThisInitialized(_this), _disableRotateEmoji)) {
        if (_classPrivateFieldGet2(_assertThisInitialized(_this), _level) == 1 && !_classPrivateFieldGet2(_assertThisInitialized(_this), _held)) {
          rotate = angle + 45;
        } else if (_classPrivateFieldGet2(_assertThisInitialized(_this), _level) == 2 && !_classPrivateFieldGet2(_assertThisInitialized(_this), _held)) {
          rotate = angle + 225;
        }
        _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).style.transform = "rotate(".concat(rotate, "deg)");
      }
      return distanceToTreasure;
    });
    _defineProperty(_assertThisInitialized(_this), "isInTarget", function (mouseX, mouseY) {
      if (!_classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition)) return;
      return mouseX > _classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition).x && mouseX < _classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition).x + _classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition).width && mouseY > _classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition).y && mouseY < _classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition).y + _classPrivateFieldGet2(_assertThisInitialized(_this), _targetPosition).height;
    });
    _defineProperty(_assertThisInitialized(_this), "isInTreasureElement", function (mouseX, mouseY) {
      if (!_classPrivateFieldGet2(_assertThisInitialized(_this), _treasureElement)) return false;
      var treasureRect = _classPrivateFieldGet2(_assertThisInitialized(_this), _treasureElement).getBoundingClientRect();
      return mouseX > treasureRect.x && mouseX < treasureRect.x + treasureRect.width && mouseY > treasureRect.y && mouseY < treasureRect.y + treasureRect.height;
    });
    _defineProperty(_assertThisInitialized(_this), "animateLevelTwoTryAgain", function () {
      var animation = Animation();
    });
    _defineProperty(_assertThisInitialized(_this), "animateLevelTwo", function () {
      if (_classPrivateFieldGet2(_assertThisInitialized(_this), _animating)) return;
      if (!document.body.contains(_classPrivateFieldGet2(_assertThisInitialized(_this), _emoji))) return;
      _classPrivateFieldSet(_assertThisInitialized(_this), _held, null);
      _classPrivateFieldSet(_assertThisInitialized(_this), _animating, true);
      if (_classPrivateFieldGet2(_assertThisInitialized(_this), _levelTwoTimeline)) {
        _classPrivateFieldGet2(_assertThisInitialized(_this), _levelTwoTimeline).kill();
        _classPrivateFieldSet(_assertThisInitialized(_this), _levelTwoTimeline, null);
      }
      var previousFontClass = null;
      gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.set(_classPrivateFieldGet2(_assertThisInitialized(_this), _emoji), {
        transformOrigin: '50% 50%'
      });
      var cleanup = function cleanup() {
        _classPrivateFieldSet(_assertThisInitialized(_this), _animating, false);
        _classPrivateFieldSet(_assertThisInitialized(_this), _levelTwoTimeline, null);
      };
      var timeline = gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.timeline({
        defaults: {
          ease: 'back.out(1.6)'
        },
        onComplete: cleanup
      });
      _classPrivateFieldSet(_assertThisInitialized(_this), _levelTwoTimeline, timeline);
      var updateEmoji = function updateEmoji(fontSize, emoji) {
        if (!document.body.contains(_classPrivateFieldGet2(_assertThisInitialized(_this), _emoji))) {
          timeline.kill();
          cleanup();
          return;
        }
        if (previousFontClass) {
          _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).classList.remove(previousFontClass);
        }
        _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).classList.add(fontSize);
        previousFontClass = fontSize;
        _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).innerHTML = emoji;
      };
      timeline.call(updateEmoji, ['text-5xl', '⌛']).fromTo(_classPrivateFieldGet2(_assertThisInitialized(_this), _emoji), {
        scale: 1,
        opacity: 1.2
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.30,
        overwrite: 'auto'
      }).call(updateEmoji, ['text-xl', '✨']).fromTo(_classPrivateFieldGet2(_assertThisInitialized(_this), _emoji), {
        scale: 0.15,
        opacity: 0.5
      }, {
        scale: 1.8,
        opacity: 1,
        duration: 0.75,
        overwrite: 'auto'
      }).call(updateEmoji, ['text-5xl', '🔑']).fromTo(_classPrivateFieldGet2(_assertThisInitialized(_this), _emoji), {
        scale: 0.3,
        opacity: 0.6
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.30,
        overwrite: 'auto'
      });
      timeline.play(0);
    });
    _defineProperty(_assertThisInitialized(_this), "animateLevelThree", function () {
      _classPrivateFieldSet(_assertThisInitialized(_this), _animating, true);
      _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).innerHTML = '🔓';
      setTimeout(function () {
        _classPrivateFieldGet2(_assertThisInitialized(_this), _emoji).innerHTML = '🎉';
        _classPrivateFieldSet(_assertThisInitialized(_this), _animating, false);
        _this.analyticsTreasure({
          hintCount: _classPrivateFieldGet2(_assertThisInitialized(_this), _hintCount),
          time: (new Date() - _classPrivateFieldGet2(_assertThisInitialized(_this), _time)) / 1000
        });
      }, 300);
    });
    _defineProperty(_assertThisInitialized(_this), "levelUp", function () {
      var _this$level;
      _classPrivateFieldSet(_assertThisInitialized(_this), _level, (_this$level = _classPrivateFieldGet2(_assertThisInitialized(_this), _level), ++_this$level));
      if (_classPrivateFieldGet2(_assertThisInitialized(_this), _level) === 1) {
        _classPrivateFieldSet(_assertThisInitialized(_this), _targetPosition, {
          x: _classPrivateFieldGet2(_assertThisInitialized(_this), _rngX),
          y: _classPrivateFieldGet2(_assertThisInitialized(_this), _rngY),
          width: 20,
          height: 20
        });
      } else if (_classPrivateFieldGet2(_assertThisInitialized(_this), _treasureElement)) {
        _classPrivateFieldSet(_assertThisInitialized(_this), _targetPosition, _classPrivateFieldGet2(_assertThisInitialized(_this), _treasureElement).getBoundingClientRect());
      } else {
        _classPrivateFieldSet(_assertThisInitialized(_this), _targetPosition, null);
      }
    });
    _defineProperty(_assertThisInitialized(_this), "inRangeOfTreasureHintAndOfLevel", function (distanceToTreasure) {
      return distanceToTreasure <= 400 && _classPrivateFieldGet2(_assertThisInitialized(_this), _level) == 2;
    });
    _defineProperty(_assertThisInitialized(_this), "calculateLocalScore", function (hintCount, solveTimeSeconds) {
      var minScore = 1;
      var hintScale = 0.01;
      var timeScale = 0.01;
      var hintScore = Math.max(1 - hintCount * hintScale, 0);
      var timeScore = Math.max(1 - solveTimeSeconds * timeScale, 0);
      var rawScore = minScore + hintScore + timeScore;
      var finalScore = Math.max(rawScore, minScore);
      return Math.round(finalScore * 1000);
    });
    _defineProperty(_assertThisInitialized(_this), "analyticsTreasure", function (detail) {
      _classPrivateFieldSet(_assertThisInitialized(_this), _animating, false);
      if (!_classPrivateFieldGet2(_assertThisInitialized(_this), _scoring)) {
        var _document$querySelect;
        _classPrivateFieldSet(_assertThisInitialized(_this), _scoring, true);
        _this.removeEventListeners();

        // Calculate score locally and fire the visual gem explosion INSTANTLY 
        // instead of waiting 90ms for the two API network requests to round-trip.
        var localScore = _this.calculateLocalScore(detail.hintCount, detail.time);
        _this.populateGems(localScore);
        var csrfToken = (_document$querySelect = document.querySelector('meta[name="csrf-token"]')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.content;
        var checkUrl = new URL('/puzzle/1/check', window.location.origin);
        fetch(checkUrl.toString(), {
          credentials: 'same-origin'
        }).then(function (response) {
          if (!response.ok) {
            throw new Error("Puzzle check failed (".concat(response.status, ")"));
          }
          return response.json();
        }).then(function (json) {
          if (json.error && json.error === 'session expired') {
            window.location.reload();
            return;
          }
          var solvedUrl = new URL("/puzzle/1/solved/".concat(json.token), window.location.origin);
          return fetch(solvedUrl.toString(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrfToken !== null && csrfToken !== void 0 ? csrfToken : ''
            },
            credentials: 'same-origin',
            body: JSON.stringify(detail)
          }).then(function (response) {
            if (!response.ok) {
              throw new Error("Puzzle solve failed (".concat(response.status, ")"));
            }
            return response.json();
          }).then(function (json) {
            if (json.error) {
              _this.reset();
              console.error(json.error);
              return;
            }

            // Keep the visual gems falling even though we reset the interactive state mechanics 
            _this.reset({
              preserveGems: true
            });
            _this.renderCelebration(json);
          });
        })["catch"](function (error) {
          console.error(error);
          _this.reset();
        });
      }
    });
    _defineProperty(_assertThisInitialized(_this), "renderCelebration", function (result) {
      var lead = document.getElementById('lead');
      if (!lead) {
        return;
      }

      // Gems are now handled instantly; we only render the HTML leaderboard frame here.
      lead.innerHTML = '';
      var leaderboard = document.createElement('div');
      leaderboard.id = 'puzzle-leaderboard';
      lead.appendChild(leaderboard);
      _this.buildLeaderboard(leaderboard, result);
    });
    _defineProperty(_assertThisInitialized(_this), "populateGems", function (score) {
      var content = document.getElementById('content');
      var lead = document.getElementById('lead');
      if (!content || !lead) return;
      _this.stopGemAnimation();
      var gemOverlay = document.getElementById('puzzle-gem-overlay');
      if (!gemOverlay) {
        gemOverlay = document.createElement('div');
        gemOverlay.id = 'puzzle-gem-overlay';
        document.body.appendChild(gemOverlay);
      }
      gemOverlay.innerHTML = '';
      Object.assign(gemOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '9999'
      });
      var leadRect = lead.getBoundingClientRect();
      var gemsProcessed = 0;
      var CHUNK_SIZE = 50;

      // Process gems in batches using requestAnimationFrame 
      // to prevent GSAP from locking the main thread parsing 3,000 tweens synchronously.
      var processChunk = function processChunk() {
        var fragment = document.createDocumentFragment();
        var currentBatch = [];
        var processCount = Math.min(CHUNK_SIZE, score - gemsProcessed);
        for (var i = 0; i < processCount; i++) {
          var gem = document.createElement('span');
          gem.classList.add('puzzle-gem');
          gem.textContent = '💎';
          var sizeRem = 1.3 + Math.random() * 1.2;
          gem.style.fontSize = "".concat(sizeRem, "rem");
          var maxLeft = Math.max(leadRect.width - sizeRem * 16, 0);
          var startX = leadRect.left + Math.random() * maxLeft;
          var startY = -(Math.random() * (window.innerHeight * 0.5) + sizeRem * 16);
          gem.style.left = "".concat(startX, "px");
          gem.style.transform = "translateY(".concat(startY, "px)");
          gem.style.opacity = '1';
          fragment.appendChild(gem);
          currentBatch.push(gem);
        }
        gemOverlay.appendChild(fragment);
        gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.to(currentBatch, {
          y: window.innerHeight + 100,
          duration: function duration() {
            return 1.5 + Math.random() * 2.5;
          },
          delay: function delay() {
            return Math.random() * 2;
          },
          // Keeps visuals chaotic even when batched
          ease: "none",
          onComplete: function onComplete() {
            var target = this.targets()[0];
            if (target) {
              target.remove();
            }
          }
        });
        gemsProcessed += processCount;
        if (gemsProcessed < score) {
          // If there are more gems, defer the next batch to the next frame
          // This keeps the user's browser perfectly smooth while the explosion builds.
          requestAnimationFrame(processChunk);
        }
      };

      // Start processing the very first chunk instantly
      processChunk();
      _classPrivateFieldSet(_assertThisInitialized(_this), _gemOverlay, gemOverlay);
    });
    _defineProperty(_assertThisInitialized(_this), "stopGemAnimation", function () {
      if (_classPrivateFieldGet2(_assertThisInitialized(_this), _gemOverlay)) {
        // Kill any active GSAP tweens on gems if the component is resetting
        var activeGems = _classPrivateFieldGet2(_assertThisInitialized(_this), _gemOverlay).querySelectorAll('.puzzle-gem');
        if (activeGems.length) {
          gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.killTweensOf(activeGems);
          activeGems.forEach(function (gem) {
            return gem.remove();
          });
        }
        _classPrivateFieldGet2(_assertThisInitialized(_this), _gemOverlay).innerHTML = '';
      }
    });
    _defineProperty(_assertThisInitialized(_this), "buildLeaderboard", function (container, result) {
      var _result$score;
      if (!container) {
        return;
      }
      container.classList.add('puzzle-leaderboard');
      var summary = document.createElement('div');
      summary.classList.add('puzzle-leaderboard-summary');
      var scoreLabel = document.createElement('div');
      scoreLabel.classList.add('puzzle-leaderboard-score');
      scoreLabel.textContent = "Score: ".concat((_result$score = result === null || result === void 0 ? void 0 : result.score) !== null && _result$score !== void 0 ? _result$score : 0);
      var rankLabel = document.createElement('div');
      rankLabel.classList.add('puzzle-leaderboard-rank');
      if (result !== null && result !== void 0 && result.rank) {
        rankLabel.textContent = "Current Rank: #".concat(result.rank);
      } else if (result !== null && result !== void 0 && result.totalPlayers) {
        rankLabel.textContent = "Current Rank: #".concat(result.totalPlayers);
      } else {
        rankLabel.textContent = 'Current Rank: #1';
      }
      var population = document.createElement('div');
      population.classList.add('puzzle-leaderboard-population');
      if (result !== null && result !== void 0 && result.totalPlayers) {
        population.textContent = "Across ".concat(result.totalPlayers, " solve").concat(result.totalPlayers === 1 ? '' : 's', ".");
      } else {
        population.textContent = 'You set the first score!';
      }
      summary.appendChild(scoreLabel);
      summary.appendChild(rankLabel);
      summary.appendChild(population);
      container.appendChild(summary);
      if (!Array.isArray(result === null || result === void 0 ? void 0 : result.leaderboard) || result.leaderboard.length === 0) {
        var empty = document.createElement('p');
        empty.classList.add('puzzle-leaderboard-empty');
        empty.textContent = 'No leaderboard data yet. Keep exploring!';
        container.appendChild(empty);
        return;
      }
      var list = document.createElement('ol');
      list.classList.add('puzzle-leaderboard-list');
      result.leaderboard.forEach(function (entry) {
        var _entry$hint_count;
        var item = document.createElement('li');
        item.classList.add('puzzle-leaderboard-item');
        if (entry !== null && entry !== void 0 && entry.is_current) {
          item.classList.add('puzzle-leaderboard-current');
        }
        var left = document.createElement('span');
        left.classList.add('puzzle-leaderboard-item-rank');
        left.textContent = "#".concat(entry.rank, " \u2022 ").concat(entry.score);
        var right = document.createElement('span');
        right.classList.add('puzzle-leaderboard-item-meta');
        var hints = (_entry$hint_count = entry.hint_count) !== null && _entry$hint_count !== void 0 ? _entry$hint_count : 0;
        var time = typeof entry.time === 'number' ? entry.time.toFixed(1) : entry.time;
        right.textContent = "".concat(hints, " hint").concat(hints === 1 ? '' : 's', ", ").concat(time !== null && time !== void 0 ? time : '0.0', "s");
        item.appendChild(left);
        item.appendChild(right);
        list.appendChild(item);
      });
      container.appendChild(list);
    });
    _defineProperty(_assertThisInitialized(_this), "reset", function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classPrivateFieldSet(_assertThisInitialized(_this), _time, new Date());
      _classPrivateFieldSet(_assertThisInitialized(_this), _level, 0);
      _classPrivateFieldSet(_assertThisInitialized(_this), _hintCount, 0);
      _classPrivateFieldSet(_assertThisInitialized(_this), _hintInterval, null);
      _classPrivateFieldSet(_assertThisInitialized(_this), _held, false);
      _classPrivateFieldSet(_assertThisInitialized(_this), _rngX, null);
      _classPrivateFieldSet(_assertThisInitialized(_this), _rngY, null);
      _classPrivateFieldSet(_assertThisInitialized(_this), _targetPosition, null);
      _classPrivateFieldSet(_assertThisInitialized(_this), _emoji, document.createElement('div'));
      _classPrivateFieldSet(_assertThisInitialized(_this), _disableRotateEmoji, false);
      var body = document.querySelector('body');
      if (document.getElementById('emoji')) body.removeChild(document.getElementById('emoji'));

      // Only destroy the visual celebration overlay if explicitly clearing
      if (!options.preserveGems) {
        if (_classPrivateFieldGet2(_assertThisInitialized(_this), _gemOverlay)) {
          _classPrivateFieldGet2(_assertThisInitialized(_this), _gemOverlay).remove();
          _classPrivateFieldSet(_assertThisInitialized(_this), _gemOverlay, null);
        }
        _this.stopGemAnimation();
      }
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
      _classPrivateFieldSet(this, _treasureElement, document.querySelector('treasure-element'));
      if (!_classPrivateFieldGet2(this, _treasureElement)) {
        return;
      }
      this.loadEventListeners();
      _classPrivateFieldSet(this, _glimmerHintTimeout, setTimeout(function () {
        _this2.glimmerHint();
      }, 500));
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.removeEventListeners();
    }
  }]);
  return HintElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define('hint-element', HintElement);

/***/ }),

/***/ "./resources/js/components/InteractiveElement.js":
/*!*******************************************************!*\
  !*** ./resources/js/components/InteractiveElement.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InteractiveElement: () => (/* binding */ InteractiveElement)
/* harmony export */ });
/* harmony import */ var _magnetLetters_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../magnetLetters.js */ "./resources/js/magnetLetters.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet2(e, t) { var r = _classPrivateFieldGet(t, e); return _classApplyDescriptorGet(e, r); }
function _classApplyDescriptorGet(e, t) { return t.get ? t.get.call(e) : t.value; }
function _classPrivateFieldSet(e, t, r) { var s = _classPrivateFieldGet(t, e); return _classApplyDescriptorSet(e, s, r), r; }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
function _classApplyDescriptorSet(e, t, l) { if (t.set) t.set.call(e, l);else { if (!t.writable) throw new TypeError("attempted to set read only private field"); t.value = l; } }

var _cycleInterval = /*#__PURE__*/new WeakMap();
var _characters = /*#__PURE__*/new WeakMap();
var _baseSpan = /*#__PURE__*/new WeakMap();
var _overlay = /*#__PURE__*/new WeakMap();
var _tick = /*#__PURE__*/new WeakMap();
var _originalText = /*#__PURE__*/new WeakMap();
var _resizeObserver = /*#__PURE__*/new WeakMap();
var _resizeRAF = /*#__PURE__*/new WeakMap();
var _badge = /*#__PURE__*/new WeakMap();
var _badgeTimeout = /*#__PURE__*/new WeakMap();
var _hasActivated = /*#__PURE__*/new WeakMap();
var _fontFamilies = /*#__PURE__*/new WeakMap();
var _palette = /*#__PURE__*/new WeakMap();
var InteractiveElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(InteractiveElement, _HTMLElement);
  function InteractiveElement() {
    var _this;
    _classCallCheck(this, InteractiveElement);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, InteractiveElement, [].concat(args));
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _cycleInterval, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _characters, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _baseSpan, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _overlay, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _tick, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _originalText, {
      writable: true,
      value: ""
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _resizeObserver, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _resizeRAF, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _badge, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _badgeTimeout, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _hasActivated, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _fontFamilies, {
      writable: true,
      value: ['"Trebuchet MS", sans-serif', '"Courier New", monospace', '"Georgia", serif', '"Lucida Console", monospace', '"Times New Roman", serif', '"Gill Sans", sans-serif', '"Andale Mono", monospace', '"Palatino Linotype", serif', '"Comic Sans MS", cursive']
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _palette, {
      writable: true,
      value: ["#2a2727", "#c1bfbe", "#f0d43a", "#c1e718", "#22b2da", "#fb3934", "#cc241d", "#d79921", "#fabd2f", "#d65d0e", "#fe8019", "#458588", "#83a598", "#689d6a", "#8ec07c", "#a89984", "#98971a", "#b8bb26", "#d3869b", "#b16286", "#282828", "#32302f", "#fbf1c7", "#b9cc33", "#f13a44"]
    });
    _defineProperty(_assertThisInitialized(_this), "startCycle", function () {
      var _window$matchMedia, _window;
      if (_classPrivateFieldGet2(_assertThisInitialized(_this), _cycleInterval)) return;
      _this.prepareCharacters();
      _this.classList.add("interactive-cycling");
      _classPrivateFieldSet(_assertThisInitialized(_this), _tick, 0);
      _this.tickCharacters();
      var prefersReducedMotion = (_window$matchMedia = (_window = window).matchMedia) === null || _window$matchMedia === void 0 || (_window$matchMedia = _window$matchMedia.call(_window, "(prefers-reduced-motion: reduce)")) === null || _window$matchMedia === void 0 ? void 0 : _window$matchMedia.matches;
      if (prefersReducedMotion) return;
      _classPrivateFieldSet(_assertThisInitialized(_this), _cycleInterval, window.setInterval(function () {
        _this.tickCharacters();
      }, 170));
    });
    _defineProperty(_assertThisInitialized(_this), "stopCycle", function () {
      if (_classPrivateFieldGet2(_assertThisInitialized(_this), _cycleInterval)) {
        window.clearInterval(_classPrivateFieldGet2(_assertThisInitialized(_this), _cycleInterval));
        _classPrivateFieldSet(_assertThisInitialized(_this), _cycleInterval, null);
      }
      _this.classList.remove("interactive-cycling");
      _classPrivateFieldGet2(_assertThisInitialized(_this), _characters).forEach(function (_char) {
        _char.style.color = "";
        _char.style.fontFamily = "";
        _char.style.transform = "";
      });
    });
    _defineProperty(_assertThisInitialized(_this), "handleClickHint", function (event) {
      if (_classPrivateFieldGet2(_assertThisInitialized(_this), _hasActivated)) return;
      if (event.detail > 1) return;
      // this.ensureBadge();
      // this.showBadge();
    });
    _defineProperty(_assertThisInitialized(_this), "handleDoubleClick", function (event) {
      event.preventDefault();
      event.stopPropagation();
      _this.toggleMagnetMode();
    });
    _defineProperty(_assertThisInitialized(_this), "handleDoubleTap", function (event) {
      var _event$touches;
      if (!event || !event.changedTouches || (_event$touches = event.touches) !== null && _event$touches !== void 0 && _event$touches.length) return;
      var touch = event.changedTouches[0];
      var timestamp = event.timeStamp;
      if (!_this.lastTouchTimestamp) {
        _this.lastTouchTimestamp = timestamp;
        _this.lastTouchX = touch.clientX;
        _this.lastTouchY = touch.clientY;
        return;
      }
      var deltaTime = timestamp - _this.lastTouchTimestamp;
      var deltaX = Math.abs(touch.clientX - _this.lastTouchX);
      var deltaY = Math.abs(touch.clientY - _this.lastTouchY);
      if (deltaTime < 300 && deltaX < 30 && deltaY < 30) {
        event.preventDefault();
        event.stopPropagation();
        _this.toggleMagnetMode();
        _this.lastTouchTimestamp = null;
        return;
      }
      _this.lastTouchTimestamp = timestamp;
      _this.lastTouchX = touch.clientX;
      _this.lastTouchY = touch.clientY;
    });
    return _this;
  }
  _createClass(InteractiveElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this$getAttribute, _this$textContent;
      this.classList.add("interactive-element");
      this.setAttribute("tabindex", (_this$getAttribute = this.getAttribute("tabindex")) !== null && _this$getAttribute !== void 0 ? _this$getAttribute : "0");
      _classPrivateFieldSet(this, _originalText, ((_this$textContent = this.textContent) !== null && _this$textContent !== void 0 ? _this$textContent : "").trim());
      this.dataset.original = _classPrivateFieldGet2(this, _originalText);
      this.prepareCharacters();
      this.addEventListener("pointerenter", this.startCycle);
      this.addEventListener("pointerleave", this.stopCycle);
      this.addEventListener("click", this.handleClickHint);
      this.addEventListener("pointerdown", this.startCycle);
      this.addEventListener("pointerup", this.stopCycle);
      this.addEventListener("pointercancel", this.stopCycle);
      this.addEventListener("focus", this.startCycle);
      this.addEventListener("blur", this.stopCycle);
      this.addEventListener("dblclick", this.handleDoubleClick);
      this.addEventListener("touchend", this.handleDoubleTap, {
        passive: true
      });
      this.observeResize();
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.stopCycle();
      this.removeEventListener("pointerenter", this.startCycle);
      this.removeEventListener("pointerleave", this.stopCycle);
      this.removeEventListener("click", this.handleClickHint);
      this.removeEventListener("pointerdown", this.startCycle);
      this.removeEventListener("pointerup", this.stopCycle);
      this.removeEventListener("pointercancel", this.stopCycle);
      this.removeEventListener("focus", this.startCycle);
      this.removeEventListener("blur", this.stopCycle);
      this.removeEventListener("dblclick", this.handleDoubleClick);
      this.removeEventListener("touchend", this.handleDoubleTap);
      this.disconnectResizeObserver();
      if (_classPrivateFieldGet2(this, _badgeTimeout)) {
        window.clearTimeout(_classPrivateFieldGet2(this, _badgeTimeout));
        _classPrivateFieldSet(this, _badgeTimeout, null);
      }
    }
  }, {
    key: "prepareCharacters",
    value: function prepareCharacters() {
      var _this2 = this;
      if (_classPrivateFieldGet2(this, _characters).length) return;
      var text = _classPrivateFieldGet2(this, _originalText);
      if (!text.length) return;
      if (!_classPrivateFieldGet2(this, _baseSpan)) {
        this.innerHTML = "";
        this.style.position = "relative";
        this.style.display = "inline-block";
        this.style.verticalAlign = "baseline";
        _classPrivateFieldSet(this, _baseSpan, document.createElement("span"));
        _classPrivateFieldGet2(this, _baseSpan).classList.add("interactive-base");
        this.appendChild(_classPrivateFieldGet2(this, _baseSpan));
        _classPrivateFieldSet(this, _overlay, document.createElement("span"));
        _classPrivateFieldGet2(this, _overlay).classList.add("interactive-overlay");
        this.appendChild(_classPrivateFieldGet2(this, _overlay));
      }
      _classPrivateFieldGet2(this, _baseSpan).textContent = text;
      _classPrivateFieldGet2(this, _overlay).innerHTML = "";

      // this.ensureBadge();
      var measurements = this.measureCharacters(text);
      this.style.setProperty("--interactive-base-width", "".concat(measurements.totalWidth, "px"));
      this.style.setProperty("--interactive-base-height", "".concat(measurements.height, "px"));
      this.style.setProperty("--interactive-line-height", "".concat(measurements.height, "px"));
      _classPrivateFieldSet(this, _characters, []);
      text.split("").forEach(function (_char2, index) {
        var _measurements$widths$;
        var span = document.createElement("span");
        span.classList.add("interactive-char");
        span.dataset.colorIndex = "".concat(index % _classPrivateFieldGet2(_this2, _palette).length);
        span.dataset.fontIndex = "".concat(index % _classPrivateFieldGet2(_this2, _fontFamilies).length);
        span.textContent = _char2 === " " ? "\xA0" : _char2;
        var width = (_measurements$widths$ = measurements.widths[index]) !== null && _measurements$widths$ !== void 0 ? _measurements$widths$ : measurements.averageWidth;
        span.style.width = "".concat(width, "px");
        span.style.minWidth = "".concat(width, "px");
        _classPrivateFieldGet2(_this2, _overlay).appendChild(span);
        _classPrivateFieldGet2(_this2, _characters).push(span);
      });
    }
  }, {
    key: "measureCharacters",
    value: function measureCharacters(text) {
      var charCount = Math.max(text.length, 1);
      var rect = _classPrivateFieldGet2(this, _baseSpan).getBoundingClientRect();
      var totalWidth = rect.width || 0;
      var height = rect.height || parseFloat(getComputedStyle(this).lineHeight) || parseFloat(getComputedStyle(this).fontSize) || 0;
      var averageWidth = charCount > 0 ? totalWidth / charCount : totalWidth;
      var widths = new Array(charCount).fill(averageWidth);
      var node = _classPrivateFieldGet2(this, _baseSpan).firstChild;
      if (node && node.nodeType === Node.TEXT_NODE) {
        var range = document.createRange();
        for (var i = 0; i < charCount; i++) {
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          var glyphRect = range.getBoundingClientRect();
          widths[i] = glyphRect.width || averageWidth;
        }
        range.detach();
      }
      return {
        totalWidth: totalWidth,
        height: height,
        averageWidth: averageWidth,
        widths: widths
      };
    }
  }, {
    key: "tickCharacters",
    value: function tickCharacters() {
      var _this3 = this;
      _classPrivateFieldSet(this, _tick, _classPrivateFieldGet2(this, _tick) + 1);
      var wobbleSeed = _classPrivateFieldGet2(this, _tick) % 7;
      _classPrivateFieldGet2(this, _characters).forEach(function (_char3, index) {
        var colorIndex = (parseInt(_char3.dataset.colorIndex || "0", 10) + 1) % _classPrivateFieldGet2(_this3, _palette).length;
        var fontIndex = (parseInt(_char3.dataset.fontIndex || "0", 10) + 1) % _classPrivateFieldGet2(_this3, _fontFamilies).length;
        _char3.dataset.colorIndex = "".concat(colorIndex);
        _char3.dataset.fontIndex = "".concat(fontIndex);
        _char3.style.color = _classPrivateFieldGet2(_this3, _palette)[colorIndex];
        _char3.style.fontFamily = _classPrivateFieldGet2(_this3, _fontFamilies)[fontIndex];
        var wobble = (wobbleSeed + index) % 5 - 2;
        _char3.style.transform = "rotate(".concat(wobble * 1.2, "deg) skewY(").concat(wobble * 0.6, "deg)");
      });
    }
  }, {
    key: "observeResize",
    value: function observeResize() {
      var _this4 = this;
      if (_classPrivateFieldGet2(this, _resizeObserver) || !window.ResizeObserver) return;
      _classPrivateFieldSet(this, _resizeObserver, new ResizeObserver(function () {
        if (_classPrivateFieldGet2(_this4, _resizeRAF)) window.cancelAnimationFrame(_classPrivateFieldGet2(_this4, _resizeRAF));
        _classPrivateFieldSet(_this4, _resizeRAF, window.requestAnimationFrame(function () {
          _this4.recalculate();
        }));
      }));
      _classPrivateFieldGet2(this, _resizeObserver).observe(this);
    }
  }, {
    key: "disconnectResizeObserver",
    value: function disconnectResizeObserver() {
      if (!_classPrivateFieldGet2(this, _resizeObserver)) return;
      _classPrivateFieldGet2(this, _resizeObserver).disconnect();
      _classPrivateFieldSet(this, _resizeObserver, null);
      if (_classPrivateFieldGet2(this, _resizeRAF)) {
        window.cancelAnimationFrame(_classPrivateFieldGet2(this, _resizeRAF));
        _classPrivateFieldSet(this, _resizeRAF, null);
      }
    }
  }, {
    key: "recalculate",
    value: function recalculate() {
      var _this5 = this;
      var text = (_classPrivateFieldGet2(this, _originalText) || "").trim();
      if (!text.length) return;
      this.stopCycle();
      if (!_classPrivateFieldGet2(this, _baseSpan) || !_classPrivateFieldGet2(this, _overlay)) return;
      _classPrivateFieldSet(this, _characters, []);
      _classPrivateFieldGet2(this, _baseSpan).textContent = text;
      _classPrivateFieldGet2(this, _overlay).innerHTML = "";

      // this.ensureBadge();
      var measurements = this.measureCharacters(text);
      this.style.setProperty("--interactive-base-width", "".concat(measurements.totalWidth, "px"));
      this.style.setProperty("--interactive-base-height", "".concat(measurements.height, "px"));
      this.style.setProperty("--interactive-line-height", "".concat(measurements.height, "px"));
      text.split("").forEach(function (_char4, index) {
        var _measurements$widths$2;
        var span = document.createElement("span");
        span.classList.add("interactive-char");
        span.dataset.colorIndex = "".concat(index % _classPrivateFieldGet2(_this5, _palette).length);
        span.dataset.fontIndex = "".concat(index % _classPrivateFieldGet2(_this5, _fontFamilies).length);
        span.textContent = _char4 === " " ? "\xA0" : _char4;
        var width = (_measurements$widths$2 = measurements.widths[index]) !== null && _measurements$widths$2 !== void 0 ? _measurements$widths$2 : measurements.averageWidth;
        span.style.width = "".concat(width, "px");
        span.style.minWidth = "".concat(width, "px");
        _classPrivateFieldGet2(_this5, _overlay).appendChild(span);
        _classPrivateFieldGet2(_this5, _characters).push(span);
      });
    }
  }, {
    key: "ensureBadge",
    value: function ensureBadge() {
      if (_classPrivateFieldGet2(this, _badge)) return _classPrivateFieldGet2(this, _badge);
      var badge = document.createElement("span");
      badge.classList.add("interactive-badge");
      badge.innerHTML = "<span aria-hidden=\"true\">2x</span><span class=\"sr-only\">Double click or double tap to scramble</span>";
      this.appendChild(badge);
      _classPrivateFieldSet(this, _badge, badge);
      return badge;
    }
  }, {
    key: "showBadge",
    value: function showBadge() {
      var _this6 = this;
      if (this.dataset.badgeDismissed === "true") return;
      // const badge = this.ensureBadge();
      // if (!badge) return;

      // badge.classList.add("is-visible");
      if (_classPrivateFieldGet2(this, _badgeTimeout)) window.clearTimeout(_classPrivateFieldGet2(this, _badgeTimeout));
      _classPrivateFieldSet(this, _badgeTimeout, window.setTimeout(function () {
        _this6.hideBadge();
      }, 2200));
    }
  }, {
    key: "hideBadge",
    value: function hideBadge() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (!_classPrivateFieldGet2(this, _badge)) return;
      _classPrivateFieldGet2(this, _badge).classList.remove("is-visible");
      if (_classPrivateFieldGet2(this, _badgeTimeout)) {
        window.clearTimeout(_classPrivateFieldGet2(this, _badgeTimeout));
        _classPrivateFieldSet(this, _badgeTimeout, null);
      }
      if (force) {
        this.dataset.badgeDismissed = "true";
      }
    }
  }, {
    key: "toggleMagnetMode",
    value: function toggleMagnetMode() {
      this.stopCycle();
      if (_magnetLetters_js__WEBPACK_IMPORTED_MODULE_0__.MagnetLetters.isActive()) {
        _magnetLetters_js__WEBPACK_IMPORTED_MODULE_0__.MagnetLetters.deactivate();
        this.hideBadge(true);
        return;
      }
      this.hideBadge(true);
      _magnetLetters_js__WEBPACK_IMPORTED_MODULE_0__.MagnetLetters.activate();
      _classPrivateFieldSet(this, _hasActivated, true);
    }
  }]);
  return InteractiveElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define("interactive-element", InteractiveElement);

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
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gsap */ "./node_modules/gsap/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { "throw": 1, "return": 2, "break": 3, "continue": 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, "catch": function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t, o) { n.p = e.prev, n.n = e.next; try { return r(_t, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _regeneratorKeys(e) { var n = Object(e), r = []; for (var t in n) r.unshift(t); return function e() { for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e; return e.done = !0, e; }; }
function _regeneratorAsync(n, e, r, t, o) { var a = _regeneratorAsyncGen(n, e, r, t, o); return a.next().then(function (n) { return n.done ? n.value : a.next(); }); }
function _regeneratorAsyncGen(r, e, t, o, n) { return new _regeneratorAsyncIterator(_regenerator().w(r, e, t, o), n || Promise); }
function _regeneratorAsyncIterator(t, e) { function n(r, o, i, f) { try { var c = t[r](o), u = c.value; return u instanceof _OverloadYield ? e.resolve(u.v).then(function (t) { n("next", t, i, f); }, function (t) { n("throw", t, i, f); }) : e.resolve(u).then(function (t) { c.value = t, i(c); }, function (t) { return n("throw", t, i, f); }); } catch (t) { f(t); } } var r; this.next || (_regeneratorDefine2(_regeneratorAsyncIterator.prototype), _regeneratorDefine2(_regeneratorAsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () { return this; })), _regeneratorDefine2(this, "_invoke", function (t, o, i) { function f() { return new e(function (e, r) { n(t, i, e, r); }); } return r = r ? r.then(f, f) : f(); }, !0); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _OverloadYield(e, d) { this.v = e, this.k = d; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldSet(e, t, r) { var s = _classPrivateFieldGet2(t, e); return _classApplyDescriptorSet(e, s, r), r; }
function _classApplyDescriptorSet(e, t, l) { if (t.set) t.set.call(e, l);else { if (!t.writable) throw new TypeError("attempted to set read only private field"); t.value = l; } }
function _classPrivateFieldGet(e, t) { var r = _classPrivateFieldGet2(t, e); return _classApplyDescriptorGet(e, r); }
function _classPrivateFieldGet2(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classApplyDescriptorGet(e, t) { return t.get ? t.get.call(e) : t.value; }
function _classPrivateMethodGet(s, a, r) { return _assertClassBrand(a, s), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }

var _intervals = /*#__PURE__*/new WeakMap();
var _cursorTimeout = /*#__PURE__*/new WeakMap();
var _audioContext = /*#__PURE__*/new WeakMap();
var _audioBuffers = /*#__PURE__*/new WeakMap();
var _audioReadyPromise = /*#__PURE__*/new WeakMap();
var _textColors = /*#__PURE__*/new WeakMap();
var _ensureAudioLoaded = /*#__PURE__*/new WeakSet();
var _playAudio = /*#__PURE__*/new WeakSet();
var NameElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(NameElement, _HTMLElement);
  function NameElement() {
    var _this;
    _classCallCheck(this, NameElement);
    _this = _callSuper(this, NameElement);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _playAudio);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _ensureAudioLoaded);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _intervals, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _cursorTimeout, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _audioContext, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _audioBuffers, {
      writable: true,
      value: {
        error: null,
        success: null,
        unlock: null
      }
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _audioReadyPromise, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _textColors, {
      writable: true,
      value: ['text-gruvbox-light-yellow', 'text-gruvbox-yellow', 'text-gruvbox-orange', 'text-gruvbox-purple', 'text-gruvbox-blue', 'text-gruvbox-aqua', 'text-gruvbox-gray', 'text-gruvbox-green', 'text-gruvbox-red']
    });
    _defineProperty(_assertThisInitialized(_this), "nameLetterClicked", function (e) {
      var _target$classList;
      var loading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      clearTimeout(_classPrivateFieldGet(_assertThisInitialized(_this), _cursorTimeout));
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
      var letterTl = gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.timeline({});
      if (!loading && isGreen) {
        _classPrivateMethodGet(_assertThisInitialized(_this), _ensureAudioLoaded, _ensureAudioLoaded2).call(_assertThisInitialized(_this)).then(function () {
          return _classPrivateMethodGet(_assertThisInitialized(_this), _playAudio, _playAudio2).call(_assertThisInitialized(_this), 'success');
        });
        letterTl.to(target, {
          y: -4,
          duration: 0.1,
          ease: 'power1.out'
        });
        letterTl.to(target, {
          y: 0,
          duration: 0.3,
          ease: 'bounce.out'
        });
        target.classList.remove('cursor-not-allowed');
        target.classList.add('cursor-copy');
      } else if (!loading) {
        _classPrivateMethodGet(_assertThisInitialized(_this), _ensureAudioLoaded, _ensureAudioLoaded2).call(_assertThisInitialized(_this)).then(function () {
          return _classPrivateMethodGet(_assertThisInitialized(_this), _playAudio, _playAudio2).call(_assertThisInitialized(_this), 'error');
        });
        letterTl.to(target, {
          x: -2,
          duration: 0.08,
          ease: 'elastic.inOut',
          repeat: 3,
          yoyo: true
        });
        target.classList.remove('cursor-pointer', 'cursor-not-allowed');
        target.classList.add('cursor-not-allowed');
        _classPrivateFieldSet(_assertThisInitialized(_this), _cursorTimeout, setTimeout(function () {
          target.classList.remove('cursor-not-allowed');
          target.classList.add('cursor-pointer');
        }, 500));
      }
      var allGreen = true;
      _this.childNodes.forEach(function (letter) {
        if (!letter.classList.contains('text-gruvbox-green')) {
          allGreen = false;
        }
      });
      if (!loading && allGreen) {
        var unlockType = 'green';
        _classPrivateMethodGet(_assertThisInitialized(_this), _ensureAudioLoaded, _ensureAudioLoaded2).call(_assertThisInitialized(_this)).then(function () {
          return _classPrivateMethodGet(_assertThisInitialized(_this), _playAudio, _playAudio2).call(_assertThisInitialized(_this), 'unlock');
        });
        _this.loadPlayground();
      }
    });
    _classPrivateMethodGet(_assertThisInitialized(_this), _ensureAudioLoaded, _ensureAudioLoaded2).call(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(NameElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      _classPrivateMethodGet(this, _ensureAudioLoaded, _ensureAudioLoaded2).call(this);
      this.render();
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(oldValue) {
      if (oldValue === null) {
        return;
      } else {
        for (var i = 0; i < _classPrivateFieldGet(this, _intervals).length; i++) {
          clearInterval(_classPrivateFieldGet(this, _intervals)[i]);
        }
        this.innerHTML = '';
        this.render();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      // Clear old content
      this.innerHTML = '';

      // Ensure parent allows visible drops
      this.style.display = 'inline-block';
      this.style.overflow = 'visible';
      this.dataset.content.split('').forEach(function (letter, i) {
        var span = document.createElement('span');
        span.classList.add('cursor-pointer', 'select-none', 'text-8xl');
        span.style.display = 'inline-block'; // <-- key!
        // span.style.transform = 'translateY(200px)' // optional visual setup
        span.innerText = letter;
        span.setAttribute('data-click-count', 0);
        span.setAttribute('data-loading-count', 0);
        span.addEventListener('click', _this2.nameLetterClicked, {
          passive: true
        });
        _this2.appendChild(span);

        // random rotation between -30 and +30 degrees
        var rotateRandom = gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.utils.random(-90, 90, 1);
        // oppostie rotation direction for bounce
        var oppositeRotate = rotateRandom * -1;

        // timeline for each letter
        var letterTl = gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.timeline({
          delay: i * 0.18 // cascading
        });

        // first fall — starts above, hits “ground”
        letterTl.from(span, {
          y: -200,
          rotate: rotateRandom,
          transformOrigin: 'center bottom',
          ease: 'bounce.out',
          duration: 0.8,
          onUpdate: function onUpdate() {
            // span._gsap.y is something like "-2.345px"
            var yValue = parseFloat(span._gsap.y); // convert to number (removes 'px')
            // check if it's roughly between -10px and 0px
            if (yValue >= -10 && yValue <= 0) {
              _this2.nameLetterClicked({
                target: span
              }, true);
            }
          }
        });
      });
    }
  }, {
    key: "loadPlayground",
    value: function () {
      var _loadPlayground = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var skillsUrl;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              skillsUrl = new URL('/skills', window.location.origin);
              fetch(skillsUrl.toString()).then(function (response) {
                if (!response.ok) {
                  throw new Error("Failed to load skills (".concat(response.status, ")"));
                }
                return response.json();
              }).then(function (data) {
                if (data !== null && data !== void 0 && data.skills && window.Playground) {
                  window.Playground.init(data.skills);
                }
                if (typeof gtag === 'function') {
                  gtag('event', 'Skills Puzzle', {
                    event_category: 'Skills',
                    event_label: 'Skills Playground Loaded'
                  });
                }
              })["catch"](function (error) {
                console.error(error);
              });
            case 2:
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
                var _document$getElementB, _document$getElementB2;
                if (!selected) return;
                var lead = document.getElementById('lead');
                if (!lead) {
                  resolve();
                  return;
                }
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
                (_document$getElementB = document.getElementById('default')) === null || _document$getElementB === void 0 || _document$getElementB.classList.add('hidden');
                (_document$getElementB2 = document.getElementById('secondary')) === null || _document$getElementB2 === void 0 || _document$getElementB2.classList.add('hidden');
                newParagraphs.forEach(function (newParagraph) {
                  lead.appendChild(newParagraph);
                });
                var disapearingParagraphs = document.querySelectorAll('#lead p');
                disapearingParagraphs.forEach(function (paragraph) {
                  if (!paragraph.classList.contains('hidden')) {
                    paragraph.classList.add('overflow-hidden');
                    var letters = paragraph.querySelectorAll('span');
                    letters.forEach(function (letter) {
                      resolve(setTimeout(function () {
                        if (selected == 'green' && letter.classList.contains('text-gruvbox-green')) {
                          letter.style.fontSize = '3rem';
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
                        document.getElementsByTagName('body')[0].classList.remove('cursor-wait');
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
function _ensureAudioLoaded2() {
  var _this3 = this;
  if (_classPrivateFieldGet(this, _audioReadyPromise)) {
    return _classPrivateFieldGet(this, _audioReadyPromise);
  }
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    _classPrivateFieldSet(this, _audioReadyPromise, Promise.resolve());
    return _classPrivateFieldGet(this, _audioReadyPromise);
  }
  _classPrivateFieldSet(this, _audioContext, new AudioContext());
  var loadBuffer = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(url) {
      var response, arrayBuffer;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return fetch(url);
          case 3:
            response = _context3.sent;
            _context3.next = 6;
            return response.arrayBuffer();
          case 6:
            arrayBuffer = _context3.sent;
            _context3.next = 9;
            return _classPrivateFieldGet(_this3, _audioContext).decodeAudioData(arrayBuffer);
          case 9:
            return _context3.abrupt("return", _context3.sent);
          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](0);
            console.error("Failed to load audio: ".concat(url), _context3.t0);
            return _context3.abrupt("return", null);
          case 16:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 12]]);
    }));
    return function loadBuffer(_x2) {
      return _ref.apply(this, arguments);
    };
  }();
  _classPrivateFieldSet(this, _audioReadyPromise, Promise.all([loadBuffer('/audio/error3.wav'), loadBuffer('/audio/success3.wav'), loadBuffer('/audio/unlock.wav')]).then(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 3),
      errorBuffer = _ref3[0],
      successBuffer = _ref3[1],
      unlockBuffer = _ref3[2];
    _classPrivateFieldGet(_this3, _audioBuffers).error = errorBuffer;
    _classPrivateFieldGet(_this3, _audioBuffers).success = successBuffer;
    _classPrivateFieldGet(_this3, _audioBuffers).unlock = unlockBuffer;
  }));
  return _classPrivateFieldGet(this, _audioReadyPromise);
}
function _playAudio2(type) {
  if (!_classPrivateFieldGet(this, _audioContext) || !_classPrivateFieldGet(this, _audioBuffers)[type]) {
    return;
  }
  if (_classPrivateFieldGet(this, _audioContext).state === 'suspended') {
    _classPrivateFieldGet(this, _audioContext).resume()["catch"](function (error) {
      return console.error('Failed to resume audio context', error);
    });
  }
  var source = _classPrivateFieldGet(this, _audioContext).createBufferSource();
  source.buffer = _classPrivateFieldGet(this, _audioBuffers)[type];
  source.connect(_classPrivateFieldGet(this, _audioContext).destination);
  source.start(0);
}
_defineProperty(NameElement, "observedAttributes", ['data-content']);
customElements.define('name-element', NameElement);

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
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
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
/* harmony import */ var _components_InteractiveElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/InteractiveElement.js */ "./resources/js/components/InteractiveElement.js");
/* harmony import */ var _components_FancyButtonElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/FancyButtonElement.js */ "./resources/js/components/FancyButtonElement.js");
/* harmony import */ var _playground_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./playground.js */ "./resources/js/playground.js");
/* harmony import */ var _playground_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_playground_js__WEBPACK_IMPORTED_MODULE_6__);








/***/ }),

/***/ "./resources/js/magnetLetters.js":
/*!***************************************!*\
  !*** ./resources/js/magnetLetters.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MagnetLetters: () => (/* binding */ MagnetLetters)
/* harmony export */ });
var palette = ["#fb3934",
// gruvbox-light-red
"#cc241d",
// gruvbox-red
"#d79921",
// gruvbox-light-yellow
"#fabd2f",
// gruvbox-yellow
"#d65d0e",
// gruvbox-light-orange
"#fe8019",
// gruvbox-orange
"#458588",
// gruvbox-light-blue
"#83a598",
// gruvbox-blue
"#689d6a",
// gruvbox-light-aqua
"#8ec07c",
// gruvbox-aqua
"#98971a",
// gruvbox-light-green
"#b8bb26",
// gruvbox-green
"#d3869b",
// gruvbox-light-purple
"#b16286",
// gruvbox-purple
"#fbf1c7" // gruvbox-white
];
var LETTER_CLASS = "magnet-letter";
var ACTIVE_CLASS = "magnet-active";
var LETTER_HORIZONTAL_TOLERANCE = 15;
var LETTER_VERTICAL_TOLERANCE = 15;
var OVERLAP_TOLERANCE = 5;
var DRAG_STATE = new WeakMap();
var LETTER_STATE = new Map();
var SPATIAL_HASH = new Map();
var STATE_CELL_SIZE = 24;
var computeCellsForBounds = function computeCellsForBounds(x, y, width, height) {
  var minX = Math.floor(x / STATE_CELL_SIZE);
  var minY = Math.floor(y / STATE_CELL_SIZE);
  var maxX = Math.floor((x + width) / STATE_CELL_SIZE);
  var maxY = Math.floor((y + height) / STATE_CELL_SIZE);
  var cells = [];
  for (var cx = minX; cx <= maxX; cx++) {
    for (var cy = minY; cy <= maxY; cy++) {
      cells.push("".concat(cx, ":").concat(cy));
    }
  }
  return cells;
};
var unindexLetterState = function unindexLetterState(state) {
  if (!state || !state.cells) return;
  state.cells.forEach(function (key) {
    var bucket = SPATIAL_HASH.get(key);
    if (!bucket) return;
    bucket["delete"](state);
    if (!bucket.size) {
      SPATIAL_HASH["delete"](key);
    }
  });
  state.cells = [];
};
var indexLetterState = function indexLetterState(state) {
  var rect = getStateRect(state);
  var cells = computeCellsForBounds(rect.x, rect.y, rect.width, rect.height);
  state.cells = cells;
  cells.forEach(function (key) {
    var bucket = SPATIAL_HASH.get(key);
    if (!bucket) {
      bucket = new Set();
      SPATIAL_HASH.set(key, bucket);
    }
    bucket.add(state);
  });
};
var registerLetterState = function registerLetterState(_ref) {
  var element = _ref.element,
    baseX = _ref.baseX,
    baseY = _ref.baseY,
    width = _ref.width,
    height = _ref.height,
    collisionTopInset = _ref.collisionTopInset,
    collisionBottomInset = _ref.collisionBottomInset,
    collisionLeftInset = _ref.collisionLeftInset,
    collisionRightInset = _ref.collisionRightInset;
  var state = {
    element: element,
    baseX: baseX,
    baseY: baseY,
    offsetX: 0,
    offsetY: 0,
    width: width,
    height: height,
    collisionTopInset: collisionTopInset,
    collisionBottomInset: collisionBottomInset,
    collisionLeftInset: collisionLeftInset,
    collisionRightInset: collisionRightInset,
    cells: []
  };
  LETTER_STATE.set(element, state);
  indexLetterState(state);
};
var updateLetterStateBase = function updateLetterStateBase(element, baseX, baseY, offsetX, offsetY) {
  var state = LETTER_STATE.get(element);
  if (!state) return;
  unindexLetterState(state);
  state.baseX = baseX;
  state.baseY = baseY;
  state.offsetX = offsetX;
  state.offsetY = offsetY;
  indexLetterState(state);
};
var updateLetterStateOffsets = function updateLetterStateOffsets(element, offsetX, offsetY) {
  var state = LETTER_STATE.get(element);
  if (!state) return;
  unindexLetterState(state);
  state.offsetX = offsetX;
  state.offsetY = offsetY;
  indexLetterState(state);
};
var getLetterState = function getLetterState(element) {
  return LETTER_STATE.get(element);
};
var resetLetterState = function resetLetterState() {
  LETTER_STATE.clear();
  SPATIAL_HASH.clear();
};
var containerBounds = {
  width: 0,
  height: 0
};
var updateContainerBounds = function updateContainerBounds() {
  if (!leadContainer) {
    containerBounds.width = 0;
    containerBounds.height = 0;
    return;
  }
  containerBounds.width = leadContainer.clientWidth || 0;
  containerBounds.height = leadContainer.clientHeight || 0;
};
var CONTACT_EPSILON = 0.5;
var AXIS_OVERLAP_EPSILON = 0.5;
var MAX_PROPAGATED_PUSH = 1.2;
var getStateRect = function getStateRect(state) {
  var _state$collisionLeftI, _state$collisionTopIn, _state$collisionRight, _state$collisionBotto;
  var left = state.baseX + state.offsetX + ((_state$collisionLeftI = state.collisionLeftInset) !== null && _state$collisionLeftI !== void 0 ? _state$collisionLeftI : 0);
  var top = state.baseY + state.offsetY + ((_state$collisionTopIn = state.collisionTopInset) !== null && _state$collisionTopIn !== void 0 ? _state$collisionTopIn : 0);
  var right = state.baseX + state.offsetX + state.width - ((_state$collisionRight = state.collisionRightInset) !== null && _state$collisionRight !== void 0 ? _state$collisionRight : 0);
  var bottom = state.baseY + state.offsetY + state.height - ((_state$collisionBotto = state.collisionBottomInset) !== null && _state$collisionBotto !== void 0 ? _state$collisionBotto : 0);
  return {
    x: left,
    y: top,
    right: right,
    bottom: bottom,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  };
};
var gatherNearbyStates = function gatherNearbyStates(state) {
  var rect = getStateRect(state);
  var padding = 0.25;
  var cells = computeCellsForBounds(rect.x - padding, rect.y - padding, rect.width + padding * 2, rect.height + padding * 2);
  var candidates = new Set();
  cells.forEach(function (key) {
    var bucket = SPATIAL_HASH.get(key);
    if (!bucket) return;
    bucket.forEach(function (candidate) {
      if (candidate !== state) candidates.add(candidate);
    });
  });
  return Array.from(candidates);
};
var clampAxisOffset = function clampAxisOffset(state, axis, offset) {
  var _state$collisionLeftI2, _state$collisionTopIn2, _state$collisionRight2, _state$collisionBotto2;
  if (!leadContainer) return offset;
  var boundsSize = axis === "x" ? containerBounds.width : containerBounds.height;
  if (!boundsSize) return offset;
  var base = axis === "x" ? state.baseX : state.baseY;
  var size = axis === "x" ? state.width : state.height;
  var insetStart = axis === "x" ? (_state$collisionLeftI2 = state.collisionLeftInset) !== null && _state$collisionLeftI2 !== void 0 ? _state$collisionLeftI2 : 0 : (_state$collisionTopIn2 = state.collisionTopInset) !== null && _state$collisionTopIn2 !== void 0 ? _state$collisionTopIn2 : 0;
  var insetEnd = axis === "x" ? (_state$collisionRight2 = state.collisionRightInset) !== null && _state$collisionRight2 !== void 0 ? _state$collisionRight2 : 0 : (_state$collisionBotto2 = state.collisionBottomInset) !== null && _state$collisionBotto2 !== void 0 ? _state$collisionBotto2 : 0;
  var minOffset = -(base + insetStart);
  var maxOffset = boundsSize - (base + size - insetEnd);
  if (maxOffset < minOffset) return minOffset;
  if (offset < minOffset) return minOffset;
  if (offset > maxOffset) return maxOffset;
  return offset;
};
var clampOffsetsForState = function clampOffsetsForState(state, offsetX, offsetY) {
  return {
    offsetX: clampAxisOffset(state, "x", offsetX),
    offsetY: clampAxisOffset(state, "y", offsetY)
  };
};
var applyOffsetsToState = function applyOffsetsToState(state, offsetX, offsetY) {
  var clamped = clampOffsetsForState(state, offsetX, offsetY);
  if (clamped.offsetX === state.offsetX && clamped.offsetY === state.offsetY) {
    return clamped;
  }
  state.element.style.transform = "translate3d(".concat(clamped.offsetX, "px, ").concat(clamped.offsetY, "px, 0)");
  updateLetterStateOffsets(state.element, clamped.offsetX, clamped.offsetY);
  return clamped;
};
var applyAxisMove = function applyAxisMove(state, axis, delta) {
  if (!delta) return;
  var newOffsetX = axis === "x" ? state.offsetX + delta : state.offsetX;
  var newOffsetY = axis === "y" ? state.offsetY + delta : state.offsetY;
  applyOffsetsToState(state, newOffsetX, newOffsetY);
};
var getAxisLimits = function getAxisLimits(state, axis) {
  var _state$collisionLeftI3, _state$collisionTopIn3, _state$collisionRight3, _state$collisionBotto3;
  if (!leadContainer) {
    return {
      min: -Infinity,
      max: Infinity
    };
  }
  var boundsSize = axis === "x" ? containerBounds.width : containerBounds.height;
  if (!boundsSize) {
    return {
      min: -Infinity,
      max: Infinity
    };
  }
  var base = axis === "x" ? state.baseX : state.baseY;
  var size = axis === "x" ? state.width : state.height;
  var insetStart = axis === "x" ? (_state$collisionLeftI3 = state.collisionLeftInset) !== null && _state$collisionLeftI3 !== void 0 ? _state$collisionLeftI3 : 0 : (_state$collisionTopIn3 = state.collisionTopInset) !== null && _state$collisionTopIn3 !== void 0 ? _state$collisionTopIn3 : 0;
  var insetEnd = axis === "x" ? (_state$collisionRight3 = state.collisionRightInset) !== null && _state$collisionRight3 !== void 0 ? _state$collisionRight3 : 0 : (_state$collisionBotto3 = state.collisionBottomInset) !== null && _state$collisionBotto3 !== void 0 ? _state$collisionBotto3 : 0;
  var min = -(base + insetStart);
  var max = boundsSize - (base + size - insetEnd);
  return {
    min: min,
    max: max
  };
};
var limitMoveByBounds = function limitMoveByBounds(state, axis, amount) {
  var direction = Math.sign(amount);
  if (!direction) {
    return {
      move: 0,
      leftover: 0
    };
  }
  var current = axis === "x" ? state.offsetX : state.offsetY;
  var _getAxisLimits = getAxisLimits(state, axis),
    min = _getAxisLimits.min,
    max = _getAxisLimits.max;
  var target = current + amount;
  if (target < min) target = min;
  if (target > max) target = max;
  var move = target - current;
  return {
    move: move,
    leftover: amount - move
  };
};
var findNearestNeighbor = function findNearestNeighbor(state, axis, direction) {
  if (!direction) return null;
  var originRect = getStateRect(state);
  var candidates = gatherNearbyStates(state);
  var closest = null;
  var closestDistance = Infinity;
  candidates.forEach(function (candidate) {
    var rect = getStateRect(candidate);
    if (axis === "x") {
      var verticalOverlap = Math.min(originRect.bottom, rect.bottom) - Math.max(originRect.y, rect.y);
      if (verticalOverlap <= AXIS_OVERLAP_EPSILON) return;
      var distance = direction > 0 ? rect.x - originRect.right : originRect.x - rect.right;
      if (distance < -CONTACT_EPSILON) return;
      var adjustedDistance = Math.max(0, distance);
      if (adjustedDistance < closestDistance) {
        closest = candidate;
        closestDistance = adjustedDistance;
      }
    } else {
      var horizontalOverlap = Math.min(originRect.right, rect.right) - Math.max(originRect.x, rect.x);
      if (horizontalOverlap <= AXIS_OVERLAP_EPSILON) return;
      var _distance = direction > 0 ? rect.y - originRect.bottom : originRect.y - rect.bottom;
      if (_distance < -CONTACT_EPSILON) return;
      var _adjustedDistance = Math.max(0, _distance);
      if (_adjustedDistance < closestDistance) {
        closest = candidate;
        closestDistance = _adjustedDistance;
      }
    }
  });
  if (!closest || closestDistance === Infinity) return null;
  return {
    state: closest,
    distance: Math.max(0, closestDistance)
  };
};
var moveStateRecursively = function moveStateRecursively(state, axis, amount) {
  var visited = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Set();
  var direction = Math.sign(amount);
  if (!direction) return {
    applied: 0,
    leftover: 0
  };
  if (visited.has(state)) return {
    applied: 0,
    leftover: amount
  };
  visited.add(state);
  var _limitMoveByBounds = limitMoveByBounds(state, axis, amount),
    boundedMove = _limitMoveByBounds.move,
    boundsLeftover = _limitMoveByBounds.leftover;
  if (Math.abs(boundedMove) <= CONTACT_EPSILON) {
    visited["delete"](state);
    return {
      applied: 0,
      leftover: amount
    };
  }
  var neighborInfo = findNearestNeighbor(state, axis, direction);
  if (!neighborInfo || neighborInfo.distance >= Math.abs(boundedMove)) {
    applyAxisMove(state, axis, boundedMove);
    visited["delete"](state);
    return {
      applied: boundedMove,
      leftover: boundsLeftover
    };
  }
  var distanceToNeighbor = Math.max(0, neighborInfo.distance);
  var appliedMove = 0;
  if (distanceToNeighbor > 0) {
    var advance = direction * Math.min(Math.abs(boundedMove), distanceToNeighbor);
    applyAxisMove(state, axis, advance);
    appliedMove += advance;
  }
  var remaining = boundedMove - appliedMove;
  var neighborResult = moveStateRecursively(neighborInfo.state, axis, remaining, visited);
  var neighborApplied = remaining - neighborResult.leftover;
  if (Math.abs(neighborApplied) > CONTACT_EPSILON) {
    applyAxisMove(state, axis, neighborApplied);
    appliedMove += neighborApplied;
  }
  visited["delete"](state);
  return {
    applied: appliedMove,
    leftover: boundsLeftover + neighborResult.leftover
  };
};
var moveStateAlongAxis = function moveStateAlongAxis(state, delta, axis) {
  if (!delta) return;
  moveStateRecursively(state, axis, delta, new Set());
};
var resolveOverlapPair = function resolveOverlapPair(firstState, secondState) {
  var firstRect = getStateRect(firstState);
  var secondRect = getStateRect(secondState);
  var overlapWidth = Math.min(firstRect.right, secondRect.right) - Math.max(firstRect.x, secondRect.x);
  var overlapHeight = Math.min(firstRect.bottom, secondRect.bottom) - Math.max(firstRect.y, secondRect.y);
  if (overlapWidth <= 0 || overlapHeight <= 0) return false;
  if (overlapWidth < overlapHeight) {
    var direction = firstRect.x < secondRect.x ? -1 : 1;
    moveStateAlongAxis(firstState, direction * overlapWidth, "x");
    moveStateAlongAxis(secondState, -direction * overlapWidth, "x");
  } else {
    var _direction = firstRect.y < secondRect.y ? -1 : 1;
    moveStateAlongAxis(firstState, _direction * overlapHeight, "y");
    moveStateAlongAxis(secondState, -_direction * overlapHeight, "y");
  }
  return true;
};
var resolveAllOverlaps = function resolveAllOverlaps() {
  var states = Array.from(LETTER_STATE.values());
  var iterations = 0;
  var anyResolved = false;
  do {
    anyResolved = false;
    iterations += 1;
    for (var i = 0; i < states.length; i++) {
      var a = states[i];
      if (!a) continue;
      var rectA = getStateRect(a);
      for (var j = i + 1; j < states.length; j++) {
        var b = states[j];
        if (!b) continue;
        var rectB = getStateRect(b);
        var overlapWidth = Math.min(rectA.right, rectB.right) - Math.max(rectA.x, rectB.x);
        var overlapHeight = Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.y, rectB.y);
        if (overlapWidth <= 0 || overlapHeight <= 0) continue;
        var resolved = resolveOverlapPair(a, b);
        if (resolved) anyResolved = true;
      }
    }
  } while (anyResolved && iterations < 4);
};
var originalMarkup = null;
var leadContainer = null;
var pointerMoveListener = null;
var pointerUpListener = null;
var animationFrame = null;
var resizeObserver = null;
var lastPointerEvent = null;
var activeLetter = null;
var DEBUG_MAGNET = false;
var debugLog = function debugLog() {
  var _console;
  if (!DEBUG_MAGNET) return;
  // eslint-disable-next-line no-console
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  (_console = console).log.apply(_console, ["[Magnet]"].concat(args));
};
var debugCount = function debugCount(label) {
  if (!DEBUG_MAGNET) return;
  // eslint-disable-next-line no-console
  console.count("[Magnet] ".concat(label));
};
var debugTimeEnd = function debugTimeEnd(label, start) {
  if (!DEBUG_MAGNET) return;
  // eslint-disable-next-line no-console
  console.log("[Magnet]", "".concat(label, " ").concat(Math.round((performance.now() - start) * 1000) / 1000, "ms"));
};
var randomFromPalette = function randomFromPalette() {
  return palette[Math.floor(Math.random() * palette.length)];
};
var parseTranslate = function parseTranslate(element) {
  var transform = element.style.transform;
  if (!transform || transform === "none") return {
    x: 0,
    y: 0
  };
  var match = transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px/);
  if (!match) return {
    x: 0,
    y: 0
  };
  return {
    x: parseFloat(match[1]) || 0,
    y: parseFloat(match[2]) || 0
  };
};
var glyphMetricCanvas = null;
var glyphMetricContext = null;
var ensureGlyphMetricContext = function ensureGlyphMetricContext(computedStyle) {
  if (!glyphMetricCanvas) {
    glyphMetricCanvas = document.createElement("canvas");
    glyphMetricContext = glyphMetricCanvas.getContext("2d");
  }
  var fontString = computedStyle.font || "".concat(computedStyle.fontStyle || "", " ").concat(computedStyle.fontWeight || "", " ").concat(computedStyle.fontSize || "16px", " ").concat(computedStyle.fontFamily || "sans-serif").trim();
  glyphMetricContext.font = fontString;
  glyphMetricContext.textBaseline = "alphabetic";
  glyphMetricContext.textAlign = "left";
  return glyphMetricContext;
};
var measureGlyphMetrics = function measureGlyphMetrics(_char, computedStyle) {
  var ctx = ensureGlyphMetricContext(computedStyle);
  var safeChar = _char === " " ? "\xA0" : _char;
  var metrics = ctx.measureText(safeChar);
  if (typeof metrics.actualBoundingBoxAscent === "number" && typeof metrics.actualBoundingBoxDescent === "number") {
    return {
      ascent: metrics.actualBoundingBoxAscent,
      descent: metrics.actualBoundingBoxDescent,
      width: metrics.width
    };
  }
  // Fallback: use the range rect height as before
  return null;
};
var createLetterSpan = function createLetterSpan(_char2, rect, containerRect, computedStyle) {
  var span = document.createElement("span");
  span.classList.add(LETTER_CLASS);
  span.textContent = _char2 === "\n" ? "" : _char2;
  span.dataset["char"] = _char2;
  var relativeLeft = rect.left - containerRect.left;
  var relativeTop = rect.top - containerRect.top;
  span.style.position = "absolute";
  span.style.left = "".concat(relativeLeft, "px");
  span.style.top = "".concat(relativeTop, "px");
  span.style.width = "".concat(rect.width, "px");
  span.style.height = "".concat(rect.height, "px");
  span.style.display = "flex";
  span.style.alignItems = "center";
  span.style.justifyContent = "center";
  span.style.userSelect = "none";
  span.style.touchAction = "none";
  span.style.cursor = "grab";
  if (computedStyle.font && computedStyle.font !== "inherit") {
    span.style.font = computedStyle.font;
  } else {
    span.style.fontFamily = computedStyle.fontFamily;
    span.style.fontSize = computedStyle.fontSize;
    span.style.fontWeight = computedStyle.fontWeight;
  }
  span.style.lineHeight = computedStyle.lineHeight === "normal" ? computedStyle.fontSize : computedStyle.lineHeight;
  span.style.letterSpacing = computedStyle.letterSpacing;
  span.style.color = randomFromPalette();
  span.style.textTransform = "none";
  span.style.transform = "translate3d(0px, 0px, 0)";
  span.style.transition = "color 120ms ease";
  var fontSizeValue = parseFloat(computedStyle.fontSize) || rect.height;
  var collisionHeight = Math.min(rect.height, fontSizeValue);
  var verticalInset = Math.max(0, Math.min(rect.height, (rect.height - collisionHeight) / 2));
  var glyphMetrics = measureGlyphMetrics(_char2, computedStyle);
  var collisionTopInset = 0;
  var collisionBottomInset = 0;
  if (glyphMetrics) {
    var ascent = glyphMetrics.ascent,
      descent = glyphMetrics.descent;
    var glyphHeight = ascent + descent;
    var lineHeight = rect.height;
    // Split spare space between top and bottom
    var spare = Math.max(0, lineHeight - glyphHeight);
    collisionTopInset = spare * 0.5;
    collisionBottomInset = spare - collisionTopInset;
  } else {
    // Fallback to old behavior if canvas metrics unavailable
    var _fontSizeValue = parseFloat(computedStyle.fontSize) || rect.height;
    var _collisionHeight = Math.min(rect.height, _fontSizeValue);
    var _verticalInset = Math.max(0, Math.min(rect.height, (rect.height - _collisionHeight) / 2));
    collisionTopInset = _verticalInset;
    collisionBottomInset = _verticalInset;
  }
  return {
    element: span,
    baseX: relativeLeft,
    baseY: relativeTop,
    width: rect.width,
    height: rect.height,
    collisionTopInset: collisionTopInset,
    collisionBottomInset: collisionBottomInset,
    collisionLeftInset: 0,
    collisionRightInset: 0
  };
};
var letterizeNode = function letterizeNode(node, containerRect, fragments, computedStyle) {
  if (node.nodeType === Node.TEXT_NODE) {
    var _node$textContent;
    var text = (_node$textContent = node.textContent) !== null && _node$textContent !== void 0 ? _node$textContent : "";
    var range = document.createRange();
    for (var i = 0; i < text.length; i++) {
      var _char3 = text[i];
      if (_char3 === " " || _char3 === "\xA0") {
        continue;
      }
      if (_char3.trim() === "") {
        continue;
      }
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      var rects = range.getClientRects();
      if (!rects.length) continue;
      var rect = rects[0];
      var descriptor = createLetterSpan(_char3, rect, containerRect, computedStyle);
      fragments.push(descriptor);
    }
    range.detach();
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    var element = node;
    if (element.classList.contains(LETTER_CLASS)) {
      return;
    }
    var style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return;
    Array.from(node.childNodes).forEach(function (child) {
      return letterizeNode(child, containerRect, fragments, style);
    });
  }
};
var buildLetters = function buildLetters() {
  if (!leadContainer) return;
  var containerRect = leadContainer.getBoundingClientRect();
  var computedStyle = window.getComputedStyle(leadContainer);
  var fragments = [];
  resetLetterState();
  Array.from(leadContainer.childNodes).forEach(function (child) {
    return letterizeNode(child, containerRect, fragments, computedStyle);
  });
  leadContainer.innerHTML = "";
  fragments.forEach(function (_ref2) {
    var element = _ref2.element;
    return leadContainer.appendChild(element);
  });
  fragments.forEach(function (descriptor) {
    return registerLetterState(descriptor);
  });
};
var flattenInteractiveElements = function flattenInteractiveElements(container) {
  var interactiveNodes = container.querySelectorAll("interactive-element");
  interactiveNodes.forEach(function (node) {
    var _node$dataset;
    var text = ((_node$dataset = node.dataset) === null || _node$dataset === void 0 ? void 0 : _node$dataset.original) || node.textContent || "";
    var span = document.createElement("span");
    span.textContent = text;
    if (node.className) span.className = node.className;
    if (node.hasAttribute("style")) span.setAttribute("style", node.getAttribute("style"));
    node.replaceWith(span);
  });
};
var snapshotInteractiveElement = function snapshotInteractiveElement(node) {
  var _node$dataset2;
  var replacement = document.createElement("interactive-element");
  var originalText = ((_node$dataset2 = node.dataset) === null || _node$dataset2 === void 0 ? void 0 : _node$dataset2.original) || node.getAttribute("data-original") || node.textContent || "";
  Array.from(node.attributes).forEach(function (attr) {
    var name = attr.name,
      value = attr.value;
    if (!value) return;
    if (name === "class") {
      var filtered = value.split(/\s+/).map(function (cls) {
        return cls.trim();
      }).filter(function (cls) {
        return cls && cls !== "interactive-element" && cls !== "interactive-cycling";
      });
      if (filtered.length) {
        replacement.className = filtered.join(" ");
      }
      return;
    }
    if (name === "style") {
      replacement.setAttribute(name, value);
      return;
    }
    if (name.startsWith("data-")) {
      if (name === "data-original") return;
      if (name === "data-badge-dismissed") {
        replacement.setAttribute(name, value);
      }
      return;
    }
    if (name === "tabindex" && value === "0") return;
    replacement.setAttribute(name, value);
  });
  if (originalText) {
    replacement.textContent = originalText;
    replacement.setAttribute("data-original", originalText);
  }
  return replacement;
};
var snapshotLeadMarkup = function snapshotLeadMarkup(container) {
  var clone = container.cloneNode(true);
  clone.querySelectorAll("interactive-element").forEach(function (node) {
    var replacement = snapshotInteractiveElement(node);
    node.replaceWith(replacement);
  });
  return clone.innerHTML;
};
var onPointerMove = function onPointerMove(event) {
  if (!activeLetter) return;
  lastPointerEvent = event;
  if (animationFrame) return;
  animationFrame = window.requestAnimationFrame(function () {
    var _ref3, _lastPointerEvent$cli, _lastPointerEvent$tou, _ref4, _lastPointerEvent$cli2, _lastPointerEvent$tou2;
    animationFrame = null;
    if (!activeLetter || !lastPointerEvent) return;
    debugCount("pointer-move-frame");
    var state = DRAG_STATE.get(activeLetter);
    if (!state) return;
    if (state.pointerId !== undefined && state.pointerId !== null && event.pointerId !== undefined && state.pointerId !== event.pointerId) {
      return;
    }
    var pointerX = (_ref3 = (_lastPointerEvent$cli = lastPointerEvent.clientX) !== null && _lastPointerEvent$cli !== void 0 ? _lastPointerEvent$cli : (_lastPointerEvent$tou = lastPointerEvent.touches) === null || _lastPointerEvent$tou === void 0 || (_lastPointerEvent$tou = _lastPointerEvent$tou[0]) === null || _lastPointerEvent$tou === void 0 ? void 0 : _lastPointerEvent$tou.clientX) !== null && _ref3 !== void 0 ? _ref3 : 0;
    var pointerY = (_ref4 = (_lastPointerEvent$cli2 = lastPointerEvent.clientY) !== null && _lastPointerEvent$cli2 !== void 0 ? _lastPointerEvent$cli2 : (_lastPointerEvent$tou2 = lastPointerEvent.touches) === null || _lastPointerEvent$tou2 === void 0 || (_lastPointerEvent$tou2 = _lastPointerEvent$tou2[0]) === null || _lastPointerEvent$tou2 === void 0 ? void 0 : _lastPointerEvent$tou2.clientY) !== null && _ref4 !== void 0 ? _ref4 : 0;
    var deltaX = pointerX - state.startX;
    var deltaY = pointerY - state.startY;
    var targetOffsetX = state.initialX + deltaX;
    var targetOffsetY = state.initialY + deltaY;
    var letterState = getLetterState(activeLetter);
    if (!letterState) {
      activeLetter.style.transform = "translate3d(".concat(targetOffsetX, "px, ").concat(targetOffsetY, "px, 0)");
      updateLetterStateOffsets(activeLetter, targetOffsetX, targetOffsetY);
      return;
    }
    var moveX = targetOffsetX - letterState.offsetX;
    var moveY = targetOffsetY - letterState.offsetY;
    moveStateAlongAxis(letterState, moveX, "x");
    moveStateAlongAxis(letterState, moveY, "y");
    resolveAllOverlaps();
  });
};
var endDrag = function endDrag() {
  if (!activeLetter) return;
  var finishedLetter = activeLetter;
  finishedLetter.style.cursor = "grab";
  finishedLetter.style.zIndex = "1";
  var state = DRAG_STATE.get(finishedLetter);
  if ((state === null || state === void 0 ? void 0 : state.pointerId) !== undefined && activeLetter.releasePointerCapture) {
    try {
      finishedLetter.releasePointerCapture(state.pointerId);
    } catch (_error) {
      /* ignore */
    }
  }
  evaluateLetterDrop(finishedLetter);
  activeLetter = null;
  lastPointerEvent = null;
};
var onPointerDown = function onPointerDown(event) {
  var _ref5, _event$clientX, _event$touches, _ref6, _event$clientY, _event$touches2;
  var target = event.currentTarget;
  activeLetter = target;
  var rect = target.getBoundingClientRect();
  var pointerX = (_ref5 = (_event$clientX = event.clientX) !== null && _event$clientX !== void 0 ? _event$clientX : (_event$touches = event.touches) === null || _event$touches === void 0 || (_event$touches = _event$touches[0]) === null || _event$touches === void 0 ? void 0 : _event$touches.clientX) !== null && _ref5 !== void 0 ? _ref5 : 0;
  var pointerY = (_ref6 = (_event$clientY = event.clientY) !== null && _event$clientY !== void 0 ? _event$clientY : (_event$touches2 = event.touches) === null || _event$touches2 === void 0 || (_event$touches2 = _event$touches2[0]) === null || _event$touches2 === void 0 ? void 0 : _event$touches2.clientY) !== null && _ref6 !== void 0 ? _ref6 : 0;
  var currentTranslate = parseTranslate(target);
  DRAG_STATE.set(target, {
    startX: pointerX,
    startY: pointerY,
    initialX: currentTranslate.x,
    initialY: currentTranslate.y,
    pointerId: event.pointerId
  });
  if (target.setPointerCapture && event.pointerId !== undefined) {
    try {
      target.setPointerCapture(event.pointerId);
    } catch (_error) {
      /* ignore */
    }
  }
  if (event.pointerType === "touch") {
    event.preventDefault();
  }
  target.style.cursor = "grabbing";
  target.style.zIndex = "10";
};
var activateLetters = function activateLetters() {
  var letters = leadContainer.querySelectorAll(".".concat(LETTER_CLASS));
  letters.forEach(function (letter) {
    letter.addEventListener("pointerdown", onPointerDown, {
      passive: false
    });
    letter.addEventListener("pointerup", endDrag, {
      passive: true
    });
    letter.addEventListener("pointercancel", endDrag, {
      passive: true
    });
  });
  pointerMoveListener = onPointerMove;
  pointerUpListener = endDrag;
  window.addEventListener("pointermove", pointerMoveListener, {
    passive: false
  });
  window.addEventListener("pointerup", pointerUpListener, {
    passive: true
  });
  window.addEventListener("pointercancel", pointerUpListener, {
    passive: true
  });
};
var deactivateLetters = function deactivateLetters() {
  var _pointerMoveListener, _pointerUpListener, _pointerUpListener2;
  window.removeEventListener("pointermove", (_pointerMoveListener = pointerMoveListener) !== null && _pointerMoveListener !== void 0 ? _pointerMoveListener : function () {});
  window.removeEventListener("pointerup", (_pointerUpListener = pointerUpListener) !== null && _pointerUpListener !== void 0 ? _pointerUpListener : function () {});
  window.removeEventListener("pointercancel", (_pointerUpListener2 = pointerUpListener) !== null && _pointerUpListener2 !== void 0 ? _pointerUpListener2 : function () {});
  pointerMoveListener = null;
  pointerUpListener = null;
  activeLetter = null;
};
var restoreMarkup = function restoreMarkup() {
  if (!leadContainer || originalMarkup === null) return;
  deactivateLetters();
  resetLetterState();
  leadContainer.innerHTML = originalMarkup;
  leadContainer.classList.remove(ACTIVE_CLASS);
  leadContainer.style.height = "";
  leadContainer.style.position = "";
  leadContainer.style.userSelect = "";
  if (leadContainer.dataset) {
    delete leadContainer.dataset.hireModalShown;
  }
  originalMarkup = null;
  stopResizeObserver();
  leadContainer = null;
  updateContainerBounds();
};
var handleHireSecret = function handleHireSecret() {
  var scheduleHireForm = function scheduleHireForm() {
    if (typeof window === "undefined") return;
    var playground = window.Playground;
    if (playground && typeof playground.reset === "function") {
      playground.reset("hire");
    }
  };
  if (typeof window !== "undefined" && window.requestAnimationFrame) {
    window.requestAnimationFrame(scheduleHireForm);
  } else {
    scheduleHireForm();
  }
};
var SECRET_WORDS = {
  hire: handleHireSecret,
  reset: restoreMarkup,
  resume: "/resume"
};
var calculateLetterPositions = function calculateLetterPositions() {
  if (!leadContainer) return [];
  var start = DEBUG_MAGNET ? performance.now() : 0;
  var positions = Array.from(leadContainer.querySelectorAll(".".concat(LETTER_CLASS))).map(function (letter) {
    var _ref7, _letter$dataset$char;
    var rect = letter.getBoundingClientRect();
    return {
      element: letter,
      "char": (_ref7 = (_letter$dataset$char = letter.dataset["char"]) !== null && _letter$dataset$char !== void 0 ? _letter$dataset$char : letter.textContent) !== null && _ref7 !== void 0 ? _ref7 : "",
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    };
  });
  if (DEBUG_MAGNET) {
    debugTimeEnd("calculateLetterPositions", start);
    debugLog("letters measured", positions.length);
  }
  return positions;
};
var triggerSecretWord = function triggerSecretWord(word) {
  var _leadContainer;
  if (word === "hire" && ((_leadContainer = leadContainer) === null || _leadContainer === void 0 || (_leadContainer = _leadContainer.dataset) === null || _leadContainer === void 0 ? void 0 : _leadContainer.hireModalShown) === "true") {
    return true;
  }
  var handler = SECRET_WORDS[word];
  if (!handler) return false;
  if (typeof handler === "function") {
    handler();
  } else if (typeof handler === "string") {
    window.location.href = handler;
  }
  if (word === "hire" && leadContainer) {
    leadContainer.dataset.hireModalShown = "true";
  }
  return true;
};
var detectWord = function detectWord(targetWord) {
  if (!leadContainer) return false;
  if (!targetWord) return false;
  var letters = calculateLetterPositions();
  if (!letters.length) return false;
  var targetChars = targetWord.toLowerCase().split("");
  var matches = [];
  letters.forEach(function (info) {
    var _char4 = (info["char"] || "").toLowerCase();
    if (targetChars.includes(_char4) && _char4.trim() !== "") {
      matches.push(info);
    }
  });
  if (matches.length < targetChars.length) return false;
  matches.sort(function (a, b) {
    return a.left - b.left;
  });
  for (var i = 0; i <= matches.length - targetChars.length; i++) {
    var slice = matches.slice(i, i + targetChars.length);
    var isSequence = true;
    for (var j = 0; j < slice.length; j++) {
      var currentChar = (slice[j]["char"] || "").toLowerCase();
      if (currentChar !== targetChars[j]) {
        isSequence = false;
        break;
      }
      if (Math.abs(slice[j].top - slice[0].top) > LETTER_VERTICAL_TOLERANCE) {
        isSequence = false;
        break;
      }
      if (j > 0) {
        var prev = slice[j - 1];
        var prevRight = prev.left + prev.width;
        var gap = slice[j].left - prevRight;
        if (gap < 0 && Math.abs(gap) <= OVERLAP_TOLERANCE) gap = 0;
        if (gap < 0 || gap > LETTER_HORIZONTAL_TOLERANCE) {
          isSequence = false;
          break;
        }
      }
    }
    if (isSequence) return true;
  }
  return false;
};
var checkSecretWords = function checkSecretWords() {
  for (var _i = 0, _Object$keys = Object.keys(SECRET_WORDS); _i < _Object$keys.length; _i++) {
    var word = _Object$keys[_i];
    if (detectWord(word)) {
      triggerSecretWord(word);
      return true;
    }
  }
  return false;
};
var logLetterGroup = function logLetterGroup(group) {
  var text = group.map(function (item) {
    var _item$char;
    return (_item$char = item["char"]) !== null && _item$char !== void 0 ? _item$char : "";
  }).join("");
  var compact = text.replace(/\s+/g, "");
  var positions = group.map(function (item) {
    return {
      "char": item["char"],
      left: Math.round(item.left),
      top: Math.round(item.top),
      width: Math.round(item.width)
    };
  });
  // eslint-disable-next-line no-console
  console.log("Magnet groups:", compact || "(space)", positions);
  return compact.toLowerCase();
};
var collectSortedLetters = function collectSortedLetters() {
  var letters = calculateLetterPositions();
  letters.sort(function (a, b) {
    return a.left - b.left;
  });
  return letters;
};
var buildGroupAround = function buildGroupAround(letters, letterElement) {
  var index = letters.findIndex(function (item) {
    return item.element === letterElement;
  });
  if (index === -1) return [];
  var anchor = letters[index];
  var sameRow = letters.filter(function (letter) {
    return Math.abs(letter.top - anchor.top) <= LETTER_VERTICAL_TOLERANCE;
  }).sort(function (a, b) {
    return a.left - b.left;
  });
  var rowIndex = sameRow.findIndex(function (item) {
    return item.element === letterElement;
  });
  if (rowIndex === -1) return [anchor];
  var group = [sameRow[rowIndex]];
  var currentIndex = rowIndex;
  for (var i = rowIndex - 1; i >= 0; i--) {
    var candidate = sameRow[i];
    var reference = sameRow[currentIndex];
    var candidateRight = candidate.left + candidate.width;
    var referenceLeft = reference.left;
    var gap = referenceLeft - candidateRight;
    if (gap < 0 && Math.abs(gap) <= OVERLAP_TOLERANCE) gap = 0;
    if (gap < 0 || gap > LETTER_HORIZONTAL_TOLERANCE) break;
    group.unshift(candidate);
    currentIndex = i;
  }
  currentIndex = rowIndex;
  for (var _i2 = rowIndex + 1; _i2 < sameRow.length; _i2++) {
    var _candidate = sameRow[_i2];
    var _reference = sameRow[currentIndex];
    var referenceRight = _reference.left + _reference.width;
    var _gap = _candidate.left - referenceRight;
    if (_gap < 0 && Math.abs(_gap) <= OVERLAP_TOLERANCE) _gap = 0;
    if (_gap < 0 || _gap > LETTER_HORIZONTAL_TOLERANCE) break;
    group.push(_candidate);
    currentIndex = _i2;
  }
  return group;
};
var evaluateLetterDrop = function evaluateLetterDrop(letterElement) {
  var _leadContainer$datase;
  if (!leadContainer || !letterElement) return;
  if (((_leadContainer$datase = leadContainer.dataset) === null || _leadContainer$datase === void 0 ? void 0 : _leadContainer$datase.hireModalShown) === "true") {
    leadContainer.dataset.hireModalShown = "false";
  }
  var letters = collectSortedLetters();
  var group = buildGroupAround(letters, letterElement);
  if (!group.length) {
    checkSecretWords();
    return;
  }
  var normalized = logLetterGroup(group);
  var matchedWord = Object.keys(SECRET_WORDS).find(function (word) {
    return normalized.includes(word);
  });
  if (matchedWord) {
    triggerSecretWord(matchedWord);
    return;
  }
  checkSecretWords();
};
var stopResizeObserver = function stopResizeObserver() {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
};
var initResizeObserver = function initResizeObserver() {
  if (resizeObserver || !window.ResizeObserver) return;
  resizeObserver = new ResizeObserver(function (entries) {
    var resizeStart = DEBUG_MAGNET ? performance.now() : 0;
    var entry = entries[0];
    if (!entry || !leadContainer) return;
    var node = entry.target;
    var letters = Array.from(node.querySelectorAll(".".concat(LETTER_CLASS)));
    if (!letters.length) return;
    var containerRect = leadContainer.getBoundingClientRect();
    letters.forEach(function (letter) {
      var rect = letter.getBoundingClientRect();
      var relativeLeft = rect.left - containerRect.left;
      var relativeTop = rect.top - containerRect.top;
      var _parseTranslate = parseTranslate(letter),
        offsetX = _parseTranslate.x,
        offsetY = _parseTranslate.y;
      letter.style.left = "".concat(relativeLeft, "px");
      letter.style.top = "".concat(relativeTop, "px");
      letter.style.transform = "translate3d(".concat(offsetX, "px, ").concat(offsetY, "px, 0)");
      updateLetterStateBase(letter, relativeLeft, relativeTop, offsetX, offsetY);
    });
    if (DEBUG_MAGNET) {
      debugTimeEnd("resize-observer", resizeStart);
      debugLog("resize letters adjusted", letters.length);
    }
    updateContainerBounds();
    resolveAllOverlaps();
  });
  resizeObserver.observe(leadContainer);
};
var MagnetLetters = {
  activate: function activate() {
    if (originalMarkup !== null) return;
    leadContainer = document.getElementById("lead");
    if (!leadContainer) return;
    var rect = leadContainer.getBoundingClientRect();
    leadContainer.dataset.hireModalShown = "false";
    originalMarkup = snapshotLeadMarkup(leadContainer);
    leadContainer.classList.add(ACTIVE_CLASS);
    leadContainer.style.height = "".concat(rect.height, "px");
    leadContainer.style.position = "relative";
    leadContainer.style.userSelect = "none";
    updateContainerBounds();
    flattenInteractiveElements(leadContainer);
    buildLetters();
    updateContainerBounds();
    resolveAllOverlaps();
    activateLetters();
    initResizeObserver();
    checkSecretWords();
  },
  deactivate: restoreMarkup,
  isActive: function isActive() {
    return originalMarkup !== null;
  }
};

/***/ }),

/***/ "./resources/js/playground.js":
/*!************************************!*\
  !*** ./resources/js/playground.js ***!
  \************************************/
/***/ (() => {

var Playground = {
  initialized: false,
  playground: null,
  dynamicNodeClass: 'playground-dynamic',
  formWrap: null,
  hireOverlay: null,
  hireKeyListener: null,
  skillLookup: {},
  activeSkill: null,
  dropZoneRect: null,
  resizeListener: null,
  resizeTimeoutId: null,
  homepageTag: document.querySelector('name-element'),
  pageTitle: document.querySelector('#title > h1'),
  skills: [],
  needsReset: false,
  fontScale: 25,
  placedSkills: [],
  placedSkillAttempts: 0,
  speedLimit: 12,
  homepageTagHtml: false,
  init: function init(data) {
    Playground.initialized = true;
    if (!Playground.playground) Playground.playground = document.getElementById('lead');
    if (!Playground.playground) Playground.playground = document.getElementById('content');
    if (!Playground.playground) {
      console.warn('Playground container (#lead/#content) not found.');
      return;
    }
    Playground.clearDynamicNodes();
    Playground.skillLookup = Object.create(null);
    Playground.activeSkill = null;
    Playground.dropZoneRect = null;
    Playground.homepageTag.classList.add('border', 'border-4', 'border-transparent');
    if (Playground.playground.id === 'lead') {
      Playground.playground.innerHTML = '';
    } else {
      var leadContainer = document.getElementById('lead');
      if (leadContainer) leadContainer.innerHTML = '';
    }
    Playground.skills = data;
    Playground.playground.style.position = 'relative';
    Playground.playground.style.overflow = 'visible';
    Playground.attachResizeListener();
    var header = document.getElementById('main_header');
    var footer = document.getElementById('footer');
    var viewportHeight = window.innerHeight;
    var contentPaddingTop = 0;
    var availableHeight = Math.max(viewportHeight - (header ? header.offsetHeight : 0) - (footer ? footer.offsetHeight : 0) - contentPaddingTop, 420);
    Playground.playground.style.height = "".concat(availableHeight, "px");
    var computedStyle = getComputedStyle(Playground.playground);
    var paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    var paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    var paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    var paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    var placementBounds = {
      width: Playground.playground.clientWidth - paddingLeft - paddingRight,
      height: Playground.playground.clientHeight - paddingTop - paddingBottom,
      paddingLeft: paddingLeft,
      paddingTop: paddingTop
    };
    for (var skill in Playground.skills) {
      Playground.needsReset = false;
      Playground.skills[skill].element = document.createElement('div');
      Playground.skills[skill].active = false;
      Playground.skills[skill].isPositioned = false;
      Playground.skills[skill].currentX;
      Playground.skills[skill].currentY;
      Playground.skills[skill].initialX;
      Playground.skills[skill].initialY;
      Playground.skills[skill].xOffset = 0;
      Playground.skills[skill].yOffset = 0;
      Playground.skills[skill].pointerId = null;
      Playground.styleElement(Playground.skills[skill]);
      Playground.playground.appendChild(Playground.skills[skill].element);
      Playground.skillLookup[Playground.skills[skill].name] = Playground.skills[skill];
      if (!Playground.positionElement(Playground.skills[skill], placementBounds)) break;
      Playground.addClickListener(Playground.skills[skill]);
    }
    if (Playground.needsReset) Playground.reset('exceeded');
  },
  styleElement: function styleElement(skill) {
    skill.nameSpan = document.createElement('span');
    skill.nameSpan.classList.add('pointer-events-none');
    skill.nameSpan.innerText = skill.name;
    skill.element.appendChild(skill.nameSpan);
    skill.element.id = skill.name;
    skill.element.style.position = 'absolute';
    skill.element.style.color = Playground.getColorBasedOnExperience(skill.experience, 'hex');
    skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(skill.experience);
    skill.element.style.setProperty('--experience-color', Playground.getColorBasedOnExperience(skill.experience, 'hex'));
    skill.element.style.touchAction = 'none';
    skill.element.classList.add('hover:animate-float-text', 'text-bold', 'text-center', 'select-none', 'cursor-pointer', Playground.dynamicNodeClass, 'skill-item');
  },
  clearDynamicNodes: function clearDynamicNodes() {
    if (!Playground.playground) return;
    var removableNodes = Playground.playground.querySelectorAll('.' + Playground.dynamicNodeClass);
    removableNodes.forEach(function (node) {
      return node.remove();
    });
    Playground.formWrap = null;
  },
  attachResizeListener: function attachResizeListener() {
    if (Playground.resizeListener) return;
    Playground.resizeListener = function () {
      if (!Playground.playground || !Playground.playground.offsetParent) return;
      if (Playground.resizeTimeoutId) clearTimeout(Playground.resizeTimeoutId);
      Playground.resizeTimeoutId = window.setTimeout(function () {
        return Playground.reset('resize');
      }, 1000);
    };
    window.addEventListener('resize', Playground.resizeListener);
  },
  detachResizeListener: function detachResizeListener() {
    if (!Playground.resizeListener) return;
    window.removeEventListener('resize', Playground.resizeListener);
    Playground.resizeListener = null;
    if (Playground.resizeTimeoutId) {
      clearTimeout(Playground.resizeTimeoutId);
      Playground.resizeTimeoutId = null;
    }
  },
  disableSkills: function disableSkills() {
    Playground.skills.forEach(function (skill) {
      skill.element.classList.remove('text-' + Playground.getColorBasedOnExperience(skill.experience), 'hover:animate-float-text', 'cursor-pointer');
      skill.element.classList.add('text-gruvbox-black');
      if (skill.name != Playground.skillActive.name) skill.element.classList.add('animate-blur-text');
      skill.element.removeEventListener('pointerdown', Playground.dragStart, false);
    });
  },
  enableSkills: function enableSkills() {
    Playground.skills.forEach(function (skill) {
      setTimeout(function () {
        skill.element.classList.remove('animate-sharpen-text');
        skill.element.classList.add('hover:animate-float-text');
      }, 800);
      skill.element.classList.remove('text-gruvbox-black', 'animate-blur-text');
      skill.element.classList.add('text-' + Playground.getColorBasedOnExperience(skill.experience), 'cursor-pointer', 'animate-sharpen-text');
      skill.element.addEventListener('pointerdown', Playground.dragStart, false);
    });
  },
  addRandomFloatEffect: function addRandomFloatEffect(skill) {
    var animationTime = Math.random() * (15 - 2) + 2 + 's';
    var x = Math.random() * (10 - -10) + -10 + 'px';
    var y = Math.random() * (10 - -10) + -10 + 'px';
    skill.element.style.setProperty('--float-animation-time', animationTime);
    skill.element.style.setProperty('--float-fifty-percent-y', x);
    skill.element.style.setProperty('--float-fifty-percent-x', y);
  },
  positionElement: function positionElement(skill) {
    var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    while (!skill.isPositioned) {
      if (Playground.placedSkillAttempts > 200) {
        Playground.fontScale = Playground.fontScale + 2;
        Playground.needsReset = true;
        return false;
      }
      var playgroundBounds = bounds !== null && bounds !== void 0 ? bounds : {
        width: Playground.playground.clientWidth,
        height: Playground.playground.clientHeight,
        paddingLeft: 0,
        paddingTop: 0
      };
      var width = skill.element.offsetWidth;
      var height = skill.element.offsetHeight;
      var maxX = Math.max(playgroundBounds.width - width, 0);
      var maxY = Math.max(playgroundBounds.height - height, 0);
      var textXBound = playgroundBounds.paddingLeft + (maxX > 0 ? Math.random() * maxX : 0);
      var textYBound = playgroundBounds.paddingTop + (maxY > 0 ? Math.random() * maxY : 0);
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
        skill.originalTop = textYBound + 'px';
        skill.originalLeft = textXBound + 'px';
        skill.element.style.top = skill.originalTop;
        skill.element.style.left = skill.originalLeft;
        skill.isPositioned = true;
      }
      return true;
    }
  },
  reset: function reset(mode) {
    mode = mode || false;
    if (mode === 'hire') {
      Playground.showHireForm();
      return;
    }
    Playground.closeHireForm();
    if (Playground.activeSkill && Playground.activeSkill.element && typeof Playground.activeSkill.element.releasePointerCapture === 'function' && Playground.activeSkill.pointerId !== undefined && Playground.activeSkill.pointerId !== null) {
      try {
        Playground.activeSkill.element.releasePointerCapture(Playground.activeSkill.pointerId);
      } catch (err) {
        // ignore release errors (pointer already released)
      }
    }
    window.removeEventListener('pointermove', Playground.drag);
    window.removeEventListener('pointerup', Playground.dragEnd);
    window.removeEventListener('pointercancel', Playground.dragEnd);
    Playground.placedSkillAttempts = 0;
    Playground.placedSkills = [];
    if (mode != 'exceeded') Playground.fontScale = 25;
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('hire-modal-open');
    }
    for (var skill in Playground.skills) {
      Playground.skills[skill].active = false;
      if (Playground.skills[skill].element) {
        Playground.skills[skill].element.removeEventListener('pointerdown', Playground.dragStart);
        if (Playground.playground && Playground.skills[skill].element.parentNode === Playground.playground) {
          Playground.playground.removeChild(Playground.skills[skill].element);
        }
        delete Playground.skills[skill].element;
      }
    }
    Playground.clearDynamicNodes();
    Playground.formWrap = null;
    Playground.hireOverlay = null;
    Playground.skillLookup = Object.create(null);
    Playground.activeSkill = null;
    Playground.dropZoneRect = null;
    if (Playground.resizeTimeoutId) {
      clearTimeout(Playground.resizeTimeoutId);
      Playground.resizeTimeoutId = null;
    }
    if (Playground.initialized) {
      Playground.init(Playground.skills);
    }
  },
  resetSkillPosition: function resetSkillPosition(skill) {
    for (var position in Playground.placedSkills) {
      if (Playground.placedSkills[position].name == skill.name) {
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
    if (!name) return null;
    if (Playground.skillLookup && Playground.skillLookup[name]) return Playground.skillLookup[name];
    for (var skill in Playground.skills) {
      if (Playground.skills[skill].name == name) return Playground.skills[skill];
    }
    return null;
  },
  getFontSizeBasedOnExperience: function getFontSizeBasedOnExperience(experience) {
    return experience / Playground.fontScale + 'em';
  },
  getColorBasedOnExperience: function getColorBasedOnExperience(experience, type) {
    switch (true) {
      case experience == 101:
        if (type == 'hex') return '#b16286';
        return 'gruvbox-purple';
      case experience == 102:
        if (type == 'hex') return '#cc241d';
        return 'gruvbox-red';
      case experience == 100:
        if (type == 'hex') return '#fbf1c7';
        return 'gruvbox-white';
      default:
        if (type == 'hex') return '#b8bb26';
        return 'gruvbox-green';
    }
  },
  skillsOverlap: function skillsOverlap(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
      return true;
    }
    return false;
  },
  addClickListener: function addClickListener(skill) {
    skill.element.addEventListener('pointerdown', Playground.dragStart, false);
  },
  dragStart: function dragStart(e) {
    var _e$target;
    var hostElement = e.currentTarget;
    var skill = hostElement && Playground.getSkillBasedOnName(hostElement.id) || Playground.getSkillBasedOnName((_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.id);
    if (!skill || !skill.element) return;
    if (!skill.element.contains(e.target)) return;
    if (Playground.homepageTag) Playground.homepageTag.setAttribute('data-content', skill.name);
    if (Playground.pageTitle) Playground.pageTitle.innerText = 'Drag & Drop';
    if (Playground.homepageTag) {
      Playground.homepageTag.classList.remove('border-transparent');
      Playground.homepageTag.classList.add('border-dashed');
    }
    Playground.activeSkill = skill;
    Playground.dropZoneRect = Playground.homepageTag && Playground.homepageTag.getBoundingClientRect();
    if (e.pointerType === 'touch') e.preventDefault();
    if (typeof e.pointerId !== 'undefined') {
      skill.pointerId = e.pointerId;
    } else {
      skill.pointerId = null;
    }
    try {
      if (typeof e.pointerId !== 'undefined' && skill.element.setPointerCapture) {
        skill.element.setPointerCapture(e.pointerId);
      }
    } catch (err) {
      // pointer capture optional; ignore failures
    }
    window.addEventListener('pointermove', Playground.drag);
    window.addEventListener('pointerup', Playground.dragEnd);
    window.addEventListener('pointercancel', Playground.dragEnd);
    skill.element.style.zIndex = '11';
    skill.element.classList.remove('cursor-pointer');
    skill.element.classList.add('cursor-move');
    if (skill.heldCounter && skill.heldCounter > 2) {
      clearInterval(skill.heldCounter);
    }
    skill.initialX = e.clientX - (skill.xOffset || 0);
    skill.initialY = e.clientY - (skill.yOffset || 0);
    skill.dragActive = true;
  },
  dragEnd: function dragEnd(e) {
    var _e$target2;
    var skill = Playground.activeSkill || Playground.getSkillBasedOnName((_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : _e$target2.id);
    if (!skill || !skill.element) return;
    if (typeof e.pointerId !== 'undefined' && skill.pointerId !== undefined && skill.pointerId !== null && skill.pointerId !== e.pointerId) {
      return;
    }
    window.removeEventListener('pointermove', Playground.drag);
    window.removeEventListener('pointerup', Playground.dragEnd);
    window.removeEventListener('pointercancel', Playground.dragEnd);
    try {
      if (skill.pointerId !== undefined && skill.pointerId !== null && typeof skill.element.releasePointerCapture === 'function' && (!skill.element.hasPointerCapture || skill.element.hasPointerCapture(skill.pointerId))) {
        skill.element.releasePointerCapture(skill.pointerId);
      }
    } catch (err) {
      // ignore pointer capture release failures
    }
    skill.pointerId = null;
    skill.element.classList.remove('cursor-move');
    skill.element.classList.add('cursor-pointer');
    skill.element.style.zIndex = '1';
    skill.dragActive = false;
    skill.infoShowing = false;
    if (skill.name == 'hire me') Playground.removeHireHint(skill);
    Playground.removeHint(skill);
    Playground.resetSkillPosition(skill);
    if (skill.atTarget) {
      if (skill.name == 'hire me') {
        Playground.reset('hire');
      } else if (skill.name == 'reset();') {
        Playground.reset();
      } else {
        Playground.displayInfoCard(skill);
      }
      skill.atTarget = false;
    }
    if (Playground.pageTitle) Playground.pageTitle.innerText = "Hi. I'm";
    if (Playground.homepageTag) {
      Playground.homepageTag.classList.add('border-transparent');
      Playground.homepageTag.classList.remove('border-dashed');
    }
    Playground.activeSkill = null;
    Playground.dropZoneRect = null;
  },
  drag: function drag(e) {
    var skill = Playground.activeSkill;
    if (!skill || !skill.dragActive || !skill.element) return;
    if (typeof e.pointerId !== 'undefined' && skill.pointerId !== undefined && skill.pointerId !== null && skill.pointerId !== e.pointerId) {
      return;
    }
    if (e.pointerType === 'touch') e.preventDefault();
    if (!skill.elementChild) Playground.buildInfoCard(skill);
    var isForm = Playground.draggingEvents(e, skill);
    skill.currentX = e.clientX - skill.initialX;
    skill.currentY = e.clientY - skill.initialY;
    if (!isForm) {
      Playground.setTranslate(skill.currentX, skill.currentY, skill.element);
    }
  },
  draggingEvents: function draggingEvents(e, skill) {
    if (!skill || !skill.element || !Playground.homepageTag) return false;
    var dropZoneRect = Playground.dropZoneRect || Playground.homepageTag.getBoundingClientRect();
    if (!dropZoneRect) return false;
    var elementRect = skill.element.getBoundingClientRect();
    var isAtTarget = Playground.skillsOverlap(elementRect, dropZoneRect);
    if (isAtTarget && !skill.atTarget) {
      Playground.homepageTag.classList.add('border-gruvbox-green');
      if (Playground.homepageTag.classList.contains('text-gruvbox-gray')) {
        Playground.homepageTag.classList.remove('text-gruvbox-gray', 'shadow-inner', 'border-gruvbox-green');
        Playground.homepageTag.classList.add('text-' + Playground.getColorBasedOnExperience(skill.experience));
      }
    } else if (!isAtTarget && skill.atTarget) {
      Playground.homepageTag.classList.remove('border-gruvbox-green');
    }
    if (!isAtTarget) Playground.skillActive = skill;
    skill.atTarget = isAtTarget;
    return false;
  },
  addHint: function addHint(skill) {
    skill.elementHint = document.createElement('div');
    skill.elementHint.classList.add('self-center', 'justify-self-center', 'cursor-pointer', 'text-sm', 'text-gruvbox-white', 'max-w-md', 'text-center');
    skill.elementHint.innerHTML = 'drag and drop';
    skill.element.appendChild(skill.elementHint);
  },
  addHireHint: function addHireHint(skill) {
    skill.elementHireHint = document.createElement('div');
    skill.elementHireHint.classList.add('self-center', 'justify-self-center', 'text-sm', 'text-gruvbox-white', 'text-center', 'bg-gruvbox-black', 'm-auto');
    skill.elementHireHint.innerHTML = '&uuarr; hire me! &ddarr;';
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
    el.style.transform = 'translate(' + xPos + 'px, ' + yPos + 'px)';
  },
  buildInfoCard: function buildInfoCard(skill) {
    skill.elementChild = document.createElement('div');
    skill.elementChild.style.fontSize = '16px';
    skill.elementChild.classList.add('flex', 'flex-col', 'bg-gruvbox-black', 'p-2', 'h-80', 'md:h-auto', 'overflow-y-auto', 'overflow-x-hidden');
    Playground.buildInfoCardCloseElement(skill);
    Playground.buildExperienceDiv(skill);
    skill.elementChildExcerpt = document.createElement('div');
    skill.elementChildExcerpt.classList.add('m-2', 'text-left', 'align-top', 'md:self-start', 'self-center', 'text-gruvbox-white');
    skill.elementChildExcerpt.textContent = skill.excerpt;
  },
  buildInfoCardCloseElement: function buildInfoCardCloseElement(skill) {
    skill.closeInfoCard = document.createElement('div');
    skill.closeInfoCard.classList.add('absolute', '-top-20', 'z-20', 'right-0', 'cursor-pointer', 'text-6xl');
    skill.closeButton = document.createElement('span');
    skill.closeButton.classList.add('text-gruvbox-red', 'hover:text-red-400');
    skill.closeButton.setAttribute('role', 'button');
    skill.closeButton.setAttribute('aria-label', 'Close skill details');
    skill.closeButton.textContent = '×';
    skill.closeButtonHandler = function () {
      return Playground.closeInfoCard(skill.name);
    };
    skill.closeButton.addEventListener('click', skill.closeButtonHandler);
    skill.closeInfoCard.appendChild(skill.closeButton);
  },
  closeInfoCard: function closeInfoCard(skill_name) {
    var skill = Playground.getSkillBasedOnName(skill_name);
    if (!skill || !skill.element) return;
    if (skill.elementChild && skill.elementChild.parentNode === skill.element) {
      skill.element.removeChild(skill.elementChild);
    }
    if (skill.closeInfoCard && skill.closeInfoCard.parentNode === skill.element) {
      skill.element.removeChild(skill.closeInfoCard);
    }
    if (skill.closeButton && skill.closeButtonHandler) {
      skill.closeButton.removeEventListener('click', skill.closeButtonHandler);
    }
    delete skill.closeButton;
    delete skill.closeButtonHandler;
    skill.element.style.top = skill.originalTop;
    skill.element.style.left = skill.originalLeft;
    skill.element.style.zIndex = '1';
    skill.element.style.transform = 'unset';
    skill.element.style.backgroundImage = 'unset';
    skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(skill.experience);
    skill.element.classList.remove('animate-float-bg', 'bg-' + Playground.getColorBasedOnExperience(skill.experience), 'lg:w-5/12', 'md:w-7/12', 'w-11/12');
    skill.element.classList.add('hover:animate-float-text', 'text-' + Playground.getColorBasedOnExperience(skill.experience));
    skill.nameSpan.classList.remove('text-gruvbox-black');

    //resetHomepageDeveloperTag();
    Playground.homepageTag.setAttribute('data-content', 'Trever');
    Playground.removeHint(skill);
    Playground.enableSkills();
    skill.infoShowing = false;
  },
  buildExperienceDiv: function buildExperienceDiv(skill) {
    skill.elementChildExperienceWrap = document.createElement('div');
    skill.elementChildExperienceWrap.classList.add('flex', 'flex-row', 'cursor-pointer', 'p-2');
    skill.elementChildExperienceWrapLabel = document.createElement('div');
    skill.elementChildExperienceWrapLabel.innerHTML = 'Experience: &nbsp; &nbsp;';
    skill.elementChildExperienceWrapLabel.classList.add('text-gruvbox-gray', 'mr-4');
    skill.elementChildExperienceWrapLabelExperience = document.createElement('div');
    skill.elementChildExperienceWrapLabelExperience.innerText = skill.experience;
    skill.elementChildExperienceWrapLabelExperience.classList.add('text-' + Playground.getColorBasedOnExperience(skill.experience) + '');
    skill.elementChildExperienceWrapLabelExperienceSlash = document.createElement('div');
    skill.elementChildExperienceWrapLabelExperienceSlash.innerHTML = '&nbsp;/&nbsp;';
    skill.elementChildExperienceWrapLabelExperienceSlash.classList.add('text-gruvbox-white');
    skill.elementChildExperienceWrapLabelExperienceFull = document.createElement('div');
    skill.elementChildExperienceWrapLabelExperienceFull.innerText = '100';
    skill.elementChildExperienceWrapLabelExperienceFull.classList.add('text-gruvbox-white');
  },
  removeAllClickListeners: function removeAllClickListeners() {
    Playground.skills.forEach(function (skill) {
      skill.element.removeEventListener('mousedown', Playground.dragStart, false);
      skill.element.removeEventListener('touchstart', Playground.dragStart, false);
    });
  },
  displayInfoCard: function displayInfoCard(skill) {
    Playground.removeAllClickListeners();
    Playground.disableSkills();
    skill.element.style.top = '10%';
    skill.element.style.left = '50%';
    skill.element.style.transform = 'translate(-50%, 0)';
    skill.element.style.zIndex = '12';
    skill.element.style.fontSize = Playground.getFontSizeBasedOnExperience(100);
    skill.element.classList.remove('hover:animate-float-text', 'text-' + Playground.getColorBasedOnExperience(skill.experience));
    for (var index = 0; index < 101; index++) skill.element.style.setProperty('--experience-percent-' + index, skill.experience > index ? index + '%' : skill.experience + '%');
    skill.nameSpan.classList.add('text-gruvbox-black');
    skill.element.classList.add('animate-float-bg', 'lg:w-5/12', 'md:w-7/12', 'w-11/12');
    skill.element.appendChild(skill.elementChild);
    skill.element.appendChild(skill.closeInfoCard);
    if (skill.name != 'README.md' && skill.name != 'hire me') {
      skill.elementChild.appendChild(skill.elementChildExperienceWrap);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabel);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperience);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperienceSlash);
      skill.elementChildExperienceWrap.appendChild(skill.elementChildExperienceWrapLabelExperienceFull);
    }
    skill.elementChild.appendChild(skill.elementChildExcerpt);
    skill.infoShowing = true;
  },
  showHireForm: function showHireForm() {
    if (Playground.hireOverlay) return;
    Playground.detachResizeListener();
    if (!Playground.playground) Playground.playground = document.getElementById('lead');
    if (!Playground.playground) Playground.playground = document.getElementById('content');
    if (!Playground.playground) {
      console.warn('Playground container (#lead/#content) not found.');
      return;
    }
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('hire-modal-open');
    }
    var overlay = document.createElement('div');
    overlay.classList.add('hire-modal-overlay');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) Playground.closeHireForm();
    });
    var modal = document.createElement('div');
    modal.classList.add('hire-modal');
    overlay.appendChild(modal);
    var modalHeader = document.createElement('div');
    modalHeader.classList.add('hire-modal-header');
    var closeFormButton = document.createElement('button');
    closeFormButton.type = 'button';
    closeFormButton.classList.add('hire-modal-close');
    closeFormButton.setAttribute('aria-label', 'Close hire form');
    closeFormButton.innerHTML = '&times;';
    closeFormButton.addEventListener('click', function () {
      return Playground.closeHireForm();
    });
    modalHeader.appendChild(closeFormButton);
    modal.appendChild(modalHeader);
    var formWrap = document.createElement('div');
    formWrap.classList.add('hire-modal-body');
    Playground.formWrap = formWrap;
    modal.appendChild(formWrap);
    var hireMeForm = document.createElement('form');
    hireMeForm.id = 'hire_me_form';
    hireMeForm.classList.add('flex', 'flex-col', 'items-center', 'gap-4', 'px-6', 'pb-6', 'w-full');
    var formInfo = document.createElement('p');
    formInfo.innerText = "First of all, I'm very excited to hear that you are interested in working with me! I love hearing new project ideas, so go ahead and fill out the form below with your contact info, and a brief overview of the project in mind, and I will get back to you asap!";
    formInfo.classList.add('text-gruvbox-white', 'text-center', 'mb-2');
    var submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.innerText = 'Submit';
    submitButton.classList.add('hover:bg-gruvbox-purple', 'bg-gruvbox-green', 'text-gruvbox-black', 'text-2xl', 'font-bold', 'px-6', 'py-3', 'mt-4', 'self-center');
    var formTitle = document.createElement('h2');
    formTitle.id = 'hire-form-title';
    formTitle.innerText = 'hire me';
    formTitle.classList.add('text-gruvbox-green', 'text-4xl', 'text-center', 'mt-2');
    var emailInput = document.createElement('input');
    emailInput.name = 'email';
    emailInput.type = 'email';
    emailInput.classList.add('w-full', 'p-4', 'bg-gruvbox-black', 'text-gruvbox-white');
    var emailLabel = document.createElement('label');
    emailLabel.innerText = 'Email';
    emailLabel.classList.add('text-gruvbox-green', 'w-full', 'text-left', 'mt-4');
    var organizationInput = document.createElement('input');
    organizationInput.name = 'name';
    organizationInput.type = 'text';
    organizationInput.classList.add('w-full', 'p-4', 'bg-gruvbox-black', 'text-gruvbox-white');
    var organizationLabel = document.createElement('label');
    organizationLabel.classList.add('text-gruvbox-green', 'w-full', 'text-left', 'mt-4');
    organizationLabel.innerText = 'Organization';
    var firstNameInput = document.createElement('input');
    firstNameInput.name = 'first_name';
    firstNameInput.type = 'text';
    firstNameInput.classList.add('w-full', 'p-4', 'bg-gruvbox-black', 'text-gruvbox-white');
    var firstNameLabel = document.createElement('label');
    firstNameLabel.innerText = 'First Name';
    firstNameLabel.classList.add('text-gruvbox-green', 'w-full', 'text-left', 'mt-4');
    var lastNameInput = document.createElement('input');
    lastNameInput.name = 'last_name';
    lastNameInput.type = 'text';
    lastNameInput.classList.add('w-full', 'p-4', 'bg-gruvbox-black', 'text-gruvbox-white');
    var lastNameLabel = document.createElement('label');
    lastNameLabel.innerText = 'Last Name';
    lastNameLabel.classList.add('text-gruvbox-green', 'w-full', 'text-left', 'mt-4');
    var phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.classList.add('w-full', 'p-4', 'bg-gruvbox-black', 'text-gruvbox-white');
    //phoneInputpattern = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
    var phoneLabel = document.createElement('label');
    phoneLabel.innerText = 'Phone Number';
    phoneLabel.classList.add('text-gruvbox-green', 'w-full', 'text-left', 'mt-4');
    var descriptionInput = document.createElement('textarea');
    descriptionInput.name = 'description';
    descriptionInput.classList.add('w-full', 'p-4', 'bg-gruvbox-black', 'text-gruvbox-white');
    descriptionInput.style.minHeight = '8rem';
    var descriptionLabel = document.createElement('label');
    descriptionLabel.innerText = 'Description';
    descriptionLabel.classList.add('text-gruvbox-green', 'w-full', 'text-left', 'mt-4');
    Playground.playground.classList.remove('touch-action-none');
    Playground.hireOverlay = overlay;
    document.body.appendChild(overlay);
    modal.setAttribute('aria-labelledby', formTitle.id);
    var handleKeydown = function handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        Playground.closeHireForm();
      }
    };
    Playground.hireKeyListener = handleKeydown;
    document.addEventListener('keydown', handleKeydown);
    if (Playground.playground) {
      Playground.playground.dataset.hireModalShown = 'true';
    }
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(function () {
        closeFormButton.focus();
      });
    }
    formWrap.appendChild(hireMeForm);
    hireMeForm.appendChild(formTitle);
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
      if (firstNameLabel.classList.contains('text-gruvbox-red')) {
        firstNameLabel.classList.remove('text-gruvbox-red');
        firstNameLabel.classList.add('text-gruvbox-green');
        firstNameLabel.innerText = 'First Name';
      }
      if (lastNameLabel.classList.contains('text-gruvbox-red')) {
        lastNameLabel.classList.remove('text-gruvbox-red');
        lastNameLabel.classList.add('text-gruvbox-green');
        lastNameLabel.innerText = 'Last Name';
      }
      if (emailLabel.classList.contains('text-gruvbox-red')) {
        emailLabel.classList.remove('text-gruvbox-red');
        emailLabel.classList.add('text-gruvbox-green');
        emailLabel.innerText = 'Last Name';
      }
      if (formInfo.classList.contains('text-gruvbox-yellow')) {
        formInfo.classList.remove('text-gruvbox-orange');
        formInfo.classList.remove('text-gruvbox-green');
      }
      var hireMeForm = document.getElementById('hire_me_form');
      // console.log(hireMeForm[0])
      var data = new FormData(hireMeForm);
      // console.log(data)

      var csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      var url = '/developer';
      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text-plain, */*',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrf_token
        },
        method: 'POST',
        credentials: 'same-origin',
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
          if (data.errors['first_name']) {
            firstNameLabel.classList.remove('text-gruvbox-green');
            firstNameLabel.innerText = 'First Name *required';
            firstNameLabel.classList.add('text-gruvbox-red');
          }
          if (data.errors['last_name']) {
            lastNameLabel.classList.remove('text-gruvbox-green');
            lastNameLabel.innerText = 'Last Name *required';
            lastNameLabel.classList.add('text-gruvbox-red');
          }
          if (data.errors['email'] && data.errors['email'][0] !== 'The email has already been taken.') {
            emailLabel.classList.remove('text-gruvbox-green');
            emailLabel.innerText = 'Email *required';
            emailLabel.classList.add('text-gruvbox-red');
          }
          if (data.errors['email'] && data.errors['email'][0] == 'The email has already been taken.') {
            formInfo.classList.remove('text-gruvbox-green');
            formInfo.classList.add('text-gruvbox-orange');
            formInfo.innerHTML = '<span class="text-gruvbox-yellow">Oh, ' + (firstNameInput.value.length > 0 ? firstNameInput.value + ',' : ',') + ' it looks like you have already contacted me. I will get to reviewing it right away!</span>';
          }
          submitButton.removeAttribute('disabled');
        }
        if (data.status == 'ok') {
          formWrap.removeChild(hireMeForm);
          var _formInfo = document.createElement('p');
          _formInfo.innerText = data.message;
          _formInfo.classList.add('text-gruvbox-white', 'mb-4');
          formWrap.appendChild(_formInfo);
        }
      })["catch"](function (errors) {
        var formInfo = document.createElement('p');
        formInfo.innerText = errors.message;
        formInfo.classList.add('text-gruvbox-red', 'mb-4');
        formWrap.appendChild(formInfo);
      });
    };
  },
  closeHireForm: function closeHireForm() {
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('hire-modal-open');
    }
    if (Playground.hireOverlay) {
      Playground.hireOverlay.remove();
      Playground.hireOverlay = null;
    }
    if (Playground.hireKeyListener) {
      document.removeEventListener('keydown', Playground.hireKeyListener);
      Playground.hireKeyListener = null;
    }
    Playground.formWrap = null;
    Playground.attachResizeListener();
  }
};
window.Playground = Playground;
//export { Playground };

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