///<reference path='a_scenenode.ts'/>
///<reference path='a_rect.ts'/>
///<reference path='a_rgba.ts'/>

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
