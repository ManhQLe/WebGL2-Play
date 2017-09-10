/// <reference path="../JS/gl-matrix-min.js" />
/// <reference path="../JS/Ctrl8.js" />

if (!vec3.rotate) {
    vec3.rotate = function (out,r, v, ang) {
        var c = Math.cos(ang);
        var s = Math.sin(ang);
        var onec = 1 - c;
        var x = v[0],
            y = v[1],
            z = v[2];
        var xy = x * y;
        var yz = y * z;
        var xz = x * z;
        var a, b, c;

        var m = new Float32Array(9);

        m[0] = c + onec * x * x //00
        m[1] = onec * xy - s * z //01
        m[2] = onec * xz + s * y //02
        m[3] = onec * xy + s * z //10
        m[4] = c + onec * y * y //11
        m[5] = onec * yz - s * x //12
        m[6] = onec * xz - s * y //20        
        m[7] = onec * yz + s * x //21
        m[8] = c + onec * z * z //22           
        a = m[0] * r[0] + m[1] * r[1] + m[2] * r[2];
        b = m[3] * r[0] + m[4] * r[1] + m[5] * r[2];
        c = m[6] * r[0] + m[7] * r[1] + m[8] * r[2];
        out[0] = a;
        out[1] = b;
        out[2] = c;
    }
}

function Camera(Init) {
    Camera.baseConstructor.call(this, Init);
    this.Prop("Pos", new Float32Array([0, 0, 0]));
    this.Up = [0,1,0];
    this.Dir = [0,0,1];
    this.Right = [1,0,0];
}

EventCtrl.ExtendsTo(Camera);

Camera.prototype.SetPitch = function(a){
    var Up =this.Up;
    var Dir = this.Dir;
    var Right = this.Right;
    vec3.rotate(Dir, Dir, Right, a * Math.PI / 180)
    vec3.rotate(Up,Up, Right,a * Math.PI / 180)    
    vec3.normalize(Dir,Dir);
    vec3.normalize(Up,Up);
    vec3.cross(Right,Up,Dir);

}

Camera.prototype.LeftRight = function(x){
    var o = [0,0,0];
    vec3.scale(o,this.Right,x);
    vec3.add(this.Pos,this.Pos,o);
}

Camera.prototype.UpDown = function(y){
    var o = [0,0,0];
    vec3.scale(o,this.Up,y);
    console.log(this.Up);
    vec3.add(this.Pos,this.Pos,o);
}

Camera.prototype.ForthBack = function(z){
    var o = [0,0,0];
    vec3.scale(o,this.Dir,z);    
    vec3.add(this.Pos,this.Pos,o);
}

Camera.prototype.SetYaw = function(a){
    var Up =this.Up;
    var Dir = this.Dir;
    var Right = this.Right;
    vec3.rotate(Dir,Dir, Up, a * Math.PI / 180);    
    vec3.rotate(Right,Right, Up,  a * Math.PI / 180);    
    vec3.normalize(Dir,Dir)
    vec3.normalize(Right,Right)
    vec3.cross(Up,Dir,Right);
}

Camera.prototype.GetMatrix = function (m) {
    var Up =this.Up;
    var Dir = this.Dir;
    var Right = this.Right;
    var pos = [-this.Pos[0],-this.Pos[1],-this.Pos[2]];
    mat4.fromTranslation(m,pos)    
    var x = new Float32Array(16);
    mat4.set(
        x,
        Right[0], Up[0], Dir[0], 0,
        Right[1], Up[1], Dir[1], 0,
        Right[2], Up[2], Dir[2],0,
        0, 0, 0, 1
    )
    
   mat4.multiply(m,m,x);

}