var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var A_LoadingScreen = (function (_super) {
    __extends(A_LoadingScreen, _super);
    function A_LoadingScreen() {
        _super.call(this);
        this.completed = false;
        this.textPoint = new A_Point(0, 0);
        this.color = new A_RGBA(255, 255, 255, 1);
    }
    A_LoadingScreen.prototype.tick = function (controller) {
        if(controller.resources.percentLoaded() >= 1) {
            this.completed = true;
        }
    };
    A_LoadingScreen.prototype.render = function (controller) {
        _super.prototype.render.call(this, controller);
        controller.canvas.drawText(this.textPoint, 'Loading... ' + (controller.resources.percentLoaded() * 100).toString() + '%', this.color);
    };
    return A_LoadingScreen;
})(A_Screen);
