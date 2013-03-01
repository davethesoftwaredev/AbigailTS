var A_Point = (function () {
    function A_Point(x, y) {
        this.x = x;
        this.y = y;
    }
    A_Point.prototype.distancePt = function (p) {
        var dx = this.x - p.x;
        var dy = this.y - p.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    A_Point.prototype.distance = function (x, y) {
        var dx = this.x - x;
        var dy = this.y - y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    A_Point.prototype.normalize = function () {
        var length = this.distance(0, 0);
        this.x = this.x / length;
        this.y = this.y / length;
    };
    return A_Point;
})();
