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
