///<reference path='../../src/abigail.ts'/>
class ImageSceneNodeScreen extends A_Screen
{
	img1:A_ImageSceneNode;
	img2:A_ImageSceneNode;
	img3:A_ImageSceneNode;
	img4:A_ImageSceneNode;
	
	img4State:number;
	
	load(controller:A_Controller) {
		super.load(controller);
		
		this.img1 = new A_ImageSceneNode('flowers');
		this.img2 = new A_ImageSceneNode('flowers');
		this.img3 = new A_ImageSceneNode('flowers');
		this.img4 = new A_ImageSceneNode('flowers');
		
		this.rootNode.addChild(this.img1);
		this.rootNode.addChild(this.img2);
		this.rootNode.addChild(this.img3);
		this.rootNode.addChild(this.img4);
		
		this.img1.opacity = 0.5;
		this.img2.location.x = 200;
		this.img2.location.y = 200;
		this.img3.location.x = 400;
		this.img3.location.y = 200;
		this.img4.scale.x = 0.5;
		this.img4.scale.y = 0.5;
		
		this.img4State = 0;
		
	}
	
	tick(controller:A_Controller) {
		super.tick(controller);
		
		this.img2.rotation++;
		this.img3.rotation--;
		
		this.updateImg4();
	}
	
	updateImg4() {
		switch(this.img4State) {
			case 0:
				this.img4.location.x++;
				if(this.img4.location.x >= 400) this.img4State = 1;
				break;
			case 1:
				this.img4.location.y++;
				if(this.img4.location.y >= 400) this.img4State = 2;
				break;
			case 2:
				this.img4.location.x--;
				if(this.img4.location.x <= 0) this.img4State = 3;
				break;
			case 3:
				this.img4.location.y--;
				if(this.img4.location.y <= 0) this.img4State = 0;
				break;
		}
	}
	
	render(controller:A_Controller) {
		super.clear(controller);
		super.render(controller);
	}
}

var game4:A_Controller;

function init4_imagescenenode() {
	var defs:A_ResourceDefs = new A_ResourceDefs();
	defs.images['flowers'] = 'img/Flowers.jpg';
	game4 = new A_Controller('4-ImageSceneNode', defs);
	game4.showFramerate = true;
	game4.pushScreen(new ImageSceneNodeScreen());	
	loop4();
}

function loop4() {
	game4.tick();
	game4.render();
	
	if(!game4.exitLoop)
		setTimeout(loop4, 16);
}