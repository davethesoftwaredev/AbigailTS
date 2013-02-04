///<reference path='../../src/abigail.ts'/>
class BlockScreen extends A_Screen
{
	colors:number[];
	directions:number[];
	rows:number = 50;
	cols:number = 50;

	constructor() {
		super();
		this.colors = [];
		this.directions = [];
		
		for(var i = 0; i < this.rows * this.cols; i++) {
			this.colors[i] = Math.floor(Math.random() * 255);
			this.directions[i] = Math.floor(Math.random() * 5) + 1;
		}
	}
	
	tick(controller:A_Controller) {
		for(var y = 0; y < this.rows; y++) {
			for(var x = 0; x < this.cols; x++) {
				this.colors[y * this.rows + x] += this.directions[y * this.rows + x];
				
				if(this.colors[y * this.rows + x] > 255 || this.colors[y * this.rows + x] < 0) 
				{
					this.directions[y * this.rows + x] = -1 * this.directions[y * this.rows + x];
				}
			}
		}
	}

	render(controller:A_Controller) {
		var rect:A_Rect = new A_Rect(0,0,0,0);
		var color:A_RGBA = new A_RGBA(0,0,0,255);
		
		rect.w = Math.floor(controller.canvas.width / this.rows);
		rect.h = Math.floor(controller.canvas.height / this.cols);
	
		for(var y = 0; y < this.rows; y++) {
			for(var x = 0; x < this.cols; x++) {
				rect.x = x * rect.w;
				rect.y = y * rect.h;
					
				color.r = color.g = color.b = this.colors[y * this.rows + x];
					
				controller.canvas.setFill(color);
				controller.canvas.drawRect(rect);
			}
		}
	}
}

var game:A_Controller;

function init() {
	game = new A_Controller('main');
	game.pushScreen(new BlockScreen());
	loop();
}

function loop() {
	game.tick();
	game.render();
	
	if(!game.exitLoop)
		setTimeout(loop, 25);
}