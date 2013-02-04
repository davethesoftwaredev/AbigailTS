/*
Abigail TS
Released under BSD-2 Clause License:

Copyright (c) 2012, David Andrews (davethesoftwaredev@gmail.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, 
  this list of conditions and the following disclaimer.
  
- Redistributions in binary form must reproduce the above copyright notice, 
  this list of conditions and the following disclaimer in the documentation and/or 
  other materials provided with the distribution.
  
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY 
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND 
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

///<reference path='transform.d.ts'/>

interface A_AnimationFrame
{
	index:number;
	duration:number;
};

/* Animation definition */
interface A_Animation
{
	image:string;
	name:string;
	frameWidth:number;
	frameHeight:number;
	frames:A_AnimationFrame[];
};


/* Color definition */
class A_RGBA
{
	constructor(public r?:number, public g?:number, public b?:number, public a?:number) {
	}
	
	style() {
		return 'rgb(' + Math.floor(this.r).toString() + ',' + Math.floor(this.g).toString() + ',' + Math.floor(this.b).toString() + ')';
	}
	
	styleA() {
		return 'rgba(' + Math.floor(this.r).toString() + ',' + Math.floor(this.g).toString() + ',' + Math.floor(this.b).toString() + ',' + this.a.toString() + ')';
	}
}

/* A point in 2d space. */
class A_Point
{
	constructor(public x:number, public y:number) {
	}
	
	distancePt(p:A_Point) {
		var dx = this.x - p.x;
		var dy = this.y - p.y;
		
		return Math.sqrt(dx * dx + dy * dy);
	}
	
	distance(x:number, y:number) {
		var dx = this.x - x;
		var dy = this.y - y;
		
		return Math.sqrt(dx * dx + dy * dy);	
	}
	
	normalize() {
		var length = this.distance(0,0);
		
		this.x = this.x / length;
		this.y = this.y / length;
	}
}

/* A 2d rectangle. */
class A_Rect
{
	constructor(public x:number, public y:number, public w:number, public h:number) {
	}
	
	contains(p:A_Point) {
		return this.x + this.w - p.x > 0 && this.y + this.h - p.y > 0;
	}
}

/* Wraps all canvas and space transformation operations. */
class A_Canvas
{
	context: CanvasRenderingContext2D;
	width: number;
	height: number;
	fullRect:A_Rect;
	worldTransform:Transform;
	transformStack:number[][];
	rotationStack:number[];
	opacityStack:number[];
	currentOpacity:number;
	totalRotation:number;
	
	constructor(public canvas:HTMLCanvasElement) {
		this.context = canvas.getContext('2d');
		this.height = canvas.height;
		this.width = canvas.width;
		this.fullRect = new A_Rect(0,0,this.width,this.height);
		this.worldTransform = new Transform();
		this.transformStack = [];
		this.rotationStack = [];
		this.opacityStack = [];
		this.currentOpacity = 1;
	}
	
	setFill(fill:A_RGBA) {
		this.context.fillStyle = fill.styleA();
	}
	
	fillBackground(fill:A_RGBA) {
		this.setFill(fill);
		this.drawRect(this.fullRect);
	}
	
	drawRect(r:A_Rect) {
		this.context.fillRect(r.x,r.y,r.w,r.h);
	}
	
	drawText(point:A_Point, text:string, color:A_RGBA) {
		this.setFill(color);
		this.context.fillText(text, point.x, point.y);
	}
	
	drawLine(point:A_Point, color:A_RGBA) {
		this.setFill(color);
		this.context.beginPath();
		this.context.lineTo(point.x, point.y);
		this.context.stroke();
	}
	
	drawImage(img:HTMLImageElement, source:A_Rect, dest:A_Rect) {
		this.context.drawImage(img, source.x, source.y, source.w, source.h, dest.x, dest.y, dest.w, dest.h);
	}
	
	setTransform(t:number[]) {
		this.context.setTransform(t[0], t[1], t[2], t[3], t[4], t[5]);
	}
	
	setWorldTransform() {
		this.context.setTransform(this.worldTransform.m[0], this.worldTransform.m[1], this.worldTransform.m[2], this.worldTransform.m[3], this.worldTransform.m[4], this.worldTransform.m[5]);
	}
	
