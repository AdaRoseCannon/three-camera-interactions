# three-camera-interactions
Small tool for interacting with Three.js objects with the camera.

[Example Video](http://adaroseedwards.github.io/cardboard-slides/images/cardboard2-video.webm)

# Usage

```
// Keeps track of interactive objects needs the THREE.js object supplied
// if it is not on the window as THREE.js
const cameraInteractivityWorld = new CameraInteractions(domElement [, THREE]);
	
// mySprite is a THREE.js sprite but this could be a mesh too
const interactiveSprite = cameraInteractivityWorld.makeTarget(mySprite);

// When the domElement recieves a click event then do something
interactiveSprite.on('click', doInteract);

// Make sprite opaque on hover
interactiveSprite.on('hover', function () {
  this.object3d.opacity = 1;
});

// Make sprite transparent when no longer hovering
interactiveSprite.on('hoverOut', function () {
  this.object3d.opacity = 0.5;
});

// send custom events to whichever target is being hovered on
setTimeout(() => cameraInteractivityWorld.interact('fourSeconds'), 4000);

```

#
