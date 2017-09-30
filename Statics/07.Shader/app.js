/// <reference path="../JS/GLGame.js" />
/// <reference path="../JS/gl-matrix-min.js" />
/// <reference path="../JS/FPCamera.js" />
var GPUProgram,
    VertexBuffer,
    TexBuffer,
    FaceBuffer,
    Faces,
    TexBuffer,
    NormalBuffer;

var Keys = {};
var MatCamera = mat4.create();
var MatNormal = mat4.creatre();
var MatProj = mat4.create();
var LightPos = vec3.create();
var Ld = vec3.create();
var Kd = vec3.create();

var MatCameraPos,MatNormalPos;
var Cam;

var VBO;

var Locs = {
    "VertexProp": {
        Address: 0,
        Size: 3,
        Type: 0x1406,
        IsNormalized: false,
        Stride: 3 * Float32Array.BYTES_PER_ELEMENT,
        Offset: 0
    },
    "TexcoordProp": {
        Address: 1,
        Size: 2,
        Type: 0x1406,
        IsNormalized: false,
        Stride: 2 * Float32Array.BYTES_PER_ELEMENT,
        Offset: 0
    },
    "NormalProp": {
        Address: 2,
        Size: 3,
        Type: 0x1406,
        IsNormalized: false,
        Stride: 3 * Float32Array.BYTES_PER_ELEMENT,
        Offset: 0
    }
}

function Init(Signal) {
    var gl = this.gl;
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CW);

    mat4.perspective(MatProj, glMatrix.toRadian(45), 1, 0.1, 1000)
    Cam = new Camera({
        Pos: [0, 0, 20],
        Pitch: 0,
        Yaw: 0
    });


    var m1;

    d3.select("#CANVAS").on("mousemove", function () {
            var e = d3.event;

            if (e.buttons == 1) {
                var m2 = d3.mouse(this);
                Cam.SetYaw(-(m2[0] - m1[0]) * .1);
                Cam.SetPitch(-(m2[1] - m1[1]) * .1);
                m1 = m2;
            } else
                m1 = d3.mouse(this);
        })
        .on("wheel", function () {
            var e = d3.event;
            var amount = e.wheelDelta / Math.abs(e.wheelDelta) * 5;
            Cam.ForthBack(-amount);
        })
        .on("keydown", function () {
            var e = d3.event;


            switch (e.which) {
                case 65:
                case 68:
                case 87:
                case 83:
                    Keys[e.which] = 1;
            }
        })
        .on("keyup", function () {
            var e = d3.event;


            switch (e.which) {
                case 65:
                case 68:
                case 87:
                case 83:
                    Keys[e.which] = 0;
            }
        })


    Signal.DONE = 1;
}

function LoadData(Signal) {

    var gl = this.gl;

    var P1 = new GLProgramPack({
        "VSource": "vertex.hlsl",
        "PSource": "pixel.hlsl",
        "gl": gl
    })

    var P2 = new LoadImagePack({
        "ImagePaths": ["../Images/white.png"]
    })

    var P21 = new LoadJSONPack({
        "JsonPaths": ["vase.json"]
    })

    var P3 = new CPack({
        "Ins": ["IMAGES", "PROGRAM", "JSONS"],
        "FX": function () {
            var Ports = this.Ports;
            var image = Ports.IMAGES[0];
            var Model = Ports.JSONS[0];
            GPUProgram = Ports.PROGRAM;


            var Mesh = Model.meshes[0];

            Faces = [].concat.apply([], Mesh.faces)
            //Creating Buffer
            VertexBuffer = GLGame2.CreateVBO(gl, Mesh.vertices);
            GLGame2.BindVertexProps(gl, Locs["VertexProp"]);

            TexBuffer = GLGame2.CreateVBO(gl, Mesh.texturecoords[0])
            GLGame2.BindVertexProps(gl, Locs["TexcoordProp"]);

            NormalBuffer = GLGame2.CreateVBO(gl, Mesh.normals);
            GLGame2.BindVertexProps(gl, Locs["NormalProp"])

            FaceBuffer = GLGame2.CreateVBO(gl, Faces, false, gl.ELEMENT_ARRAY_BUFFER);

            MatCameraPos = gl.getUniformLocation(GPUProgram, 'MatCamera');
            var MatProjPos = gl.getUniformLocation(GPUProgram, 'MatProj');
            MatNormalPos = gl.getUniformLocation(GPUProgram,"MatrixNormal");

            gl.uniformMatrix4fv(MatProjPos, gl.FALSE, MatProj);

            TexBuffer = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, TexBuffer);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.activeTexture(gl.TEXTURE0);

            Signal.DONE = 1;
        }
    })

    var W = Cir8.MultiLink(P1, "X", P2, "X", P21, "X");
    var W1 = Cir8.Link(P1, "PROGRAM", "PROGRAM", P3);
    var W2 = Cir8.Link(P2, "IMAGES", "IMAGES", P3);
    var W3 = Cir8.Link(P21, "JSONS", "JSONS", P3);

    W.Signal = "Start";
}

function Render() {
    var gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(GPUProgram);

    if (Keys[65]) {
        Cam.LeftRight(-1);
    }

    if (Keys[68]) {
        Cam.LeftRight(1);
    }

    if (Keys[87]) {
        Cam.ForthBack(-1);
    }

    if (Keys[83]) {
        Cam.ForthBack(1);
    }

    Cam.GetMatrix(MatCamera)
    
    mat4.transpose(MatNormal,MatCamera);
    mat4.inverse(MatNormal,MatNormal);

    gl.uniformMatrix4fv(MatCameraPos, gl.FALSE, MatCamera);
    gl.uniformMatrix4fv(MatNormalPos,gl.FALSE,MatNormal)

    gl.bindTexture(gl.TEXTURE_2D, TexBuffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.drawElements(gl.TRIANGLES, Faces.length, gl.UNSIGNED_INT, 0);
}


var MyGame = new GLGame2({
    Width: 800,
    Height: 800,
    Canvas: "#CANVAS",
    Init: Init,
    LoadData: LoadData,
    Render: Render
})

MyGame.Start();