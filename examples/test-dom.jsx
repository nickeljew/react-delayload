'use strict';

import { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import DocReady from 'es6-docready'
import { delayload, setThrottleMilliseconds } from 'delayload'


//for making the delay effect more obviously
setThrottleMilliseconds(2000)


DocReady(function() {

    class Main extends Component {
        constructor(props, context) {
            super(props, context)

            this.state = {}
        }

        componentDidMount() {
            let images = ReactDOM.findDOMNode(this.refs.raw).querySelectorAll("img")
            // images is not a real array, and using forEach will not work
            for (let i = 0; i < images.length; ++i) {
                delayload(images[i], {
                    height: 600
                    //, threshold: 300
                })
            }
        }

        render() {
            let htmlCode = {__html: this.props.content}
            return (
                <div>
                    <div ref="raw" className="raw-html" dangerouslySetInnerHTML={htmlCode} />
                </div>
            )
        }
    }

    Main.propTypes = {
        content: PropTypes.string.isRequired
    }






    // Assuming the HTML data created by CMS
    const htmlData = ""
        + "<p><b>Image 1</b></p>"
        + "<p><img src='images/01.jpg' /></p>"
        + "<p><b>Image 2</b></p>"
        + "<p><img src='images/02.jpg' /></p>"
        + "<p><b>Image 3</b></p>"
        + "<p><img src='images/03.jpg' /></p>"
        + "<p><b>Image 4</b></p>"
        + "<p><img src='images/04.jpg' /></p>"
        + "<p><b>Image 5</b></p>"
        + "<p><img src='images/05.jpg' /></p>"
        + "<p><b>Image 6</b></p>"
        + "<p><img src='images/06.jpg' /></p>"
        + "<p><b>Image 7</b></p>"
        + "<p><img src='images/07.jpg' /></p>"
        + "<p><b>Image 8</b></p>"
        + "<p><img src='images/08.jpg' /></p>"
        + "<p><b>Image 9</b></p>"
        + "<p><img src='images/09.jpg' /></p>"
        + "<p><b>Image 10</b></p>"
        + "<p><img src='images/10.jpg' /></p>"
        + "<p><b>Image 11</b></p>"
        + "<p><img src='images/11.jpg' /></p>"
        + "<p><b>Image 12</b></p>"
        + "<p><img src='images/12.jpg' /></p>"
        + "<p><b>Image 13</b></p>"
        + "<p><img src='images/13.jpg' /></p>"
        + "<p><b>Image 14</b></p>"
        + "<p><img src='images/14.jpg' /></p>"
        + "<p><b>Image 15</b></p>"
        + "<p><img src='images/15.jpg' /></p>"
        + "<p><b>Image 16</b></p>"
        + "<p><img src='images/16.jpg' /></p>"



    ReactDOM.render(
        <Main content={htmlData}/>
        , document.getElementById("page-container"))

})