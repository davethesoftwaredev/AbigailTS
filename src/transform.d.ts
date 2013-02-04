/*
	Definitions file for Transform.js (www.simonsarris.com)
*/
class Transform {
	multiply(matrix:number[]):void;
	invert():void;
	rotate(rad:number):void;
	translate(x:number, y:number):void;
	scale(sx:number, sy:number):void;
	transformPoint(px:number,py:number):number[];
	
	m:number[];
}
