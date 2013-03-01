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
