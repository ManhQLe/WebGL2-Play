#version 300 es
layout(location = 0) in vec3 pos;
layout(location = 1) in vec2 texcoord;
layout(location = 2) in vec3 normal;

struct LightStruct{
    vec3 Pos;
    vec3 Li;
};

struct MaterialStruct {
    vec3 Ka;
    vec3 Kd;
    vec3 Ks;
    float Shininess;
};

uniform vec3 EyePos;
uniform LightStruct Lights[5];
uniform int NofLight;

uniform MaterialStruct Material;

uniform mat4 MatCamera;
uniform mat4 MatProj;


out vec4 vcolor;
out vec2 vtexcoord;

vec4 PhongModel(int LightIdx,vec3 Position,vec3 Norm){
    vec3 s = normalize(Lights[LightIdx].Pos - Position);
    vec3 v = normalize(EyePos - Position);
    vec3 r =normalize(reflect(-s,Norm));

    vec3 I = Lights[LightIdx].Li;

    return vec4(
        I* (Material.Ka + Material.Kd*max(dot(s,Norm),0.0) +
            Material.Ks * pow( max(dot(r,v),0.0), Material.Shininess)
        ) ,1.0);
}


void main(){
    vtexcoord = texcoord;    
    vcolor = vec4(0.0);
    for(int i = 0;i<NofLight;i++)
    vcolor += PhongModel(i,pos,normal);

    gl_Position = MatProj * MatCamera * vec4(pos,1.0);
    
}