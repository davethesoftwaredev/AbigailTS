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
