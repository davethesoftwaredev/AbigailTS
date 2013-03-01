var A_Rect = (function () {
    function A_Rect(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    A_Rect.prototype.contains = function (p) {
        return this.x + this.w - p.x > 0 && this.y + this.h - p.y > 0;
    };
    return A_Rect;
})();
