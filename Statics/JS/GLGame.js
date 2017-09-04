/// <reference path="Ctrl8.js" />
/// <reference path="Cir8.js" />

function GLGame(init) {
    GLGame.baseConstructor.call(this, init);
    this.Prop("Width", 800);
    this.Prop("Height", 800);
    this.Prop("Canvas");
    this.Prop("Init", function () {});
    this.Prop("LoadData", function () {});
    this.Prop("Render", function () {});


    this.Canvas = typeof (this.Canvas) == 'string' ? document.querySelector(this.Canvas) : this.Canvas;
    this.Canvas.width = this.Width
    this.Canvas.height = this.Height;
    this.gl = this.Canvas.getContext('webgl2');
    this.gl.viewport(0, 0, this.Width, this.Height);
    var me = this;

    function Loop() {
        me.Render();
        requestAnimationFrame(Loop);
    }

    var InitChip = new CPack({
        "FX": function () {
            me.Init(this.Ports);
        }
    })

    var LoadDataChip = new CPack({
        "FX": function () {
            me.LoadData(this.Ports);
        }
    })

    var RenderChip = new CPack({
        "FX": function () {
            Loop();
        }
    });

    this._.Wire = Cir8.Wire("W");
    this._.Wire.Connect(InitChip,"X");
    Cir8.Link(InitChip, "DONE", "A", LoadDataChip);    
    Cir8.Link(LoadDataChip, "DONE", "B", RenderChip);

}

EventCtrl.ExtendsTo(GLGame);

GLGame.prototype.Start = function () {
    this._.Wire.Signal = 1;
}

GLGame.CreateShader = function (gl, source, type) {
    var shader = gl.createShader(type=="PS"?gl.FRAGMENT_SHADER:gl.VERTEX_SHADER);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success)
        return shader
    console.log(type)
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

GLGame.CreateProgram = function (gl, vshader, pshader,Locs) {
    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, pshader);
    gl.linkProgram(program);    
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {       
        gl.useProgram(program);
        if(Locs)
        Locs.forEach(function(Loc){
            gl.enableVertexAttribArray(Loc.Address);
            gl.vertexAttribPointer(Loc.Address,Loc.Size,Loc.Type,Loc.IsNormalized,Loc.Stride,Loc.Offset);
        });
        return program;
    }    
    console.log(gl.getProgramInfoLog(program));

    gl.deleteProgram(program);
}

GLGame.CreateVBO = function (gl, Data, IsDynamic) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Data), IsDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
    return buffer;
}
GLGame.CreateVAO = function(gl){
    var VAO = gl.createVertexArray();
    gl.bindVertexArray(VAO);
    return VAO;
}

GLGame.GetShaderSources = function(Done,Sources){
    Async8.DPQueue(Sources,function(Cfx,ps,i){
        var Path = ps[i];
        $.ajax({
            url:Path,
            dataType:"text",
            success:function(d){
                Cfx(d)
            }
        })
    },Done)    
}

function GLProgram(init){
    GLProgram.baseConstructor.call(this,init);
    this.Prop("gl");
    this.Prop("VSource");
    this.Prop("PSource");
    this.Prop("Locs",[]);

}

EventCtrl.ExtendsTo(GLProgram);

GLProgram.prototype.Compile = function (Done){    
    var me = this;
    console.log(me.Locs)
    GLGame.GetShaderSources(function(S){
        var VShader = GLGame.CreateShader(me.gl,S[0],"VS");
        var PShader = GLGame.CreateShader(me.gl,S[1],"PS");
        var Program = GLGame.CreateProgram(me.gl,VShader,PShader,me.Locs);
        Done(Program);
    },[this.VSource,this.PSource]);

}

