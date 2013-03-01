///<reference path='a_scenenode.ts'/>
///<reference path='a_rect.ts'/>
///<reference path='a_animation.ts'/>
///<reference path='a_controller.ts'/>

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
