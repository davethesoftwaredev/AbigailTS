var A_Canvas = (function () {
    function A_Canvas(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.height = canvas.height;
        this.width = canvas.width;
        this.fullRect = new A_Rect(0, 0, this.width, this.height);
        this.worldTransform = new Transform();
        this.transformStack = [];
        this.rotationStack = [];
        this.opacityStack = [];
        this.currentOpacity = 1;
    }
    A_Canvas.prototype.setFill = function (fill) {
        this.context.fillStyle = fill.styleA();
    };
    A_Canvas.prototype.fillBackground = function (fill) {
        this.setFill(fill);
        this.drawRect(this.fullRect);
    };
    A_Canvas.prototype.drawRect = function (r) {
        this.context.fillRect(r.x, r.y, r.w, r.h);
    };
    A_Canvas.prototype.drawText = function (point, text, color) {
        this.setFill(color);
        this.context.fillText(text, point.x, point.y);
    };
    A_Canvas.prototype.drawLine = function (point, color) {
        this.setFill(color);
        this.context.beginPath();
        this.context.lineTo(point.x, point.y);
        this.context.stroke();
    };
    A_Canvas.prototype.drawImage = function (img, source, dest) {
        this.context.drawImage(img, source.x, source.y, source.w, source.h, dest.x, dest.y, dest.w, dest.h);
    };
    A_Canvas.prototype.setTransform = function (t) {
        this.context.setTransform(t[0], t[1], t[2], t[3], t[4], t[5]);
    };
    A_Canvas.prototype.setWorldTransform = function () {
        this.context.setTransform(this.worldTransform.m[0], this.worldTransform.m[1], this.worldTransform.m[2], this.worldTransform.m[3], this.worldTransform.m[4], this.worldTransform.m[5]);
    };
    A_Canvas.prototype.setOpacity = function (o) {
        if(o < 0) {
            o = 0;
        }
        if(o > 1) {
            o = 1;
        }
        this.currentOpacity = o;
        this.context.globalAlpha = o;
    };
    A_Canvas.prototype.setWorldOpacity = function () {
        this.setOpacity(this.currentOpacity);
    };
    A_Canvas.prototype.save = function () {
        this.transformStack.push(this.worldTransform.m.slice(0));
        this.opacityStack.push(this.currentOpacity);
        this.rotationStack.push(this.totalRotation);
    };
    A_Canvas.prototype.restore = function () {
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
    };
    A_Canvas.prototype.translatePt = function (point) {
        this.worldTransform.translate(point.x, point.y);
    };
    A_Canvas.prototype.translate = function (x, y) {
        this.worldTransform.translate(x, y);
    };
    A_Canvas.prototype.scalePt = function (point) {
        this.worldTransform.scale(point.x, point.y);
    };
    A_Canvas.prototype.scale = function (x, y) {
        this.worldTransform.scale(x, y);
    };
    A_Canvas.prototype.rotate = function (angle) {
        this.totalRotation += angle;
        angle = angle * 0.0174532925;
        this.worldTransform.rotate(angle);
    };
    A_Canvas.prototype.resetRotation = function () {
        this.totalRotation = 0;
    };
    return A_Canvas;
})();
