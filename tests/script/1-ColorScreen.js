var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var ColorScreen = (function (_super) {
    __extends(ColorScreen, _super);
    function ColorScreen() {
        _super.call(this);
        this.color = new A_RGBA(0, 0, 0, 255);
    }
    ColorScreen.prototype.tick = function () {
        this.color.r = Math.random() * 255;
        this.color.g = Math.random() * 255;
        this.color.b = Math.random() * 255;
    };
    ColorScreen.prototype.render = function (controller) {
        controller.canvas.fillBackground(this.color);
    };
    return ColorScreen;
})(A_Screen);
var game;
function init() {
    game = new A_Controller('main');
    game.pushScreen(new ColorScreen());
    loop();
}
function loop() {
    game.tick();
    game.render();
    if(!game.exitLoop) {
        setTimeout(loop, 25);
    }
}
