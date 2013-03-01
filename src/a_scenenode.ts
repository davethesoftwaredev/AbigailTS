///<reference path='a_point.ts'/>
///<reference path='a_controller.ts'/>
///<reference path='a_point.ts'/>


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
