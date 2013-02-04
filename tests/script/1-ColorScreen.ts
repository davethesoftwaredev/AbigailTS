///<reference path='../../src/abigail.ts'/>
class ColorScreen extends A_Screen
{
	color:A_RGBA;
		
	constructor() {
		super();
		this.color = new A_RGBA(0,0,0,255);
	}
	
	tick() {
		this.color.r = Math.random() * 255;
		this.color.g = Math.random() * 255;
		this.color.b = Math.random() * 255;
	}

	render(controller:A_Controller) {
		controller.canvas.fillBackground(this.color);
	}
}

var game:A_Controller;

function init() {
	game = new A_Controller('main');
	game.pushScreen(new ColorScreen());
	loop();
}

function loop() {
	game.tick();
	game.render();
	
	if(!game.exitLoop)
		setTimeout(loop, 25);
}