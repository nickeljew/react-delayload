'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setThrottleMilliseconds = exports.delayload = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _throttle = require('lodash/function/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var throttle_ms = 100;

var DelayLoad = _react2.default.createClass({
    displayName: 'DelayLoad',

    propTypes: {
        enableDelay: _react2.default.PropTypes.bool,
        height: _react2.default.PropTypes.number,
        threshold: _react2.default.PropTypes.number
    },
    getDefaultProps: function getDefaultProps() {
        return {
            enableDelay: true,
            height: 0,
            threshold: 0
        };
    },
    getInitialState: function getInitialState() {
        return {
            visible: !this.props.enableDelay
        };
    },
    componentDidMount: function componentDidMount() {
        if (!this.state.visible) this.checkVisible();

        if (this.props.enableDelay && window.addEventListener) {
            window.addEventListener('scroll', this.checkVisible);
            window.addEventListener('resize', this.checkVisible);
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.onLoaded();
    },
    componentDidUpdate: function componentDidUpdate() {
        if (!this.state.visible) this.checkVisible();
    },

    onLoaded: function onLoaded() {
        if (this.props.enableDelay && window.removeEventListener) {
            window.removeEventListener('scroll', this.checkVisible);
            window.removeEventListener('resize', this.checkVisible);
        }
    },
    checkVisible: (0, _throttle2.default)(function () {
        if (inviewport(this.getDOMNode(), this.props.threshold)) {
            this.setState({ visible: true });
            this.onLoaded();
        }
    }, throttle_ms),

    render: function render() {
        var style = {};

        if (this.props.height > 0 && !this.state.visible) {
            style.height = this.props.height;
        }
        if (this.props.style) {
            style = extend(style, this.props.style);
        }

        var cssClass = this.props.className || '';

        return _react2.default.createElement(
            'div',
            { style: style, className: cssClass },
            this.state.visible ? this.props.children : ''
        );
    }
});

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
    if (ms > 30) throttle_ms = ms;
};

function inviewport(el, threshold) {
    if (typeof threshold !== 'number') threshold = 0;

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
