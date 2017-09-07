/// <reference path="../JS/gl-matrix-min.js" />
/// <reference path="../JS/Ctrl8.js" />
function Camera(Init){
    Camera.baseConstructor.call(this,Init);
    this.Prop("Eye",new Float32Array([1,1,1]));
    this.Prop("At",new Float32Array([0,0,0]));
    this.Prop("Up",new Float32Array([0,0,1]));        
    this.Prop("Look",new Float32Array([0,0,1]));        

    vec3.sub(this.Look,this.At,this.Eye);
    var Right = new Float32Array([0,0,0]);
    vec3.cross(Right,this.Look,this.Up);
    vec3.cross(this.Up,Right,this.Look);
}

EventCtrl.ExtendsTo(Camera);

Camera.prototype.Setup = function(eye,at,up){

}