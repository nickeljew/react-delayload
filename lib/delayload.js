'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setThrottleMilliseconds = exports.delayload = exports["default"] = void 0;

var _react = require("react");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = require("react-dom");

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var throttle_ms = 100;
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

var DelayLoad = function (_Component) {
  _inherits(DelayLoad, _Component);

  var _super = _createSuper(DelayLoad);

  function DelayLoad(props, context) {
    var _this;

    _classCallCheck(this, DelayLoad);

    _this = _super.call(this, props, context);
    _this.state = {
      visible: !_this.props.enableDelay
    };
    var func = (0, _lodash.throttle)(function () {
      if (inviewport((0, _reactDom.findDOMNode)(this), this.props.threshold)) {
        this.setState({
          visible: true
        });
        this.onLoaded();
      }
    }, throttle_ms);
    _this.checkVisible = func.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(DelayLoad, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!isBrowser) return;
      if (!this.state.visible) this.checkVisible();

      if (this.props.enableDelay && window.addEventListener) {
        window.addEventListener('scroll', this.checkVisible);
        window.addEventListener('resize', this.checkVisible);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.onLoaded();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (isBrowser && !this.state.visible) this.checkVisible();
    }
  }, {
    key: "onLoaded",
    value: function onLoaded() {
      if (isBrowser && this.props.enableDelay && window.removeEventListener) {
        window.removeEventListener('scroll', this.checkVisible);
        window.removeEventListener('resize', this.checkVisible);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var style = {};

      if (this.props.height > 0 && !this.state.visible) {
        style.height = this.props.height;
      }

      if (this.props.style) {
        style = extend(style, this.props.style);
      }

      var cssClass = this.props.className || '';
      return React.createElement("div", {
        style: style,
        className: cssClass
      }, this.state.visible ? this.props.children : '');
    }
  }]);

  return DelayLoad;
}(_react.Component);

DelayLoad.propTypes = {
  enableDelay: _propTypes["default"].bool,
  height: _propTypes["default"].number,
  threshold: _propTypes["default"].number
};
DelayLoad.defaultProps = {
  enableDelay: true,
  height: 0,
  threshold: 0
};
var _default = DelayLoad;
exports["default"] = _default;
var _Elements = [],
    _DOMReadyInit = false;

var delayload = function delayload(el, options) {
  if (!el) return false;

  _Elements.push(el);

  var settings = {
    threshold: 0,
    height: 0,
    data_attribute: "original"
  };
  options && (settings = extend(settings, options));
  var checkEmptyTime = 0;
  var checkVisible = (0, _lodash.throttle)(function () {
    var elements = _Elements.slice(0);

    if (elements.length === 0 && ++checkEmptyTime >= 3) {
      if (window.removeEventListener) {
        window.removeEventListener('scroll', checkVisible);
        window.removeEventListener('resize', checkVisible);
      }

      return;
    }

    for (var i = 0; i < elements.length; i++) {
      var elem = elements[i];

      if (inviewport(elem, settings.threshold)) {
        elements.splice(i--, 1);
        var src = elem.getAttribute('data-' + settings.data_attribute);

        if (elem.tagName.toLowerCase() === 'img') {
          elem.setAttribute('src', src);
          if (+settings.height > 0) elem.style.height = 'auto';
        } else {
          elem.style.backgroundImage = "url('" + src + "')";
        }
      }
    }

    if (elements.length !== _Elements.length) {
      _Elements = elements;
    }
  }, throttle_ms);

  if (el.tagName.toLowerCase() === 'img') {
    var src = el.getAttribute('src');

    if (src) {
      el.setAttribute('data-' + settings.data_attribute, src);
      el.setAttribute('src', '');

      if (+settings.height > 0) {
        el.style.height = settings.height + 'px';
      }
    }
  } else {
    var bgimg = el.style.backgroundImage;

    if (bgimg) {}
  }

  if (window.addEventListener) {
    window.addEventListener('scroll', checkVisible);
    window.addEventListener('resize', checkVisible);
  }

  checkVisible();
  return el;
};

exports.delayload = delayload;

var setThrottleMilliseconds = function setThrottleMilliseconds(ms) {
  if (typeof ms === 'number' && ms > 30) throttle_ms = ms;
};

exports.setThrottleMilliseconds = setThrottleMilliseconds;

function inviewport(el, threshold) {
  if (!isBrowser) return false;
  if (typeof threshold !== 'number' || isNaN(threshold)) threshold = 0;
  var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var rect = el.getBoundingClientRect();
  var validRect = {
    top: rect.top - threshold,
    left: rect.left - threshold,
    right: rect.right + threshold,
    bottom: rect.bottom + threshold
  };
  return validRect.right > 0 && validRect.bottom > 0 && validRect.top < winHeight && validRect.left < winWidth;
}

function extend(base, override) {
  var mergedObject = {};

  var isObject = function isObject(arg) {
    return _typeof(arg) === 'object' && arg !== null;
  };

  Object.keys(base).forEach(function (key) {
    var baseProp = base[key];
    var overrideProp;
    if (isObject(override)) overrideProp = override[key];
    mergedObject[key] = isObject(baseProp) && !Array.isArray(baseProp) ? extend(baseProp, overrideProp) : baseProp;
  });

  if (isObject(override)) {
    Object.keys(override).forEach(function (overrideKey) {
      var overrideProp = override[overrideKey];

      if (!isObject(overrideProp) || Array.isArray(overrideProp)) {
        mergedObject[overrideKey] = overrideProp;
      }
    });
  }

  return mergedObject;
}