	setOpacity(o:number) {
		if(o < 0) o = 0;
		if(o > 1) o = 1;
		
		this.currentOpacity = o;
		this.context.globalAlpha = o;
	}
	
	setWorldOpacity() {
		this.setOpacity(this.currentOpacity);
	}
	
	save() {
		this.transformStack.push(this.worldTransform.m.slice(0));
		this.opacityStack.push(this.currentOpacity);
		this.rotationStack.push(this.totalRotation);
	}
	
	restore() {
		if(this.transformStack.length > 0) {
			this.worldTransform.m = this.transformStack.pop();
			this.setWorldTransform();
		}
		
		if(this.opacityStack.length > 0) {
			this.currentOpacity = this.opacityStack.pop();
			this.setWorldOpacity();
		}
		
		if(this.rotationStack.length > 0) {
			this.totalRotation = this.rotationStack.pop();
		}
	}
	
	translatePt(point:A_Point) {
		this.worldTransform.translate(point.x, point.y);
	}
	
	translate(x:number, y:number)
	{
		this.worldTransform.translate(x, y);
	}
	
	scalePt(point:A_Point) {
		this.worldTransform.scale(point.x, point.y);
	}
	
	scale(x:number, y:number) {
		this.worldTransform.scale(x,y);
	}
	
	rotate(angle) {
		this.totalRotation += angle;
		
		angle = angle * 0.0174532925;
	
		this.worldTransform.rotate(angle);
		//this.setTransform(this.worldTransform.m);
	}
	
	resetRotation() {
		this.totalRotation = 0;
	}
}

/* A "screen" is anything that renders and has game logic (ticks) */
class A_Screen
{
	bg: A_RGBA;
	rootNode:A_SceneNode;
	loaded:bool;
	
	constructor() {
		this.bg = new A_RGBA(0,0,0,1);
		this.loaded = false;
	}
	
	tick(controller:A_Controller) {
		this.rootNode.tickChildren(controller);
	}
	
	load(controller:A_Controller) {
		this.rootNode = new A_SceneNode();
		this.rootNode.addedToSceneGraph(controller);
		
		this.loaded = true;
	}
	
	render(controller:A_Controller) {
		controller.canvas.resetRotation();
		this.rootNode.render(controller);
	}
	
	clear(controller:A_Controller)
	{
		controller.canvas.fillBackground(this.bg);
	}
}

/* Default loading screen, waits for all resources to load. */
class A_LoadingScreen extends A_Screen
{
	textPoint:A_Point;
	color:A_RGBA;
	completed:bool;

	constructor() {
		super();
		
		this.completed = false;
		this.textPoint = new A_Point(0,0);
		this.color = new A_RGBA(255,255,255,1);
	}
	
	tick(controller:A_Controller) {
		if(controller.resources.percentLoaded() >= 1) {
			this.completed = true;
		}
	}
	
	render(controller:A_Controller) {
		super.render(controller);
		controller.canvas.drawText(this.textPoint, 'Loading... ' + (controller.resources.percentLoaded() * 100).toString() + '%', this.color);
	}
}

/* Definitions of all images used in the game. */
class A_ResourceDefs
{
	images:string[];
	animations:A_Animation[];
	
	constructor() {
		this.images = [];
		this.animations = [];
	}
}

/* Manages loading and retrieving of resources by name. */
class A_Resources
{
	images:HTMLImageElement[];
	imageCount:number = 0;
	animations:A_Animation[];
	
	constructor(public resourceDefs:A_ResourceDefs) {
		this.images = [];
		this.animations = [];
		
		if(resourceDefs) {
			for(var i in resourceDefs.images) {
				this.loadImage(i, resourceDefs.images[i]);
			}
			
			for(var a in resourceDefs.animations) {
				this.animations[a] = resourceDefs.animations[a];
			}
		}
	}
	
	loadImage(name:string, imageUrl:string) {
		var i = new Image();
		i.src = imageUrl;

		this.images[name] = i;
		this.imageCount++;		
	}
	
	loadImages(images:Array) {
		for(var i in images) {
			this.loadImage(<string>i, <string>images[i]);
		}
	}
	
