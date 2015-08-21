import throttle from 'lodash/function/throttle'
import React from 'react'


let throttle_ms = 200



const DelayLoad = React.createClass({
    propTypes: {
        doLazy: React.PropTypes.bool
        , height: React.PropTypes.number
        , threshold: React.PropTypes.number
    }
    , getDefaultProps() {
        return {
            doLazy: true
            , height: 0
            , threshold: 0
        }
    }
    , getInitialState() {
        return {
            visible: !this.props.doLazy
        }
    }
    , componentDidMount() {
        if (this.props.doLazy && window.addEventListener) {
            window.addEventListener('scroll', this.checkVisible)
            window.addEventListener('resize', this.checkVisible)
        }
    }
    , componentWillUnmount() {
        this.onLoaded();
    }
    , componentDidUpdate: function() {
        if (!this.state.visible)
            this.checkVisible();
    }

    , onLoaded() {
        if (this.props.doLazy && window.removeEventListener) {
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

        if (this.props.height > 0) {
            style.height = this.props.height
        }
        if (this.props.style) {
            style = extend(style, this.props.style)
        }

        return (
            <div style={style} className={this.props.className}>
                {this.state.visible ? this.props.children : ''}
            </div>
        );
    }
})

export default DelayLoad

















let __LazyElements = [], __domReadyInitLazyload = false
export const lazyload = (el, options) => {
    if (!el)
        return false

    __LazyElements.push(el)

    let settings = {
        threshold: 0
        , height: 0
        , data_attribute: "original"
    }
    options && (settings = extend(settings, options))

    let checkEmptyTime = 0

    let checkVisible = throttle(function () {
        let elements = __LazyElements.slice(0)
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
        if (elements.length !== __LazyElements.length) {
            __LazyElements = elements
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

    if (!__domReadyInitLazyload) {
        __domReadyInitLazyload = true
        document.addEventListener("DOMContentLoaded"
            , function() {
                checkVisible()
            }
            , false)
    }

    return el
}


export const setThrottleMS = (ms) => {
    if (ms > 30)
        throttle_ms = ms
}
