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
var A_Controller = (function () {
    function A_Controller(canvasId, resourceDefs) {
        this.canvasId = canvasId;
        this.resourceDefs = resourceDefs;
        this.resources = new A_Resources(resourceDefs);
        this.canvas = new A_Canvas(document.getElementById(canvasId));
        this.screens = [];
        this.exitLoop = false;
        this.frames = 0;
        this.framerate = 0;
        this.showFramerate = false;
        this.lastFramerateTime = new Date().getTime();
        this.frameratePoint = new A_Point(15, 15);
        this.framerateColor = new A_RGBA(255, 255, 255, 255);
        this.loadingScreen = new A_LoadingScreen();
        this.screens.push(this.loadingScreen);
        this.loadingScreen.load(this);
        this.currentScreen = this.loadingScreen;
    }
    A_Controller.prototype.pushScreen = function (s) {
        this.screens.push(s);
        if(this.loadingScreen.completed == true && s.loaded == false) {
            s.load(this);
        }
        if(this.loadingScreen.completed == true) {
            this.currentScreen = s;
        }
    };
    A_Controller.prototype.popScreen = function () {
        this.screens.pop();
        this.currentScreen = this.screens[this.screens.length - 1];
    };
    A_Controller.prototype.render = function () {
        this.currentScreen.render(this);
        if(this.showFramerate) {
            this.calcFrameRate();
            this.canvas.drawText(this.frameratePoint, this.framerate.toString(), this.framerateColor);
        }
    };
    A_Controller.prototype.calcFrameRate = function () {
        this.frames++;
        var ct = new Date().getTime();
        if(ct - this.lastFramerateTime > 1000) {
            this.framerate = this.frames;
            this.frames = 0;
            this.lastFramerateTime = ct;
        }
    };
    A_Controller.prototype.tick = function () {
        this.currentScreen.tick(this);
        if(this.currentScreen == this.loadingScreen && this.loadingScreen.completed) {
            this.currentScreen = this.screens[this.screens.length - 1];
            this.currentScreen.load(this);
        }
    };
    return A_Controller;
})();
var A_SceneNode = (function () {
    function A_SceneNode() {
        this.location = new A_Point(0, 0);
        this.scale = new A_Point(1, 1);
        this.rotation = 0;
        this.forwardVector = new A_Point(1, 0);
        this.calcForwardVector = true;
        this.children = [];
        this.center = new A_Point(0, 0);
        this.opacity = 1;
        this.directionVector = new A_Point(1, 0);
        this.worldRotation = 0;
    }
    A_SceneNode.prototype.addedToSceneGraph = function (controller) {
        this.controller = controller;
    };
    A_SceneNode.prototype.transform = function (controller) {
        controller.canvas.translatePt(this.location);
        controller.canvas.translatePt(this.center);
        controller.canvas.rotate(this.rotation);
        controller.canvas.translate(-this.center.x, -this.center.y);
        controller.canvas.scalePt(this.scale);
        controller.canvas.setWorldTransform();
        this.worldRotation = controller.canvas.totalRotation;
        if(this.calcForwardVector) {
            var tf = new Transform();
            tf.rotate(this.worldRotation * 0.0174532925);
            var pt = tf.transformPoint(this.directionVector.x, this.directionVector.y);
            this.forwardVector.x = pt[0];
            this.forwardVector.y = pt[1];
        }
    };
    A_SceneNode.prototype.addChild = function (child) {
        child.addedToSceneGraph(this.controller);
        this.children.push(child);
    };
    A_SceneNode.prototype.removeChild = function (child) {
        for(var i = 0; i < this.children.length; i++) {
            if(this.children[i] == child) {
                this.children.splice(i, 1);
                break;
            }
        }
    };
    A_SceneNode.prototype.render = function (controller) {
        this.renderChildren(controller);
    };
    A_SceneNode.prototype.tick = function (controller) {
    };
    A_SceneNode.prototype.tickChildren = function (controller) {
        for(var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.tick(controller);
            child.tickChildren(controller);
        }
    };
    A_SceneNode.prototype.renderChildren = function (controller) {
        var child;
        for(var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            controller.canvas.save();
            if(child.opacity < 1) {
                controller.canvas.setOpacity(child.opacity * controller.canvas.currentOpacity);
            }
            child.transform(controller);
            child.render(controller);
            controller.canvas.restore();
        }
    };
    return A_SceneNode;
})();
var A_Screen = (function () {
    function A_Screen() {
        this.bg = new A_RGBA(0, 0, 0, 1);
        this.loaded = false;
    }
    A_Screen.prototype.tick = function (controller) {
        this.rootNode.tickChildren(controller);
    };
    A_Screen.prototype.load = function (controller) {
        this.rootNode = new A_SceneNode();
        this.rootNode.addedToSceneGraph(controller);
        this.loaded = true;
    };
    A_Screen.prototype.render = function (controller) {
        controller.canvas.resetRotation();
        this.rootNode.render(controller);
    };
    A_Screen.prototype.clear = function (controller) {
        controller.canvas.fillBackground(this.bg);
    };
    return A_Screen;
})();
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
var A_ResourceDefs = (function () {
    function A_ResourceDefs() {
        this.images = [];
        this.animations = [];
    }
    return A_ResourceDefs;
})();
var A_Resources = (function () {
    function A_Resources(resourceDefs) {
        this.resourceDefs = resourceDefs;
        this.imageCount = 0;
        this.images = [];
        this.animations = [];
        if(resourceDefs) {
            for(var i in resourceDefs.images) {
                this.loadImage(i, resourceDefs.images[i]);
            }
            for(var a in resourceDefs.animations) {
                this.animations[a] = resourceDefs.animations[a];
            }
        }
    }
    A_Resources.prototype.loadImage = function (name, imageUrl) {
        var i = new Image();
        i.src = imageUrl;
        this.images[name] = i;
        this.imageCount++;
    };
    A_Resources.prototype.loadImages = function (images) {
        for(var i in images) {
            this.loadImage(i, images[i]);
        }
    };
    A_Resources.prototype.percentLoaded = function () {
        var completed = 0;
        if(this.imageCount == 0) {
            return 1;
        }
        for(var i in this.images) {
            if(this.images[i].complete) {
                completed++;
            }
        }
        return completed / this.imageCount;
    };
    A_Resources.prototype.get = function (name) {
        return this.images[name];
    };
    return A_Resources;
})();
var A_RectSceneNode = (function (_super) {
    __extends(A_RectSceneNode, _super);
    function A_RectSceneNode(width, height, color) {
        _super.call(this);
        this.r = new A_Rect(0, 0, width, height);
        if(color != null) {
            this.c = color;
        } else {
            this.c = new A_RGBA(0, 0, 0, 1);
        }
    }
    A_RectSceneNode.prototype.render = function (controller) {
        controller.canvas.setFill(this.c);
        controller.canvas.drawRect(this.r);
        this.renderChildren(controller);
    };
    return A_RectSceneNode;
})(A_SceneNode);
var A_ImageSceneNode = (function (_super) {
    __extends(A_ImageSceneNode, _super);
    function A_ImageSceneNode(imageTag) {
        _super.call(this);
        this.imageTag = imageTag;
        this.imgRect = new A_Rect(0, 0, 0, 0);
    }
    A_ImageSceneNode.prototype.addedToSceneGraph = function (controller) {
        _super.prototype.addedToSceneGraph.call(this, controller);
        this.img = controller.resources.images[this.imageTag];
        this.imgRect.w = this.img.width;
        this.imgRect.h = this.img.height;
    };
    A_ImageSceneNode.prototype.render = function (controller) {
        controller.canvas.drawImage(this.img, this.imgRect, this.imgRect);
        this.renderChildren(controller);
    };
    return A_ImageSceneNode;
})(A_SceneNode);
var A_AnimationSceneNode = (function (_super) {
    __extends(A_AnimationSceneNode, _super);
    function A_AnimationSceneNode(animationTag) {
        _super.call(this);
        this.animationTag = animationTag;
        this.imgRect = new A_Rect(0, 0, 0, 0);
        this.destRect = new A_Rect(0, 0, 0, 0);
        this.delta = 0;
        this.currentFrame = 0;
    }
    A_AnimationSceneNode.prototype.addedToSceneGraph = function (controller) {
        _super.prototype.addedToSceneGraph.call(this, controller);
        this.anim = controller.resources.animations[this.animationTag];
        if(this.anim != undefined) {
            this.img = controller.resources.images[this.anim.image];
            this.imgRect.w = this.anim.frameWidth;
            this.imgRect.h = this.anim.frameHeight;
            this.destRect.w = this.anim.frameWidth;
            this.destRect.h = this.anim.frameHeight;
        }
    };
    A_AnimationSceneNode.prototype.tick = function (controller) {
        if(this.anim != undefined && this.anim.frames.length > 0) {
            var time = new Date().getTime();
            if(this.delta == 0) {
                this.delta = time;
            }
            if(time - this.delta >= this.anim.frames[this.currentFrame].duration) {
                this.delta = time;
                this.currentFrame++;
                if(this.currentFrame >= this.anim.frames.length) {
                    this.currentFrame = 0;
                }
            }
        }
    };
    A_AnimationSceneNode.prototype.render = function (controller) {
        if(this.anim != undefined) {
            this.imgRect.x = this.anim.frames[this.currentFrame].index * this.anim.frameWidth;
            controller.canvas.drawImage(this.img, this.imgRect, this.destRect);
            this.renderChildren(controller);
        }
    };
    return A_AnimationSceneNode;
})(A_SceneNode);
