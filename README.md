# React-DelayLoad

Like Lazyload plugin for jQuery, Delayload is library offering a React component for delay-loading images,
and it uses throttle to lower the render cost when scrolling and resizing.
Moreover, for raw HTML contents created by HTML editors, the library also offers a function for DOM manipulation
using plain javascript, and there is no need to require jQuery.


## Installation

	npm install react-delayload --save-dev

## Example

####React Component

```
	import DelayLoad from 'react-delayload'
```

```
	render() {
		return (
            <div>
                {
                    this.props.images.map(function(image, idx) {
                        return (
                            <DelayLoad key={idx}>
                                <img src={image}/>
                            </DelayLoad>
                        )
                    })
                }
            </div>
        )
	}
```

**Attributes**
- `enableDelay`: Whether to enable delay-loading. Default as true
- `height`: Height of placeholder block. Default as 0
- `threshold`: Setting threshold causes image to load N pixels before it appears on viewport. Default as 0

**Full example**
[./example/test.jsx](https://github.com/nickeljew/react-delayload/blob/master/example/test.jsx)


####DOM

```
	import {delayload} from 'react-delayload'
```

```
	componentDidMount() {
        let images = React.findDOMNode(this.refs.raw).querySelectorAll("img")
        // images is not a real array, and using forEach will not work
        for (let i = 0; i < images.length; ++i) {
            delayload(images[i])
        }
    }
```

**Options**
- `data_attribute`: Name of the data attribute for storing original SRC value. Default as 'original'
- `height`: Height of placeholder block. Default as 0
- `threshold`: Setting threshold causes image to load N pixels before it appears on viewport. Default as 0

**Full example**
[./example/test-dom.jsx](https://github.com/nickeljew/react-delayload/blob/master/example/test-dom.jsx)


##Demo
Run the server
```
	node ./example/server.js
```
DEMO Links
- http://localhost:3000
- http://localhost:3000/dom


##License

MIT (http://www.opensource.org/licenses/mit-license.php)