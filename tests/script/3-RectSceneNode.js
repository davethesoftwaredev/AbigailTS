var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var RectSceneNodeScreen = (function (_super) {
    __extends(RectSceneNodeScreen, _super);
    function RectSceneNodeScreen() {
        _super.apply(this, arguments);

    }
    RectSceneNodeScreen.prototype.load = function (controller) {
        _super.prototype.load.call(this, controller);
        this.r1 = new A_RectSceneNode(100, 100, new A_RGBA(255, 0, 0, 1));
        this.r2 = new A_RectSceneNode(100, 100, new A_RGBA(0, 255, 0, 1));
        this.r3 = new A_RectSceneNode(50, 50, new A_RGBA(0, 0, 255, 1));
        this.r4 = new A_RectSceneNode(25, 25, new A_RGBA(255, 255, 255, 255));
        this.rootNode.addChild(this.r1);
        this.rootNode.addChild(this.r2);
        this.r1.addChild(this.r3);
        this.r3.addChild(this.r4);
        this.r1.location.x = 100;
        this.r1.location.y = 100;
        this.r2.location.x = 400;
        this.r2.location.y = 300;
        this.r3.center.x = 25;
        this.r3.center.y = 25;
        this.r1OpacityDir = -0.02;
        this.r2ScaleDir = 0.05;
        this.r4State = 1;
    };
    RectSceneNodeScreen.prototype.tick = function (controller) {
        _super.prototype.tick.call(this, controller);
        this.rotateRects();
        this.scaleRects();
        this.moveRects();
        this.setRectOpacities();
    };
    RectSceneNodeScreen.prototype.rotateRects = function () {
        this.r1.rotation += 1;
        this.r3.rotation += 1;
    };
    RectSceneNodeScreen.prototype.scaleRects = function () {
        this.r2.scale.x += this.r2ScaleDir;
        this.r2.scale.y += this.r2ScaleDir;
        if((this.r2ScaleDir > 0 && this.r2.scale.x >= 2) || (this.r2ScaleDir < 0 && this.r2.scale.x <= -2)) {
            this.r2ScaleDir = -this.r2ScaleDir;
        }
    };
    RectSceneNodeScreen.prototype.moveRects = function () {
        if(this.r4State == 1 && this.r4.location.x < 25) {
            this.r4.location.x++;
        } else {
            if(this.r4State == 1 && this.r4.location.x == 25) {
                this.r4State = 2;
            } else {
                if(this.r4State == 2 && this.r4.location.y < 25) {
                    this.r4.location.y++;
                } else {
                    if(this.r4State == 2 && this.r4.location.y == 25) {
                        this.r4State = 3;
                    } else {
                        if(this.r4State == 3 && this.r4.location.x > 0) {
                            this.r4.location.x--;
                        } else {
                            if(this.r4State == 3 && this.r4.location.x == 0) {
                                this.r4State = 4;
                            } else {
                                if(this.r4State == 4 && this.r4.location.y > 0) {
                                    this.r4.location.y--;
                                } else {
                                    if(this.r4State == 4 && this.r4.location.y == 0) {
                                        this.r4State = 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    RectSceneNodeScreen.prototype.setRectOpacities = function () {
        this.r1.opacity += this.r1OpacityDir;
        if((this.r1.opacity <= 0 && this.r1OpacityDir < 0) || (this.r1.opacity >= 1 && this.r1OpacityDir > 0)) {
            this.r1OpacityDir = -this.r1OpacityDir;
        }
    };
    RectSceneNodeScreen.prototype.render = function (controller) {
        _super.prototype.clear.call(this, controller);
        _super.prototype.render.call(this, controller);
    };
    return RectSceneNodeScreen;
})(A_Screen);
var game3;
function init3_rectscenenode() {
    game3 = new A_Controller('3-RectSceneNode');
    game3.showFramerate = true;
    game3.pushScreen(new RectSceneNodeScreen());
    loop3();
}
function loop3() {
    game3.tick();
    game3.render();
    if(!game3.exitLoop) {
        setTimeout(loop3, 16);
    }
}
