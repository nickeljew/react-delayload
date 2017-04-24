'use strict';

import { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import DocReady from 'es6-docready'
import DelayLoad, { setThrottleMilliseconds } from 'delayload'


//for making the delay effect more obviously
setThrottleMilliseconds(2000)


DocReady(function() {

    class Main extends Component {
        constructor(props, context) {
            super(props, context)

            this.state = {}
        }

        render() {
            return (
                <div>
                    {
                        this.props.images.map(function(image, idx) {
                            return (
                                <DelayLoad key={idx}
                                           height={600}
                                           threshold={300}
                                           className="delayload">
                                    <img src={image}/>
                                </DelayLoad>
                            )
                        })
                    }
                </div>
            )
        }
    }

    Main.propTypes = {
        images: PropTypes.array.isRequired
    }






    // Assuming the HTML data created by CMS
    const images = [
        'images/01.jpg'
        , 'images/02.jpg'
        , 'images/03.jpg'
        , 'images/04.jpg'
        , 'images/05.jpg'
        , 'images/06.jpg'
        , 'images/07.jpg'
        , 'images/08.jpg'
        , 'images/09.jpg'
        , 'images/10.jpg'
        , 'images/11.jpg'
        , 'images/12.jpg'
        , 'images/13.jpg'
        , 'images/14.jpg'
        , 'images/15.jpg'
        , 'images/16.jpg'
    ]



    ReactDOM.render(
        <Main images={images}/>
        , document.getElementById("page-container"))

})