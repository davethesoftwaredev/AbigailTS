///<reference path='a_scenenode.ts'/>
///<reference path='a_rect.ts'/>
///<reference path='a_controller.ts'/>


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
