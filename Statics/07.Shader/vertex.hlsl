#version 300 es
layout(location = 0) in vec3 pos;
layout(location = 1) in vec2 texcoord;
layout(location = 2) in vec3 normal;

uniform mat4 MatCamera;
uniform mat4 MatProj;
uniform mat4 NormalMatrix;


out vec4 vcolor;
out vec2 vtexcoord;


void main(){
    vtexcoord = texcoord;
    vnormal = vec3(NormalMatrix * vec4(normal,1.0));
    gl_Position = MatProj * MatCamera * vec4(pos,1.0);
    vcolor = vec4(1,1,1,1.0);
}