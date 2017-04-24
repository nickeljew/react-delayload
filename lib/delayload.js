'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setThrottleMilliseconds = exports.delayload = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _throttle = require('lodash/function/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var throttle_ms = 100;

var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

var DelayLoad = function (_Component) {
    _inherits(DelayLoad, _Component);

    function DelayLoad(props, context) {
        _classCallCheck(this, DelayLoad);

        var _this = _possibleConstructorReturn(this, (DelayLoad.__proto__ || Object.getPrototypeOf(DelayLoad)).call(this, props, context));

        _this.state = {
            visible: !_this.props.enableDelay
        };

        var func = (0, _throttle2.default)(function () {
            if (inviewport((0, _reactDom.findDOMNode)(this), this.props.threshold)) {
                this.setState({ visible: true });
                this.onLoaded();
            }
        }, throttle_ms);

        _this.checkVisible = func.bind(_this);
        return _this;
    }

    _createClass(DelayLoad, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (!isBrowser) return;

            if (!this.state.visible) this.checkVisible();

            if (this.props.enableDelay && window.addEventListener) {
                window.addEventListener('scroll', this.checkVisible);
                window.addEventListener('resize', this.checkVisible);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.onLoaded();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (isBrowser && !this.state.visible) this.checkVisible();
        }
    }, {
        key: 'onLoaded',
        value: function onLoaded() {
            if (isBrowser && this.props.enableDelay && window.removeEventListener) {
                window.removeEventListener('scroll', this.checkVisible);
                window.removeEventListener('resize', this.checkVisible);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var style = {};

            if (this.props.height > 0 && !this.state.visible) {
                style.height = this.props.height;
            }
            if (this.props.style) {
                style = extend(style, this.props.style);
            }

            var cssClass = this.props.className || '';

            return React.createElement(
                'div',
                { style: style, className: cssClass },
                this.state.visible ? this.props.children : ''
            );
        }
    }]);

    return DelayLoad;
}(_react.Component);

DelayLoad.propTypes = {
    enableDelay: _propTypes2.default.bool,
    height: _propTypes2.default.number,
    threshold: _propTypes2.default.number
};
DelayLoad.defaultProps = {
    enableDelay: true,
    height: 0,
    threshold: 0
};

exports.default = DelayLoad;


var _Elements = [],
    _DOMReadyInit = false;
var delayload = exports.delayload = function delayload(el, options) {
    if (!el) return false;

    _Elements.push(el);

    var settings = {
        threshold: 0,
        height: 0,
        data_attribute: "original"
    };
    options && (settings = extend(settings, options));

    var checkEmptyTime = 0;

    var checkVisible = (0, _throttle2.default)(function () {
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

var setThrottleMilliseconds = exports.setThrottleMilliseconds = function setThrottleMilliseconds(ms) {
    if (typeof ms === 'number' && ms > 30) throttle_ms = ms;
};

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
        return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
    };

    Object.keys(base).forEach(function (key) {

        var baseProp = base[key];
        var overrideProp = void 0;

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
