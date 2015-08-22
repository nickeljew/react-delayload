import React from 'react'
import * as ReactDelayLoad from '../src/delayload.jsx'
let DelayLoad = ReactDelayLoad['default']


let Main = React.createClass({
    propTypes: {
        images: React.PropTypes.array.isRequired
    }

    , render() {
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
})





let images = [
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

React.render(
    <Main images={images}/>
    , document.getElementById("page-container"))