var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var AIEntity = (function () {
    function AIEntity(screen) {
        this.screen = screen;
        this.node = new A_AnimationSceneNode('creature');
        this.node.location = new A_Point(Math.floor(Math.random() * 800), Math.floor(Math.random() * 600));
        this.health = 100;
        this.node.scale.x = 0.4;
        this.node.scale.y = 0.4;
        this.targetPoint = null;
    }
    AIEntity.prototype.tick = function () {
        if(this.targetPoint != null) {
            if(this.screen.distance(this.node.location, this.targetPoint) < 15) {
                this.screen.removeFoodAtPoint(this.targetPoint);
                this.targetPoint = null;
            }
            this.move();
        } else {
            this.targetPoint = this.screen.getNearestFood(this.node.location);
        }
    };
    AIEntity.prototype.move = function () {
        var changeX = 0;
        var changeY = 0;
        if(this.targetPoint == null) {
            return;
        }
        if(this.targetPoint.x > this.node.location.x) {
            changeX = 1;
        } else {
            if(this.targetPoint.x < this.node.location.x) {
                changeX = -1;
            } else {
                changeX = 0;
            }
        }
        if(this.targetPoint.y > this.node.location.y) {
            changeY = 1;
        } else {
            if(this.targetPoint.y < this.node.location.y) {
                changeY = -1;
            } else {
                changeY = 0;
            }
        }
        if(changeX == 0 && changeY == 0) {
            this.node.rotation = 0;
        } else {
            if(changeX == -1 && changeY == -1) {
                this.node.rotation = 225;
            } else {
                if(changeX == -1 && changeY == 0) {
                    this.node.rotation = 180;
                } else {
                    if(changeX == -1 && changeY == 1) {
                        this.node.rotation = 135;
                    } else {
                        if(changeX == 0 && changeY == -1) {
                            this.node.rotation = -90;
                        } else {
                            if(changeX == 0 && changeY == 1) {
                                this.node.rotation = 90;
                            } else {
                                if(changeX == 1 && changeY == -1) {
                                    this.node.rotation = -45;
                                } else {
                                    if(changeX == 1 && changeY == 0) {
                                        this.node.rotation = 0;
                                    } else {
                                        if(changeX == 1 && changeY == 1) {
                                            this.node.rotation = 45;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        this.node.location.x += changeX;
        this.node.location.y += changeY;
    };
    return AIEntity;
})();
var SimpleAIScreen = (function (_super) {
    __extends(SimpleAIScreen, _super);
    function SimpleAIScreen() {
        _super.apply(this, arguments);

    }
    SimpleAIScreen.prototype.load = function (controller) {
        _super.prototype.load.call(this, controller);
        this.food = [];
        this.entities = [];
        for(var i = 0; i < 20; i++) {
            var e = new AIEntity(this);
            this.rootNode.addChild(e.node);
            this.entities.push(e);
        }
        for(var i = 0; i < 15; i++) {
            var f = new A_ImageSceneNode('food');
            f.scale.x = 0.1;
            f.scale.y = 0.1;
            f.location = new A_Point(Math.floor(Math.random() * 800), Math.floor(Math.random() * 600));
            f.rotation = Math.floor(Math.random() * 360);
            this.rootNode.addChild(f);
            this.food.push(f);
        }
    };
    SimpleAIScreen.prototype.tick = function (controller) {
        _super.prototype.tick.call(this, controller);
        for(var i = 0; i < this.food.length; i++) {
            this.food[i].rotation++;
            if(this.food[i].rotation > 360) {
                this.food[i].rotation = this.food[i].rotation - 360;
            }
        }
        for(var i = 0; i < this.entities.length; i++) {
            this.entities[i].tick();
        }
    };
    SimpleAIScreen.prototype.render = function (controller) {
        _super.prototype.clear.call(this, controller);
        _super.prototype.render.call(this, controller);
    };
    SimpleAIScreen.prototype.getNearestFood = function (point) {
        var nearest = -1;
        var nearestDistance = 99999;
        for(var i = 0; i < this.food.length; i++) {
            var f = this.food[i];
            var dist = this.distance(point, f.location);
            if(dist < nearestDistance) {
                nearest = i;
                nearestDistance = dist;
            }
        }
        if(nearest > -1) {
            return this.food[nearest].location;
        }
    };
    SimpleAIScreen.prototype.removeFoodAtPoint = function (point) {
        for(var i = 0; i < this.food.length; i++) {
            var f = this.food[i];
            if(f.location.x == point.x && f.location.y == point.y) {
                this.rootNode.removeChild(f);
                this.food.splice(i, 1);
                break;
            }
        }
    };
    SimpleAIScreen.prototype.distance = function (p1, p2) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    };
    return SimpleAIScreen;
})(A_Screen);
var game6;
function init6_simpleaiscreen() {
    var defs = new A_ResourceDefs();
    defs.images['creature'] = 'img/creature.png';
    defs.images['food'] = 'img/food.png';
    defs.animations['creature'] = {
        name: 'creature',
        image: 'creature',
        frameWidth: 64,
        frameHeight: 64,
        frames: [
            {
                index: 0,
                duration: 100
            }, 
            {
                index: 1,
                duration: 100
            }
        ]
    };
    game6 = new A_Controller('6-SimpleAIScreen', defs);
    game6.showFramerate = true;
    game6.pushScreen(new SimpleAIScreen());
    loop6();
}
function loop6() {
    game6.tick();
    game6.render();
    if(!game6.exitLoop) {
        setTimeout(loop6, 16);
    }
}
