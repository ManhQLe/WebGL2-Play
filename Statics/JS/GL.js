function WebGL(e, w, h) {
    w = w ? w : 800;
    h = h ? h : 800;
    var canvas = typeof (e) == 'string' ? document.querySelector(e) : e;
    this.CANVAS = canvas;
    CANVAS.width = w
    CANVAS.height = h 
    this.GL = canvas.getContext('webgl2');
    //this.GL.viewport(0,0,w,h);
    var me = this;
    var Loop = this.Loop = function () {
        me.Render();
        requestAnimationFrame(Loop);
    }

    this.Render = function () {};
    this.Init = function () {};
}

WebGL.prototype.Start = function () {
    this.Init();
    this.Loop();
}