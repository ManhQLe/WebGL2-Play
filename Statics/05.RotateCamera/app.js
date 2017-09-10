/// <reference path="../JS/GLGame.js" />
/// <reference path="../JS/gl-matrix-min.js" />
/// <reference path="Camera.js" />
var GPUProgram,BoxDataBuffer,BoxIndexBuffer,TexBuffer;
var MatWorld = mat4.create();
var MatCamera = mat4.create();
var MatProj = mat4.create();
var MatCameraPos
var Cam;

var Keys = {};
var BoxData = [
    -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,       0,0,
    -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,       0,1,
    1.0, 1.0, 1.0,     0.5, 1, 0.5,         1,1,
    1.0, 1.0, -1.0,    0.5, 0, 1,           1,0,

    // Left
    -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,     0,0,
    -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,     0,1,
    -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,     1,1,
    -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,     1,0,

    // Right
    1.0, 1.0, 1.0,    0.25, 0.25, 0.75,     0,0,
    1.0, -1.0, 1.0,   0.25, 0.25, 0.75,     0,1,
    1.0, -1.0, -1.0,  0.25, 0.25, 0.75,     1,1,
    1.0, 1.0, -1.0,   0.75, 0.25, 0,        1,0,

    // Front
    1.0, 1.0, 1.0,    1.0, 0.0, 0.15,       0,0,
    1.0, -1.0, 1.0,    1.0, 0.0, 0.15,      0,1,
    -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,     1,1,
    -1.0, 1.0, 1.0,    1.0, 1.0, 0.15,      1,0,

    // Back
    1.0, 1.0, -1.0,    0.0, 1.0, 0.15,      0,0,
    1.0, -1.0, -1.0,    0.0, 1.0, 0.15,     0,1,
    -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,    1,1,
    -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,     1,0,

    // Bottom
    -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,      0,0,
    -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,      0,1,
    1.0, -1.0, 1.0,     0.5, 0.5, 1.0,      1,1,
    1.0, -1.0, -1.0,    0.5, 0.5, 1.0,      1,0
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

var VBO;

function Init(Signal) {
    var gl = this.gl;
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);    

    mat4.perspective(MatProj,glMatrix.toRadian(45),1,0.1,1000)
    Cam = new Camera({
        Pos:[0,0,20],
        Pitch:0,
        Yaw:0
    });
    Cam.GetMatrix(MatCamera)
    
    var m1;
    
    d3.select("#CANVAS").on("mousemove",function(){
        var e = d3.event;
               
        if (e.buttons == 1) {
            var m2 =d3.mouse(this);
            Cam.SetYaw((m2[0]-m1[0])*.5);
            Cam.SetPitch((m2[1]-m1[1])*.5);
            m1 = m2;
        }
        else
            m1 = d3.mouse(this);
    })
    .on("wheel",function(){
        var e = d3.event;
        var amount = e.wheelDelta/Math.abs(e.wheelDelta);
        Cam.ForthBack(-amount);
    })
    .on("keydown",function(){
        var e = d3.event;
        
       
        switch(e.which){
            case 65:                                
            case 68:                                
            case 87:                                
            case 83:                
                Keys[e.which] = 1;
        }
    })
    .on("keyup",function(){
        var e = d3.event;
        
       
        switch(e.which){
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
    BoxDataBuffer = GLGame.CreateVBO(gl,BoxData);
    BoxIndexBuffer = GLGame.CreateVBO(gl,BoxIndicies,false,gl.ELEMENT_ARRAY_BUFFER);    
    var P1 = new GLProgramPack({
        "VSource": "vertex.hlsl",
        "PSource": "pixel.hlsl",
        "gl": gl,
        "Locs": [{            
            Address: 0,
            Size: 3,
            Type: 0x1406,
            IsNormalized:false,
            Stride : 8 * Float32Array.BYTES_PER_ELEMENT,
            Offset: 0
        }, {            
            Address: 1,
            Size: 3,
            Type: 0x1406,
            IsNormalized:false,
            Stride : 8 * Float32Array.BYTES_PER_ELEMENT,
            Offset: 3 * Float32Array.BYTES_PER_ELEMENT
        },
        {            
            Address: 2,
            Size: 2,
            Type: 0x1406,
            IsNormalized:false,
            Stride : 8 * Float32Array.BYTES_PER_ELEMENT,
            Offset: 6 * Float32Array.BYTES_PER_ELEMENT
        }
        ]
    })

    var P2 = new LoadImagePack({
        "ImagePaths":["Checkboard.png"]
    })

    var P3 = new CPack({        
        "Ins":["IMAGES","PROGRAM"],
        "FX":function(){
            var Ports = this.Ports;
            var image = Ports.IMAGES[0];
            
            GPUProgram = Ports.PROGRAM;
            var MatWorldPos =  gl.getUniformLocation(GPUProgram,'MatWorld');
            MatCameraPos =  gl.getUniformLocation(GPUProgram,'MatCamera');
            var MatProjPos = gl.getUniformLocation(GPUProgram,'MatProj');
    
            gl.uniformMatrix4fv(MatWorldPos,gl.FALSE,MatWorld);
           
            gl.uniformMatrix4fv(MatProjPos,gl.FALSE,MatProj);
    

            TexBuffer = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D,TexBuffer);            
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);            
            gl.texImage2D(gl.TEXTURE_2D,0, gl.RGBA,image.width,image.height,0,gl.RGBA,gl.UNSIGNED_BYTE,image);
            gl.activeTexture(gl.TEXTURE0);
            
            Signal.DONE=1;
        }
    })

    var W = Cir8.MultiLink(P1,"X",P2,"X");
    var W1 =  Cir8.Link(P1,"PROGRAM","PROGRAM",P3);    
    var W2 = Cir8.Link(P2,"IMAGES","IMAGES",P3);
    W.Signal = "Start";
}

function Render() {
    var gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(GPUProgram);

    if(Keys[65]){
        Cam.LeftRight(-0.1);
    }

    if(Keys[68]){
        Cam.LeftRight(0.1);
    }

    if(Keys[87]){
        Cam.ForthBack(-0.1);
    }

    if(Keys[83]){
        Cam.ForthBack(0.1);
    }

    Cam.GetMatrix(MatCamera)
    gl.uniformMatrix4fv(MatCameraPos,gl.FALSE,MatCamera);
    gl.bindTexture(gl.TEXTURE_2D,TexBuffer); 
    gl.activeTexture(gl.TEXTURE0);
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