///<reference path='a_resourcedefs.ts'/>
///<reference path='a_animation.ts'/>
///<reference path='a_screen.ts'/>

/* Definitions of all images used in the game. */
class A_ResourceDefs
{
	images:string[];
	animations:A_Animation[];
	
	constructor() {
		this.images = [];
		this.animations = [];
	}
}

/* Manages loading and retrieving of resources by name. */
class A_Resources
{
	images:HTMLImageElement[];
	imageCount:number = 0;
	animations:A_Animation[];
	
	constructor(public resourceDefs:A_ResourceDefs) {
		this.images = [];
		this.animations = [];
		
		if(resourceDefs) {
			for(var i in resourceDefs.images) {
				this.loadImage(i, resourceDefs.images[i]);
			}
			
			for(var a in resourceDefs.animations) {
				this.animations[a] = resourceDefs.animations[a];
			}
		}
	}
	
	loadImage(name:string, imageUrl:string) {
		var i = new Image();
		i.src = imageUrl;

		this.images[name] = i;
		this.imageCount++;		
	}
	
	loadImages(images:Array) {
		for(var i in images) {
			this.loadImage(<string>i, <string>images[i]);
		}
	}
	
	percentLoaded() {
		var completed = 0;
		
		if(this.imageCount == 0) return 1;
		
		for(var i in this.images) {
			if(this.images[i].complete) {
				completed++;
			}
		}
		
		return completed / this.imageCount;
	}
	
	get(name:string) {
		return this.images[name];
	}
}
