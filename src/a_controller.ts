/* Main game library. */
class A_Controller
{
	resources: A_Resources;
	canvas: A_Canvas;
	screens: A_Screen[];
	currentScreen: A_Screen;
	exitLoop:bool;
	loadingScreen: A_LoadingScreen;
	
	frames:number;
	framerate:number;
	showFramerate:bool;
	lastFramerateTime:number;
	frameratePoint:A_Point;
	framerateColor:A_RGBA;
	
	constructor(public canvasId:string, public resourceDefs?:A_ResourceDefs)
	{
		this.resources = new A_Resources(resourceDefs);
		this.canvas = new A_Canvas(<HTMLCanvasElement>document.getElementById(canvasId));
		this.screens = [];
		this.exitLoop = false;
		this.frames = 0;
		this.framerate = 0;
		this.showFramerate = false;
		this.lastFramerateTime = new Date().getTime();
		this.frameratePoint = new A_Point(15,15);
		this.framerateColor = new A_RGBA(255,255,255,255);
		
		
		this.loadingScreen = new A_LoadingScreen();
		this.screens.push(this.loadingScreen);
		this.loadingScreen.load(this);
		this.currentScreen = this.loadingScreen;
	}
	
	pushScreen(s:A_Screen) {
		this.screens.push(s);

		if(this.loadingScreen.completed == true && s.loaded == false) {
			s.load(this);
		}
		
		if(this.loadingScreen.completed == true) {
			this.currentScreen = s;
		}
	}
	
	popScreen() {
		this.screens.pop();
		
		this.currentScreen = this.screens[this.screens.length - 1];
	}
	
	render() {
		this.currentScreen.render(this);
		
		if(this.showFramerate) {
			this.calcFrameRate();
			
			this.canvas.drawText(this.frameratePoint, this.framerate.toString(), this.framerateColor);
		}
	}
	
	calcFrameRate() {
		this.frames++;
		var ct = new Date().getTime();
			
		if(ct - this.lastFramerateTime > 1000) {
			this.framerate = this.frames;
			this.frames = 0;
			this.lastFramerateTime = ct;
		}
	}
	
	tick() {
		this.currentScreen.tick(this);
		
		if(this.currentScreen == this.loadingScreen && this.loadingScreen.completed) {
			this.currentScreen = this.screens[this.screens.length - 1];
			this.currentScreen.load(this);
		}
	}
}
