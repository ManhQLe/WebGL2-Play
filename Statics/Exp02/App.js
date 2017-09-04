/// <reference path="../JS/GLGame.js" />
var ShaderSources = ["Vertex.hlsl", "Pixel.hlsl"];
var VBO;
var VAO;
var Locs = [{
        "Name": "pos",
        "Address": 0,
        "Size": 3,
        "Type": 0x1406,
        "Stride":6*Float32Array.BYTES_PER_ELEMENT,
        "Offset": 0,
    },
    {
        "Name": "color",
        "Address": 1,
        "Size": 3,
        "Type": 0x1406,
        "Stride":6*Float32Array.BYTES_PER_ELEMENT,
        "Offset": 3*Float32Array.BYTES_PER_ELEMENT,
    },


]
var Data = [
    0, 1, 0, 1, 0, 0, 
    -1, -1, 0, 0, 1, 0,
    1, 0, 0, 0, 0, 1
];


var Program;

function InitMyGame(Signal) {
    var gl = this.gl;
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    
    console.log("Ran");
    Signal.DONE = 1;
}

function LoadMyData(Signal) {
    console.log("Loading...");
    var gl = this.gl;

    
    Async8.DPQueue(ShaderSources, function (Done, ps, i) {        
        var Path = ps[i];        
        $.ajax({
            url: Path,
            dataType: "text",
            success: function(d){               
                Done(d);
            }
        });
    }, function (R) {            
        var VS = GLGame.CreateShader(gl, R[0],"VS");
        var PS = GLGame.CreateShader(gl, R[1],"PS");
        //VAO = GLGame.CreateVAO(gl);
        VBO = GLGame.CreateVBO(gl, Data, false);
        Locs.forEach(function(Loc){
            gl.enableVertexAttribArray(Loc.Address);
            gl.vertexAttribPointer(Loc.Address,Loc.Size,gl.FLOAT,false,Loc.Stride,Loc.Offset);
        });
        Program = GLGame.CreateProgram(gl, VS, PS);
        
        //Recording action
        
        
        //
        //gl.bindVertexArray(null);
        Signal.DONE = 1;
    });

}

function DrawThings() {
    var gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(Program);    
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}


var Game1 = new GLGame({
    Width: 800,
    Height: 600,
    Canvas: "#CANVAS",
    Init: InitMyGame,
    LoadData: LoadMyData,
    Render: DrawThings
});

Game1.Start();