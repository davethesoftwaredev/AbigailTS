/*
Abigail TS
Released under BSD-2 Clause License:

Copyright (c) 2012, David Andrews (davethesoftwaredev@gmail.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, 
  this list of conditions and the following disclaimer.
  
- Redistributions in binary form must reproduce the above copyright notice, 
  this list of conditions and the following disclaimer in the documentation and/or 
  other materials provided with the distribution.
  
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY 
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND 
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

///<reference path='transform.d.ts'/>
///<reference path='a_rect.ts'/>
///<reference path='a_rgba.ts'/>
///<reference path='a_point.ts'/>

/* Wraps all canvas and space transformation operations. */
class A_Canvas
{
	context: CanvasRenderingContext2D;
	width: number;
	height: number;
	fullRect:A_Rect;
	worldTransform:Transform;
	transformStack:number[][];
	rotationStack:number[];
	opacityStack:number[];
	currentOpacity:number;
	totalRotation:number;
	
	constructor(public canvas:HTMLCanvasElement) {
		this.context = canvas.getContext('2d');
		this.height = canvas.height;
		this.width = canvas.width;
		this.fullRect = new A_Rect(0,0,this.width,this.height);
		this.worldTransform = new Transform();
		this.transformStack = [];
		this.rotationStack = [];
		this.opacityStack = [];
		this.currentOpacity = 1;
	}
	
	setFill(fill:A_RGBA) {
		this.context.fillStyle = fill.styleA();
	}
	
	fillBackground(fill:A_RGBA) {
		this.setFill(fill);
		this.drawRect(this.fullRect);
	}
	
	drawRect(r:A_Rect) {
		this.context.fillRect(r.x,r.y,r.w,r.h);
	}
	
	drawText(point:A_Point, text:string, color:A_RGBA) {
		this.setFill(color);
		this.context.fillText(text, point.x, point.y);
	}
	
	drawLine(point:A_Point, color:A_RGBA) {
		this.setFill(color);
		this.context.beginPath();
		this.context.lineTo(point.x, point.y);
		this.context.stroke();
	}
	
	drawImage(img:HTMLImageElement, source:A_Rect, dest:A_Rect) {
		this.context.drawImage(img, source.x, source.y, source.w, source.h, dest.x, dest.y, dest.w, dest.h);
	}
	
	setTransform(t:number[]) {
		this.context.setTransform(t[0], t[1], t[2], t[3], t[4], t[5]);
	}
	
	setWorldTransform() {
		this.context.setTransform(this.worldTransform.m[0], this.worldTransform.m[1], this.worldTransform.m[2], this.worldTransform.m[3], this.worldTransform.m[4], this.worldTransform.m[5]);
	}
	
	setOpacity(o:number) {
		if(o < 0) o = 0;
		if(o > 1) o = 1;
		
		this.currentOpacity = o;
		this.context.globalAlpha = o;
	}
	
	setWorldOpacity() {
		this.setOpacity(this.currentOpacity);
	}
	
	save() {
		this.transformStack.push(this.worldTransform.m.slice(0));
		this.opacityStack.push(this.currentOpacity);
		this.rotationStack.push(this.totalRotation);
	}
	
	restore() {
		if(this.transformStack.length > 0) {
			this.worldTransform.m = this.transformStack.pop();
			this.setWorldTransform();
		}
		
		if(this.opacityStack.length > 0) {
			this.currentOpacity = this.opacityStack.pop();
			this.setWorldOpacity();
		}
		
		if(this.rotationStack.length > 0) {
			this.totalRotation = this.rotationStack.pop();
		}
	}
	
	translatePt(point:A_Point) {
		this.worldTransform.translate(point.x, point.y);
	}
	
	translate(x:number, y:number)
	{
		this.worldTransform.translate(x, y);
	}
	
	scalePt(point:A_Point) {
		this.worldTransform.scale(point.x, point.y);
	}
	
	scale(x:number, y:number) {
		this.worldTransform.scale(x,y);
	}
	
	rotate(angle) {
		this.totalRotation += angle;
		
		angle = angle * 0.0174532925;
	
		this.worldTransform.rotate(angle);
		//this.setTransform(this.worldTransform.m);
	}
	
	resetRotation() {
		this.totalRotation = 0;
	}
}
