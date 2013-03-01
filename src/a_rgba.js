var A_RGBA = (function () {
    function A_RGBA(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    A_RGBA.prototype.style = function () {
        return 'rgb(' + Math.floor(this.r).toString() + ',' + Math.floor(this.g).toString() + ',' + Math.floor(this.b).toString() + ')';
    };
    A_RGBA.prototype.styleA = function () {
        return 'rgba(' + Math.floor(this.r).toString() + ',' + Math.floor(this.g).toString() + ',' + Math.floor(this.b).toString() + ',' + this.a.toString() + ')';
    };
    return A_RGBA;
})();
