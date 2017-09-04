/// <reference path="../JS/GLGame.js" />
/// <reference path="../JS/gl-matrix-min.js" />
var GPUProgram;
var MatWorld = mat4.create();
var MatCamera = mat4.create();
var MatProj = mat4.create();

mat4.lookAt(MatCamera,[0,10,10],[0,0,0],[0,0,1]);
mat4.perspective(MatProj,glMatrix.toRadian(60),1,0.1,1000)

var VBO;

function Init(Signal) {
    var gl = this.gl;
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    Signal.DONE = 1;
}

function LoadData(Signal) {
    var gl = this.gl;
    VBO = GLGame.CreateVBO(gl,[
        0,0,0,   1,0,0,
        2,0,0, 0,1,0,
        0,1,0,  0,0,1
    ]);    

    var p = new GLProgram({
        "VSource": "vertex.hlsl",
        "PSource": "pixel.hlsl",
        "gl": gl,
        "Locs": [{            
            Address: 0,
            Size: 3,
            Type: 0x1406,
            IsNormalized:false,
            Stride : 6 * Float32Array.BYTES_PER_ELEMENT,
            Offset: 0
        }, {            
            Address: 1,
            Size: 3,
            Type: 0x1406,
            IsNormalized:false,
            Stride : 6 * Float32Array.BYTES_PER_ELEMENT,
            Offset: 3 * Float32Array.BYTES_PER_ELEMENT
        }]
    });
    p.Compile(function (pro) {
        GPUProgram = pro;
        var MatWorldPos =  gl.getUniformLocation(GPUProgram,'MatWorld');
        var MatCameraPos =  gl.getUniformLocation(GPUProgram,'MatCamera');
        var MatProjPos = gl.getUniformLocation(GPUProgram,'MatProj');

        gl.uniformMatrix4fv(MatWorldPos,gl.FALSE,MatWorld);
        gl.uniformMatrix4fv(MatCameraPos,gl.FALSE,MatCamera);
        gl.uniformMatrix4fv(MatProjPos,gl.FALSE,MatProj);

        Signal.DONE=1;
    })

}

function Render() {
    var gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(GPUProgram);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}


var MyGame = new GLGame({
    Width: 800,
    Height: 800,
    Canvas: "#CANVAS",
    Init: Init,
    LoadData: LoadData,
    Render: Render
})

MyGame.Start();