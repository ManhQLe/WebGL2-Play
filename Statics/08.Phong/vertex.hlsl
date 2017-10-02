#version 300 es
layout(location = 0) in vec3 pos;
layout(location = 1) in vec2 texcoord;
layout(location = 2) in vec3 normal;

struct LightStruct{
    vec3 Pos;
    vec3 La;
    vec3 Ld;
    vec3 Ls;
};

struct MaterialStruct {
    vec3 Ka;
    vec3 Kd;
    vec3 Ks;
    float Shininess;
};

uniform vec3 EyePos;
uniform LightStruct Light;
uniform MaterialStruct Material;

uniform mat4 MatCamera;
uniform mat4 MatProj;


out vec4 vcolor;
out vec2 vtexcoord;


void main(){
    vtexcoord = texcoord;    
    vec3 s = normalize(Light.Pos - vec3(pos));
    vec3 v = normalize(EyePos - vec3(pos));
    vec3 r = normalize(reflect(-s,normal));

    vec3 Ia = Light.La * Material.Ka;
    float sDotN = max(dot(s,normal),0.0);
    vec3 Id = Light.Ld * Material.Kd * sDotN;
    vec3 Is = vec3(0.0);
    if(sDotN > 0.0)
        Is = Light.Ls * Material.Ks * pow(max(dot(v,r),0.0),Material.Shininess);
    
    vcolor = vec4(Ia + Id + Is,1.0);d

    gl_Position = MatProj * MatCamera * vec4(pos,1.0);
    
}