	percentLoaded() {
		var completed = 0;
		
		if(this.imageCount == 0) return 1;
		
		for(var i in this.images) {
			if(this.images[i].complete) {
				completed++;
			}
		}
		
		return completed / this.imageCount;
	}
	
	get(name:string) {
		return this.images[name];
	}
}

/* Main game library. */
class A_Controller
{
	resources: A_Resources;
	canvas: A_Canvas;
	screens: A_Screen[];
	currentScreen: A_Screen;
	exitLoop:bool;
	loadingScreen: A_LoadingScreen;
	
	frames:number;
	framerate:number;
	showFramerate:bool;
	lastFramerateTime:number;
	frameratePoint:A_Point;
	framerateColor:A_RGBA;
	
	constructor(public canvasId:string, public resourceDefs?:A_ResourceDefs)
	{
		this.resources = new A_Resources(resourceDefs);
		this.canvas = new A_Canvas(<HTMLCanvasElement>document.getElementById(canvasId));
		this.screens = [];
		this.exitLoop = false;
		this.frames = 0;
		this.framerate = 0;
		this.showFramerate = false;
		this.lastFramerateTime = new Date().getTime();
		this.frameratePoint = new A_Point(15,15);
		this.framerateColor = new A_RGBA(255,255,255,255);
		
		
		this.loadingScreen = new A_LoadingScreen();
		this.screens.push(this.loadingScreen);
		this.loadingScreen.load(this);
		this.currentScreen = this.loadingScreen;
	}
	
	pushScreen(s:A_Screen) {
		this.screens.push(s);

		if(this.loadingScreen.completed == true && s.loaded == false) {
			s.load(this);
		}
		
		if(this.loadingScreen.completed == true) {
			this.currentScreen = s;
		}
	}
	
	popScreen() {
		this.screens.pop();
		
		this.currentScreen = this.screens[this.screens.length - 1];
	}
	
	render() {
		this.currentScreen.render(this);
		
		if(this.showFramerate) {
			this.calcFrameRate();
			
			this.canvas.drawText(this.frameratePoint, this.framerate.toString(), this.framerateColor);
		}
	}
	
	calcFrameRate() {
		this.frames++;
		var ct = new Date().getTime();
			
		if(ct - this.lastFramerateTime > 1000) {
			this.framerate = this.frames;
			this.frames = 0;
			this.lastFramerateTime = ct;
		}
	}
	
	tick() {
		this.currentScreen.tick(this);
		
		if(this.currentScreen == this.loadingScreen && this.loadingScreen.completed) {
			this.currentScreen = this.screens[this.screens.length - 1];
			this.currentScreen.load(this);
		}
	}
}

/* An object on the scene graph. */
class A_SceneNode
{
	center:A_Point;
	location:A_Point;
	scale:A_Point;
	rotation:number;
	directionVector:A_Point;
	forwardVector:A_Point;
	calcForwardVector:bool;
	children:A_SceneNode[];
	opacity:number;
	controller:A_Controller;
	worldRotation:number;
	
	constructor() {
		this.location = new A_Point(0,0);
		this.scale = new A_Point(1,1);
		this.rotation = 0;
		this.forwardVector = new A_Point(1,0);
		this.calcForwardVector = true;
		this.children = [];
		this.center = new A_Point(0,0);
		this.opacity = 1;
		this.directionVector = new A_Point(1,0);
		this.worldRotation = 0;
	}
	
	addedToSceneGraph(controller:A_Controller) {
		this.controller = controller;
	}
	
	transform(controller:A_Controller) {
		controller.canvas.translatePt(this.location);
		controller.canvas.translatePt(this.center);
		controller.canvas.rotate(this.rotation);
		controller.canvas.translate(-this.center.x, -this.center.y);
		controller.canvas.scalePt(this.scale);
		
		controller.canvas.setWorldTransform();
		
		this.worldRotation = controller.canvas.totalRotation;
		
		if(this.calcForwardVector) {
			var tf = new Transform();
			tf.rotate(this.worldRotation * 0.0174532925);
			
			var pt = tf.transformPoint(this.directionVector.x, this.directionVector.y);
			this.forwardVector.x = pt[0]; this.forwardVector.y = pt[1];
		}
	}
	
