/// <reference path="../JS/GLGame.js" />
/// <reference path="../JS/gl-matrix-min.js" />
var GPUProgram,BoxDataBuffer,BoxIndexBuffer;
var MatWorld = mat4.create();
var MatCamera = mat4.create();
var MatProj = mat4.create();

var BoxData = [
    -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
    -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
    1.0, 1.0, 1.0,     0.5, 1, 0.5,
    1.0, 1.0, -1.0,    0.5, 0, 1,

    // Left
    -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
    -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
    -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
    -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

    // Right
    1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
    1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
    1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
    1.0, 1.0, -1.0,   0.75, 0.25, 0,

    // Front
    1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
    1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
    -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
    -1.0, 1.0, 1.0,    1.0, 1.0, 0.15,

    // Back
    1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
    1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
    -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
    -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

    // Bottom
    -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
    -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
    1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
    1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
]

var BoxIndicies = [
    0,1,2,
    0,2,3,

    4,5,6,
    6,4,7,
    
    8,9,10,
    8,10,11,

    13,12,14,
    15,14,12,

    16,17,18,
    16,18,19,

    21,20,22,
    22,20,23
]

mat4.lookAt(MatCamera,[5,10,5],[0,0,0],[0,0,1]);
mat4.perspective(MatProj,glMatrix.toRadian(45),1,0.1,1000)

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
    BoxDataBuffer = GLGame.CreateVBO(gl,BoxData);
    BoxIndexBuffer = GLGame.CreateVBO(gl,BoxIndicies,false,gl.ELEMENT_ARRAY_BUFFER);
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
    gl.drawElements(gl.TRIANGLES, BoxIndicies.length, gl.UNSIGNED_INT,0);
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