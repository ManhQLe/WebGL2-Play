#version 300 es
layout(location = 0) in vec3 pos;
layout(location = 1) in vec2 texcoord;
layout(location = 2) in vec3 normal;

uniform mat4 MatCamera;
uniform mat4 MatProj;
uniform mat4 NormalMatrix;

uniform vec3 LightPosition;
uniform vec3 Kd;
uniform vec3 Ld;

out vec4 vcolor;
out vec2 vtexcoord;


void main(){
    vtexcoord = texcoord;
    vec4 enormal = vec3(NormalMatrix * vec4(normal,1.0));
    vec4 eyeCoords = MatCamera * vec4(pos,1.0)
    vec3 lightDir = normalize(LightPosition - vec3(eyeCoords));

    vcolor = Ld*Kd*max(dot(lightDir,vec3(enormal)),0.0)

    gl_Position = MatProj * eyeCoords;
    
}