	addChild(child:A_SceneNode) {
		child.addedToSceneGraph(this.controller);
		this.children.push(child);
	}
	
	removeChild(child:A_SceneNode) {
		for(var i = 0; i < this.children.length; i++) {
			if(this.children[i] == child) {
				this.children.splice(i, 1);
				break;
			}
		}
	}
	
	render(controller:A_Controller) {
		this.renderChildren(controller);	
	}
	
	tick(controller:A_Controller) {
	}
	
	tickChildren(controller:A_Controller) {
		for(var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			child.tick(controller);
			child.tickChildren(controller);
		}
	}
	
	renderChildren(controller:A_Controller) {
		var child:A_SceneNode;
		for(var i = 0; i < this.children.length; i++) {
			child = this.children[i];
			
			controller.canvas.save();
			
			// prevent increasing opacity by setting value > 1
			// if 1, then no change necessary
			// if < 0, canvas already clamps to 0
			if(child.opacity < 1) {
				controller.canvas.setOpacity(child.opacity * controller.canvas.currentOpacity);
			}
			
			child.transform(controller);
			child.render(controller);
			controller.canvas.restore();
		}
	}
}

class A_RectSceneNode extends A_SceneNode
{
	r:A_Rect;
	c:A_RGBA;

	constructor(width?:number, height?:number, color?:A_RGBA) {
		super();
		
		this.r = new A_Rect(0,0,width,height);
		
		if(color != null) {
			this.c = color;
		}
		else {
			this.c = new A_RGBA(0,0,0,1);
		}
	}
	
	render(controller:A_Controller) {
		controller.canvas.setFill(this.c);
		controller.canvas.drawRect(this.r);
		
		this.renderChildren(controller);
	}
}

class A_ImageSceneNode extends A_SceneNode
{
	imgRect:A_Rect;
	img:HTMLImageElement;
	
	constructor(public imageTag) {
		super();
		
		this.imgRect = new A_Rect(0,0,0,0);
	}
	
	addedToSceneGraph(controller:A_Controller) {
		super.addedToSceneGraph(controller);
		
		this.img = controller.resources.images[this.imageTag];
		this.imgRect.w = this.img.width;
		this.imgRect.h = this.img.height;
	}
	
	render(controller:A_Controller) {
		controller.canvas.drawImage(this.img,this.imgRect, this.imgRect);
		
		this.renderChildren(controller);
	}
}

class A_AnimationSceneNode extends A_SceneNode
{
	imgRect:A_Rect;
	destRect:A_Rect;
	img:HTMLImageElement;
	anim:A_Animation;
	delta:number;
	currentFrame:number;
	
	constructor(public animationTag) {
		super();
		this.imgRect = new A_Rect(0,0,0,0);
		this.destRect = new A_Rect(0,0,0,0);
		this.delta = 0;
		this.currentFrame = 0;
	}
	
	addedToSceneGraph(controller:A_Controller) {
		super.addedToSceneGraph(controller);

		this.anim = controller.resources.animations[this.animationTag];
		
		if(this.anim != undefined) {
			this.img = controller.resources.images[this.anim.image];
			this.imgRect.w = this.anim.frameWidth;
			this.imgRect.h = this.anim.frameHeight;
			
			this.destRect.w = this.anim.frameWidth;
			this.destRect.h = this.anim.frameHeight;
		}
	}
	
	tick(controller:A_Controller) {
		if(this.anim != undefined && this.anim.frames.length > 0) {
			var time = new Date().getTime();
		
			if(this.delta == 0) {
				this.delta = time;
			}
		
			if(time - this.delta >= this.anim.frames[this.currentFrame].duration)
			{
				this.delta = time;
				
				this.currentFrame++;
				
				if(this.currentFrame >= this.anim.frames.length) 
					this.currentFrame = 0;
			}
		}
	}
	
	render(controller:A_Controller) {
		if(this.anim != undefined) {
			this.imgRect.x = this.anim.frames[this.currentFrame].index * this.anim.frameWidth;
	
			controller.canvas.drawImage(this.img,this.imgRect, this.destRect);
		
			this.renderChildren(controller);
		}
	}
}
