///<reference path='../../src/abigail.ts'/>
class AnimationSceneNodeScreen extends A_Screen
{
	img1:A_AnimationSceneNode;
	rect:A_RectSceneNode;
	img4State:number;
	
	load(controller:A_Controller) {
		super.load(controller);
		
		this.rect = new A_RectSceneNode(300, 300, new A_RGBA(255,255,255,255));
		this.img1 = new A_AnimationSceneNode('walker');
		
		this.img1.directionVector.x = 0;
		this.img1.directionVector.y = -1.2;
		
		this.img1.location.x = 150;
		this.img1.location.y = 150;
		
		this.rect.location.x = 300;
		this.rect.location.y = 200;
		
		this.rect.center.x = 150;
		this.rect.center.y = 150;
		
		this.rootNode.addChild(this.rect);
		this.rect.addChild(this.img1);
	}
	
	tick(controller:A_Controller) {
		super.tick(controller);
		
		this.img1.location.y += -1;
		
		//this.img1.location.x += this.img1.forwardVector.x;
		//this.img1.location.y += this.img1.forwardVector.y;
		this.img1.rotation += 5;
		
		this.rect.rotation += 0.5;
	}
	
	render(controller:A_Controller) {
		super.clear(controller);
		super.render(controller);
		
		controller.canvas.
	}
}

var game5:A_Controller;

function init5_animationscenenode() {
	var defs:A_ResourceDefs = new A_ResourceDefs();
	defs.images['walker'] = 'img/walker.png';
	defs.animations['walker'] = {name:'walker', 
							     image:'walker', 
							     frameWidth: 32, 
							     frameHeight:32, 
							     frames: [
							     	{index:1, duration:200},
							     	{index:2, duration:200}
							     ]
							     };
	game5 = new A_Controller('5-AnimationSceneNode', defs);
	game5.showFramerate = true;
	game5.pushScreen(new AnimationSceneNodeScreen());
	loop5();
}

function loop5() {
	game5.tick();
	game5.render();
	
	if(!game5.exitLoop)
		setTimeout(loop5, 16);
}