///<reference path='a_rgba.ts'/>
///<reference path='a_point.ts'/>
///<reference path='a_screen.ts'/>

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
