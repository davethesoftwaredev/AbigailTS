var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var BlockScreen = (function (_super) {
    __extends(BlockScreen, _super);
    function BlockScreen() {
        _super.call(this);
        this.rows = 50;
        this.cols = 50;
        this.colors = [];
        this.directions = [];
        for(var i = 0; i < this.rows * this.cols; i++) {
            this.colors[i] = Math.floor(Math.random() * 255);
            this.directions[i] = Math.floor(Math.random() * 5) + 1;
        }
    }
    BlockScreen.prototype.tick = function (controller) {
        for(var y = 0; y < this.rows; y++) {
            for(var x = 0; x < this.cols; x++) {
                this.colors[y * this.rows + x] += this.directions[y * this.rows + x];
                if(this.colors[y * this.rows + x] > 255 || this.colors[y * this.rows + x] < 0) {
                    this.directions[y * this.rows + x] = -1 * this.directions[y * this.rows + x];
                }
            }
        }
    };
    BlockScreen.prototype.render = function (controller) {
        var rect = new A_Rect(0, 0, 0, 0);
        var color = new A_RGBA(0, 0, 0, 255);
        rect.w = Math.floor(controller.canvas.width / this.rows);
        rect.h = Math.floor(controller.canvas.height / this.cols);
        for(var y = 0; y < this.rows; y++) {
            for(var x = 0; x < this.cols; x++) {
                rect.x = x * rect.w;
                rect.y = y * rect.h;
                color.r = color.g = color.b = this.colors[y * this.rows + x];
                controller.canvas.setFill(color);
                controller.canvas.drawRect(rect);
            }
        }
    };
    return BlockScreen;
})(A_Screen);
var game;
function init() {
    game = new A_Controller('main');
    game.pushScreen(new BlockScreen());
    loop();
}
function loop() {
    game.tick();
    game.render();
    if(!game.exitLoop) {
        setTimeout(loop, 25);
    }
}
