import React from 'react'
import {delayload} from '../src/delayload'


let Main = React.createClass({
    propTypes: {
        content: React.PropTypes.string.isRequired
    }

    , componentDidMount() {
        let images = React.findDOMNode(this.refs.raw).querySelectorAll("img")
        // images is not a real array, and using forEach will not work
        for (let i = 0; i < images.length; ++i) {
            delayload(images[i], {
                height: 600
                //, threshold: 300
            })
        }
    }

    , createHTML() {
        let htmlCode = {__html: this.props.content}
        return <div ref="raw" className="raw-html" dangerouslySetInnerHTML={htmlCode} />
    }

    , render() {
        return (
            <div>
                {this.createHTML()}
            </div>
        )
    }
})





// Assuming the HTML data created by CMS
let htmlData = ""
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

React.render(
    <Main content={htmlData}/>
    , document.getElementById("page-container"))