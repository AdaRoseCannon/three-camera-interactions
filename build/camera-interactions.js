/**
 * Sets up an enviroment for detecting that 
 * the camera is looking at objects.
 */

'use strict';

var EventEmitter = require('fast-event-emitter');
var util = require('util');

/*global THREE*/
/**
 * Keeps track of interactive 3D elements and 
 * can be used to trigger events on them.
 *
 * The domElement is to pick up touch ineractions
 * 
 * @param  {[type]} domElement [description]
 * @return {[type]}            [description]
 */
module.exports = function CameraInteractivityWorld(domElement, threeOverride) {
	var _this2 = this;

	var THREE_IN = threeOverride || THREE;

	if (!THREE_IN) throw Error('No Three Library Detected');

	function InteractivityTarget(node) {
		var _this = this;

		EventEmitter.call(this);

		this.position = node.position;
		this.hasHover = false;
		this.object3d = node;

		this.on('hover', function () {
			if (!_this.hasHover) {
				_this.emit('hoverStart');
			}
			_this.hasHover = true;
		});

		this.on('hoverOut', function () {
			_this.hasHover = false;
		});

		this.hide = function () {
			_this.object3d.visible = false;
		};

		this.show = function () {
			_this.object3d.visible = true;
		};
	}
	util.inherits(InteractivityTarget, EventEmitter);

	this.targets = new Map();

	this.detectInteractions = function (camera) {

		var raycaster = new THREE_IN.Raycaster();
		raycaster.setFromCamera(new THREE_IN.Vector2(0, 0), camera);
		var hits = raycaster.intersectObjects(Array.from(this.targets.values()).map(function (target) {
			return target.object3d;
		}).filter(function (object3d) {
			return object3d.visible;
		}));

		var target = false;

		if (hits.length) {

			// Show hidden text object3d child
			target = this.targets.get(hits[0].object);
			if (target) target.emit('hover');
		}

		// if it is not the one just marked for highlight
		// and it used to be highlighted un highlight it.
		Array.from(this.targets.values()).filter(function (eachTarget) {
			return eachTarget !== target;
		}).forEach(function (eachNotHit) {
			if (eachNotHit.hasHover) eachNotHit.emit('hoverOut');
		});
	};

	var interact = function interact(event) {
		Array.from(_this2.targets.values()).forEach(function (target) {
			if (target.hasHover) {
				target.emit(event.type);
			}
		});
	};
	this.interact = interact;

	domElement.addEventListener('click', interact);
	domElement.addEventListener('mousedown', interact);
	domElement.addEventListener('mouseup', interact);
	domElement.addEventListener('touchup', interact);
	domElement.addEventListener('touchdown', interact);

	this.makeTarget = function (node) {
		var newTarget = new InteractivityTarget(node);
		_this2.targets.set(node, newTarget);
		return newTarget;
	};
};

//# sourceMappingURL=camera-interactions.js.map