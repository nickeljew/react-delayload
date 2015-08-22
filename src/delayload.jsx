import throttle from 'lodash/function/throttle'
import React from 'react'


let throttle_ms = 100



const DelayLoad = React.createClass({
    propTypes: {
        enableDelay: React.PropTypes.bool
        , height: React.PropTypes.number
        , threshold: React.PropTypes.number
    }
    , getDefaultProps() {
        return {
            enableDelay: true
            , height: 0
            , threshold: 0
        }
    }
    , getInitialState() {
        return {
            visible: !this.props.enableDelay
        }
    }
    , componentDidMount() {
        if (!this.state.visible)
            this.checkVisible()

        if (this.props.enableDelay && window.addEventListener) {
            window.addEventListener('scroll', this.checkVisible)
            window.addEventListener('resize', this.checkVisible)
        }
    }
    , componentWillUnmount() {
        this.onLoaded();
    }
    , componentDidUpdate: function() {
        if (!this.state.visible)
            this.checkVisible()
    }

    , onLoaded() {
        if (this.props.enableDelay && window.removeEventListener) {
            window.removeEventListener('scroll', this.checkVisible)
            window.removeEventListener('resize', this.checkVisible)
        }
    }
    , checkVisible: throttle(function () {
        if ( inviewport(this.getDOMNode(), this.props.threshold) ) {
            this.setState({visible: true})
            this.onLoaded()
        }
    }, throttle_ms)

    , render: function () {
        let style = {}

        if (this.props.height > 0 && !this.state.visible) {
            style.height = this.props.height
        }
        if (this.props.style) {
            style = extend(style, this.props.style)
        }

        let cssClass = this.props.className || ''

        return (
            <div style={style} className={cssClass}>
                {this.state.visible ? this.props.children : ''}
            </div>
        )
    }
})

export default DelayLoad

















let _Elements = [], _DOMReadyInit = false
export const delayload = (el, options) => {
    if (!el)
        return false

    _Elements.push(el)

    let settings = {
        threshold: 0
        , height: 0
        , data_attribute: "original"
    }
    options && (settings = extend(settings, options))

    let checkEmptyTime = 0

    let checkVisible = throttle(function () {
        let elements = _Elements.slice(0)
        if (elements.length === 0 && ++checkEmptyTime >= 3) {
            if (window.removeEventListener) {
                window.removeEventListener('scroll', checkVisible)
                window.removeEventListener('resize', checkVisible)
            }
            return
        }

        for (let i = 0; i < elements.length; i++) {
            let elem = elements[i]
            if ( inviewport(elem, settings.threshold) ) {
                elements.splice(i--, 1)

                let src = elem.getAttribute('data-' + settings.data_attribute)
                if (elem.tagName.toLowerCase() === 'img') {
                    elem.setAttribute('src', src)
                } else {
                    elem.style.backgroundImage = "url('" + src + "')"
                }
            }
        }
        if (elements.length !== _Elements.length) {
            _Elements = elements
        }
    }, throttle_ms)


    if (el.tagName.toLowerCase() === 'img') {
        let src = el.getAttribute('src')
        if (src) {
            el.setAttribute('data-' + settings.data_attribute, src)
        }
    } else {
        let bgimg = el.style.backgroundImage
        if (bgimg) {
            //TODO
        }
    }

    if (window.addEventListener) {
        window.addEventListener('scroll', checkVisible)
        window.addEventListener('resize', checkVisible)
    }

    if (!_DOMReadyInit) {
        _DOMReadyInit = true
        document.addEventListener("DOMContentLoaded"
            , function() {
                checkVisible()
            }
            , false)
    }

    return el
}


export const setThrottleMilliseconds = (ms) => {
    if (ms > 30)
        throttle_ms = ms
}





function inviewport(el, threshold) {
    if (typeof threshold !== 'number')
        threshold = 0

    let winHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight
    let winWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
    let rect = el.getBoundingClientRect()
    let validRect = {
        top: rect.top - threshold
        , left: rect.left - threshold
        , right: rect.right + threshold
        , bottom: rect.bottom + threshold
    }

    return (validRect.right > 0) && (validRect.bottom > 0) && (validRect.top < winHeight) && (validRect.left < winWidth)
}
