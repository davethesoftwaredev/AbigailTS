///<reference path='a_rgba.ts'/>
///<reference path='a_scenenode.ts'/>
///<reference path='a_controller.ts'/>

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
