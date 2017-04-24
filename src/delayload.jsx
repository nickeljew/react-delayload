'use strict';

import { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import throttle from 'lodash/function/throttle'


let throttle_ms = 100

const isBrowser = (typeof window !== "undefined" && typeof document !== "undefined")


class DelayLoad extends Component {
    constructor(props, context) {
        super(props, context)

        this.state = {
            visible: !this.props.enableDelay
        }

        const func = throttle(function() {
            if ( inviewport(findDOMNode(this), this.props.threshold) ) {
                this.setState({visible: true})
                this.onLoaded()
            }
        }, throttle_ms)

        this.checkVisible = func.bind(this)
    }

    componentDidMount() {
        if (!isBrowser)
            return

        if (!this.state.visible)
            this.checkVisible()

        if (this.props.enableDelay && window.addEventListener) {
            window.addEventListener('scroll', this.checkVisible)
            window.addEventListener('resize', this.checkVisible)
        }
    }
    componentWillUnmount() {
        this.onLoaded()
    }
    componentDidUpdate () {
        if (isBrowser && !this.state.visible)
            this.checkVisible()
    }

    onLoaded() {
        if (isBrowser && this.props.enableDelay && window.removeEventListener) {
            window.removeEventListener('scroll', this.checkVisible)
            window.removeEventListener('resize', this.checkVisible)
        }
    }

    render() {
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

}


DelayLoad.propTypes = {
    enableDelay: PropTypes.bool
    , height: PropTypes.number
    , threshold: PropTypes.number
}
DelayLoad.defaultProps = {
    enableDelay: true
    , height: 0
    , threshold: 0
}

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
                    if (+(settings.height) > 0)
                        elem.style.height = 'auto'
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
            el.setAttribute('src', '')
            if (+(settings.height) > 0) {
                el.style.height = settings.height + 'px'
            }
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

    checkVisible()

    return el
}


export const setThrottleMilliseconds = (ms) => {
    if (typeof ms === 'number' && ms > 30)
        throttle_ms = ms
}





function inviewport(el, threshold) {
    if (!isBrowser)
        return false

    if (typeof threshold !== 'number' || isNaN(threshold))
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




function extend(base, override) {

    let mergedObject = {}

    let isObject = (arg) => {
        return typeof arg === 'object' && arg !== null;
    }

    //Loop through each key in the base object
    Object.keys(base).forEach(function(key) {

        let baseProp = base[key]
        let overrideProp

        if (isObject(override)) overrideProp = override[key]

        //Recursive call extend if the prop is another object, else just copy it over
        mergedObject[key] = isObject(baseProp) && !Array.isArray(baseProp) ?
            extend(baseProp, overrideProp) : baseProp

    })

    //Loop through each override key and override the props in the
    //base object
    if (isObject(override)) {

        Object.keys(override).forEach(function(overrideKey) {

            let overrideProp = override[overrideKey]

            //Only copy over props that are not objects
            if (!isObject(overrideProp) || Array.isArray(overrideProp)) {
                mergedObject[overrideKey] = overrideProp;
            }

        })
    }

    return mergedObject
}
