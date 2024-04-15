# p5.dumbLiveReload
p5.dumbLiveReload is a dead simple way to live reload or live code p5.js sketches. It reloads the `sketch.js` file every 200 milliseconds. It keeps the state of your global variables and doesn't call the setup function again.

## How to use
Include the script after p5.js. Your sketch script should be loaded in the body.

## Why did you make this?
My primary use case is avoiding reloading entire sketches in [p5.xr](https://p5xr.org/#/) because the immersive session needs to be initiated with a user action. Each time I change, I have to click a button and reload the whole experience, which takes a bit on XR headsets. I can code directly with the p5 web editor while using an XR headset.

## Requirements
The p5.js sketch must be named `sketch.js.`

## Notes
This tool is a quick prototyping tool intended for simple one-file sketches. If you want a more robust live coding solution in p5.js, you may want to check out [p5.live](https://teddavis.org/p5live/) by Ted Davis.
