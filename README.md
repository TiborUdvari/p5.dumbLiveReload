# p5.dumbLiveReload
p5.dumbLiveReload is a dead simple way to live reload or live code p5.js sketches. It reloads the `sketch.js` file every 500 millisecondsby default. It keeps the state of your global variables and doesn't call the setup function again.

## Warning
This will generate a lot of requests. This can be problematic if you are using a tunneling service like ngrok or other online services. It may fail because of rate limiting or use up your allocated bandwith quite quickyl.

## How to use
Include the script after p5.js. Your sketch script should be loaded in the body.

Example:
```js
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.1/p5.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/p5.dumblivereload@0.0.3/dist/p5dumbLiveReload.js"></script> 
</head>
<body>
    <script src="sketch.js"></script>
</body>
```

You can also control the executing with these functions

```js
startDumbReload(msInterval) 
stopDumbReload()  
dumbReloadRunning()
```

## Why did you make this?
My primary use case is avoiding reloading entire sketches in [p5.xr](https://p5xr.org/#/) because the immersive session needs to be initiated with a user action. Each time I change, I have to click a button and reload the whole experience, which takes a bit on XR headsets. 

## Requirements
* The p5.js sketch must be named `sketch.js.`

## Notes
This tool is a quick prototyping tool intended for simple one-file sketches. If you want a more robust live coding solution in p5.js, you may want to check out [p5.live](https://teddavis.org/p5live/) by Ted Davis.

Currently it doesn't work with the p5 web editor.
