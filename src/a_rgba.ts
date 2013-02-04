class A_RGBA
{
	constructor(public r?:number, public g?:number, public b?:number, public a?:number) {
	}
	
	style() {
		return 'rgb(' + this.r.toString() + ',' + this.g.toString() + ',' + this.b.toString() + ')';
	}
	
	styleA() {
		return 'rgba(' + this.r.toString() + ',' + this.g.toString() + ',' + this.b.toString() + ',' + (this.a/255).toString() + ')';
	}
}