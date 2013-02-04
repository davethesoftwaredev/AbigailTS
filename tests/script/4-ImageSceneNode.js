var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ImageSceneNodeScreen = (function (_super) {
    __extends(ImageSceneNodeScreen, _super);
    function ImageSceneNodeScreen() {
        _super.apply(this, arguments);

    }
    ImageSceneNodeScreen.prototype.load = function (controller) {
        _super.prototype.load.call(this, controller);
        this.img1 = new A_ImageSceneNode('flowers');
        this.img2 = new A_ImageSceneNode('flowers');
        this.img3 = new A_ImageSceneNode('flowers');
        this.img4 = new A_ImageSceneNode('flowers');
        this.rootNode.addChild(this.img1);
        this.rootNode.addChild(this.img2);
        this.rootNode.addChild(this.img3);
        this.rootNode.addChild(this.img4);
        this.img1.opacity = 0.5;
        this.img2.location.x = 200;
        this.img2.location.y = 200;
        this.img3.location.x = 400;
        this.img3.location.y = 200;
        this.img4.scale.x = 0.5;
        this.img4.scale.y = 0.5;
        this.img4State = 0;
    };
    ImageSceneNodeScreen.prototype.tick = function (controller) {
        _super.prototype.tick.call(this, controller);
        this.img2.rotation++;
        this.img3.rotation--;
        this.updateImg4();
    };
    ImageSceneNodeScreen.prototype.updateImg4 = function () {
        switch(this.img4State) {
            case 0: {
                this.img4.location.x++;
                if(this.img4.location.x >= 400) {
                    this.img4State = 1;
                }
                break;

            }
            case 1: {
                this.img4.location.y++;
                if(this.img4.location.y >= 400) {
                    this.img4State = 2;
                }
                break;

            }
            case 2: {
                this.img4.location.x--;
                if(this.img4.location.x <= 0) {
                    this.img4State = 3;
                }
                break;

            }
            case 3: {
                this.img4.location.y--;
                if(this.img4.location.y <= 0) {
                    this.img4State = 0;
                }
                break;

            }
        }
    };
    ImageSceneNodeScreen.prototype.render = function (controller) {
        _super.prototype.clear.call(this, controller);
        _super.prototype.render.call(this, controller);
    };
    return ImageSceneNodeScreen;
})(A_Screen);
var game4;
function init4_imagescenenode() {
    var defs = new A_ResourceDefs();
    defs.images['flowers'] = 'img/Flowers.jpg';
    game4 = new A_Controller('4-ImageSceneNode', defs);
    game4.showFramerate = true;
    game4.pushScreen(new ImageSceneNodeScreen());
    loop4();
}
function loop4() {
    game4.tick();
    game4.render();
    if(!game4.exitLoop) {
        setTimeout(loop4, 16);
    }
}
